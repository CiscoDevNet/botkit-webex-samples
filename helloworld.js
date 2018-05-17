//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a Webex Teams bot that:
 *   - sends a welcome message as he joins a room, 
 *   - answers to a 'hello' command, and greets the user that chatted him
 *   - supports 'help' and a fallback helper message
 * 
 */

var Botkit = require('botkit');

// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
var accessToken = process.env.ACCESS_TOKEN || process.env.SPARK_TOKEN 
if (!accessToken) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please invoke with an ACCESS_TOKEN environment variable");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: accessToken,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks if incoming payloads originate from Webex
    webhook_name: process.env.WEBHOOK_NAME || 'built with BotKit (development)'
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("Webhooks set up!");
    });
});



//
// Help command
//
controller.hears(['^help'], 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, "Hi, I am the Hello World bot !\n\nType `hello` to see me in action.");
});


//
// Bots commands here
//
controller.hears(['^hello'], 'direct_message,direct_mention', function(bot, message) {
    var email = message.user; // Webex Teams User that created the message orginally 
    bot.reply(message, "Hello <@personEmail:" + email + ">");
});


//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "sorry, I did not understand.<br/>Type help for supported skills." );
});


//
// Welcome message 
// Fired as the bot is added to a space
//
controller.on('bot_space_join', function(bot, message) {
    bot.reply(message, "Hi, I am the Hello World bot !\n\nType `hello` to see me in action.", function(err, newMessage) {
        if (newMessage.roomType == "group") {
            bot.reply(message, "\n\n**Note that this is a 'Group' space. I will answer only when mentionned.**");
        }
    });
});

