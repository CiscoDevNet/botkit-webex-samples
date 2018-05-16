//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a bot that gives you instant info about any space he's added to, and exits the space when done.
 * 
 * note : this example works with both a human and a bot access token, 
 * but the philosophy of this bot is really to be used from a bot access token
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
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node roomid-phantom.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node roomid-phantom.js");
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

controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("Webhooks set up!");
    });
});


//
// Help command
//
controller.hears(['^help'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "I am an ephemeral bot !\n\nAdd me to a space: I'll post back to you the space identifier via a private message, and exit right away." );
});


//
// Meta info
//
controller.hears(['^about'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "```json\n{\n   'author':'Stève Sfartz <stsfartz@cisco.com>',\n   'code':'https://github.com/CiscoDevNet/botkit-webex-samples/blob/master/examples/roomid-phantom.js',\n   'description':'a handy tool to retreive space identifiers'\n}\n```" );
});


//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "sorry, I did not understand, please type:\n- about\n- help\n");
});


//
// Welcome message 
// sent as the bot is added to a Room
//
controller.on('bot_space_join', function (bot, trigger) {
    // only take action if it is not the bot who created the room, to send the message back
    var actorId = trigger.actorId;
    if (actorId == controller.identity.id) {
        console.log("Bot is creating the space, leave it there...");
        return;
    }

    // create a 1-1 room with the actor
    bot.startPrivateConversationWithPersonId(actorId, function (task, convo) {
        convo.say("extracted space identifier: **" + trigger.channel + "**\n\nwill now leave the space you asked me to inquire on...");

        // Leave room we got initially added to by deleting membership
        bot.botkit.api.memberships.remove(trigger.id);
    });
});