//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a Cisco Spark bot that:
 *   - sends a welcome message as he joins a room, 
 *   - answers to a /hello command, and greets the user that chatted him
 *   - supports /help and a fallback helper message
 * 
 */

var Botkit = require('botkit');

if (!process.env.SPARK_TOKEN) {
    console.log("Could not start as this bot requires a Cisco Spark API access token.");
    console.log("Please add env variable SPARK_TOKEN on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.SPARK_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Cisco Spark
    webhook_name: process.env.WEBHOOK_NAME || 'built with BotKit (development)'
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("SPARK: Webhooks set up!");
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
    var email = message.user; // Spark User that created the message orginally 
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
// sent as the bot is added to a Room
//
controller.on('bot_space_join', function(bot, message) {
    bot.reply(message, "Hi, I am the Hello World bot !\n\nType `hello` to see me in action.", function(err, newMessage) {
        if (newMessage.roomType == "group") {
            bot.reply(message, "\n\n**Note that this is a 'Group' room. I will answer only when mentionned.**");
        }
    });
});

