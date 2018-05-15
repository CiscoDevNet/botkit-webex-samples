//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/**
 * WebSocket example for Webex Teams using Botkit
 * WARNING: note that this code leverages a 3rd party library not supported by Cisco
 */

// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
var accessToken = process.env.ACCESS_TOKEN || process.env.SPARK_TOKEN 
if (!accessToken) {
    console.log("Please specify an access token via an ACCESS_TOKEN environment variable");
    process.exit(2);
}

var port = process.env.PORT || 3000;


// Websocket Intialization
var UnsupportedWebSocketLibrary = require('ciscospark-websocket-events');
websocket = new UnsupportedWebSocketLibrary(accessToken);
websocket.connect(function (err, res) {
    if (!err) {
        websocket.setWebHookURL("http://localhost:" + port + "/webhook");
    }
    else {
        console.log("Error starting up websocket: " + err);
    }
})

//////// Botkit //////

var Botkit = require('botkit');
var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: "https://localhost",
    ciscospark_access_token: accessToken
});

var bot = controller.spawn({
});

controller.setupWebserver(port, function (err, webserver) {

    //setup incoming webhook handler
    webserver.post('/webhook', function (req, res) {
        res.sendStatus(200);
        controller.handleWebhookPayload(req, res, bot);
    });

});


//
// Bot custom logic
//

var emoji = require('node-emoji');


// Display an emoji picked randomly
controller.hears(['random'], 'direct_message,direct_mention', function (bot, message) {
    var random = emoji.random();
    var email = message.user; // Webex Teams User that created the message orginally 
    bot.reply(message, "hey <@personEmail:" + email + ">, type `:" + random.key + ":` to get " + random.emoji);
});


// Search among mapped emoji tags
controller.hears(['search\s*(.*)', 'find\s*(.*)'], 'direct_message,direct_mention', function (bot, message) {
    var keyword = message.match[1].trim();
    if (!keyword) {
        bot.reply(message, "what are you exactly looking for ?");
        return;
    }

    var found = emoji.search(keyword);
    switch (found.length) {
        case 0:
            bot.reply(message, "sorry, no match " + emoji.get("persevere"));
            return;
        case 1:
            bot.reply(message, emoji.get("+1") + " try `:" + found[0].key + ":` for " + found[0].emoji);
            return;
        default:
            var max = (found.length < 3) ? found.length : 3;
            var response = "found " + found.length + ", showing " + max + "\n\n";
            for (i = 0; i < max; i++) {
                response += "- try `:" + found[i].key + ":` for " + found[i].emoji + "\n\n";
            }
            bot.reply(message, response);
            return;
    }
});


// Help command
controller.hears(['help'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "Hi, I am the Emoji bot!\n\nType a sentence with an emoji tag such as \`:heart:\` to see me in action.\n\nYou can also try \`find\` and \`random\` commands.");
});


// Defaut (fallback) command just translates the submitted text
controller.hears('', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, emoji.emojify(message.text));
});


// Welcome message 
controller.on('bot_space_join', function (bot, message) {
    bot.reply(message, "Hi, I am the Emoji bot!\n\nType a sentence with an emoji tag such as \`:heart:\` to see me in action.", function (err, newMessage) {
        if (newMessage.roomType == "group") {
            bot.reply(message, "\n\n**Note that this is a 'Group' space. I will answer only when mentionned.**");
        }
    });
});
