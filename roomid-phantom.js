//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a bot that gives you instant info about the group room he's added to. Note that the bot exists immediately the group room.
 * 
 * note : this example could work with both a human (developer) or a bot account, 
 * but the philosophy of this bot is really to use it with a bot account
 *  
 */

// Starts your Bot with default configuration. The SPARK API access token is read from the SPARK_TOKEN env variable 
var Botkit = require('botkit');

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.SPARK_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Cisco Spark
    webhook_name: process.env.WEBHOOK_NAME || 'built with BotKit (development)'
});
var bot = controller.spawn({
});
controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
    });
});


//
// Help command
//
controller.hears(['^help'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "I am an ephemeral bot !\n\nAdd me to a Room: I'll send you back the room id in a private message and leave the room right away.\n- /about\n- /help\n" );
});


//
// Meta info
//
controller.hears(['^about'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "```json\n{\n   'author':'Stève Sfartz <stsfartz@cisco.com>',\n   'code':'https://github.com/CiscoDevNet/botkit-ciscospark-samples/blob/master/examples/roomid-phantom.js',\n   'description':'a handy tool to retreive Spark Rooms identifiers'\n}\n```" );
});


//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "sorry, I did not understand, please type:\n- /about\n- /help\n");
});


//
// Welcome message 
// sent as the bot is added to a Room
//
controller.on('bot_space_join', function (bot, trigger) {
    // only take action if it is not the bot who created the room, to send the message back
    var actorId = trigger.original_message.actorId;
    if (actorId == controller.identity.id) {
        console.log("Bot is creating the room, leave it there...");
        return;
    }

    // create a 1-1 room with the actor
    bot.botkit.startTask(bot, {
        toPersonId: actorId
    }, function (task, convo) {
        convo.say("extracted room id: **" + trigger.channel + "**\n\nwill now leave the room you asked me to inquire on...");

        // Leave room we got initially added to
        bot.botkit.api.memberships.remove(trigger.id).then(function() {
            // Inform in 1-1 that group room was left
            convo.say("job done, I have left the inquired room. Au revoir !");
        }).catch(function (err) {
            // [PENDNG] not sure about this error catch block because of the mix of promise & callback
            console.log("Bot could not leave room...");
        });
    });
});