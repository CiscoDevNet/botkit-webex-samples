//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//


// Load env variables 
var env = require('node-env-file');
env(__dirname + '/.env');

//
// BotKit initialization
//

var Botkit = require('botkit');

// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
var accessToken = process.env.ACCESS_TOKEN || process.env.SPARK_TOKEN 
if (!accessToken) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please invoke with an ACCESS_TOKEN environment variable");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var env = process.env.NODE_ENV || "development";

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: accessToken,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks if incoming payloads originate from Webex
    webhook_name: process.env.WEBHOOK_NAME || ('built with BotKit (' + env + ')')
});

var bot = controller.spawn({
});


//
// RoomKit initialization
//

// Check args
if (!process.env.JSXAPI_DEVICE_URL || !process.env.JSXAPI_USERNAME) {
    console.error("Please specify info to connect to your device as JSXAPI_DEVICE_URL, JSXAPI_USERNAME, JSXAPI_PASSWORD env variables");
    console.error("Bash example: JSXAPI_DEVICE_URL='ssh://10.10.1.52' JSXAPI_USERNAME='integrator' JSXAPI_PASSWORD='integrator' node example.js");
    process.exit(1);
}

// Set RoomKit default device
bot.roomkit = {
    device: {
        'url': process.env.JSXAPI_DEVICE_URL,
        'username': process.env.JSXAPI_USERNAME,
        // Empty passwords are supported
        'password': process.env.JSXAPI_PASSWORD ? process.env.JSXAPI_PASSWORD : ""
    },
    connection: {
        state: "not connected", // not connected, connecting, failed, success
        reason: ""
    },
    connect: function () {
        console.log("roomkit: loading the jsxapi library");
        const jsxapi = require('jsxapi');

        console.log(`roomKit: connecting to the device listening at: ${this.device.url}`);
        this.connection.state = "connecting";
        this.xapi = jsxapi.connect(this.device.url, {
            username: this.device.username,
            password: this.device.password
        });
        this.xapi.on('error', (err) => {
            console.error(`RoomKit: connecting to device failed: ${err}`);
            this.connection.state = "failed";
        });

        this.xapi.on('ready', () => {
            console.log("roomKit: successfully connected to the device");
            this.connection.state = "success";
        });
    }
}


// Load BotCommons properties
bot.commons = {
    "healthcheck": process.env.PUBLIC_URL + "/ping",
    "up-since": new Date(Date.now()).toGMTString(),
    "version": "v" + require("./package.json").version,
    "owner": process.env.owner,
    "support": process.env.support,
    "platform": process.env.platfom,
    "code": process.env.code
};

// Start Bot API
controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("webhooks setup successful");
    });

    // installing Healthcheck
    webserver.get('/ping', function (req, res) {
        res.json(bot.commons);
    });
    console.log("healthcheck available at: " + bot.commons.healthcheck);

    // Connect to RoomKit device
    bot.roomkit.connect();
});

// Load skills
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    try {
        // Read JS scripts
        if (file.match(/\.js$/)) {
            require("./skills/" + file)(controller);
            console.log("loaded skill: " + file);
        }
    }
    catch (err) {
        if (err.code && (err.code == "MODULE_NOT_FOUND")) {
            console.log("could not find module in skill: " + file);
            return;
        }
        if (err.name && (err.name == "SyntaxError")) {
            console.log("syntax error in skill: " + file + ", err: " + err.message);
            return;
        }
    }
});

// Utility to add mentions if Bot is in a 'Group' space
bot.enrichCommand = function (message, command) {
    var botName = process.env.BOT_NICKNAME || "BotName";
    if ("group" == message.roomType) {
        return "`@" + botName + " " + command + "`";
    }
    if (message.original_message) {
        if ("group" == message.original_message.roomType) {
            return "`@" + botName + " " + command + "`";
        }
    }
    return "`" + command + "`";
}
