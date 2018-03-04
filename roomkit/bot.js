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

if (!process.env.SPARK_TOKEN) {
    console.error("Could not start as bots require a Cisco Spark API access token.");
    console.error("Please add env variable SPARK_TOKEN on the command line or to the .env file");
    console.error("Example: ");
    console.error("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.error("Could not start as this bot must expose a public endpoint.");
    console.error("Please add env variable PUBLIC_URL on the command line or to the .env file");
    console.error("Example: ");
    console.error("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var env = process.env.NODE_ENV || "development";

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.SPARK_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Cisco Spark
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
        console.log("Roomkit: loading the jsxapi library");
        const jsxapi = require('jsxapi');

        console.log(`RoomKit: connecting to RoomKit device listening at: ${this.device.url}`);
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
            console.log("RoomKit: successfully connected to the device");
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
    "nickname": process.env.BOT_NICKNAME || "unknown",
    "code": process.env.code
};

// Start Bot API
controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("Cisco Spark: Webhooks set up!");
    });

    // installing Healthcheck
    webserver.get('/ping', function (req, res) {
        res.json(bot.commons);
    });
    console.log("Cisco Spark: healthcheck available at: " + bot.commons.healthcheck);

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
            console.log("Cisco Spark: loaded skill: " + file);
        }
    }
    catch (err) {
        if (err.code && (err.code == "MODULE_NOT_FOUND")) {
            console.log("Cisco Spark: could not find module in skill: " + file);
            return;
        }
        if (err.name && (err.name == "SyntaxError")) {
            console.log("Cisco Spark: syntax error in skill: " + file + ", err: " + err.message);
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
