//
// Change RoomKit settings
//

const debug = require("debug")("settings");
const isAuthorized = require("./utils/restricted.js");

module.exports = function (controller) {

    controller.hears(['configure', 'update', "device"], 'direct_message,direct_mention', function (bot, message) {

        // Check access
        if (!isAuthorized(bot, message)) {
            bot.reply(message, "sorry, you're not authorized to access the configuration settings of the device");
            return;
        }

        bot.startConversation(message, function (err, convo) {

            var text = "Your current device info are:";
            text += `\n- url      : ${bot.roomkit.device.url}`;
            text += `\n- username : ${bot.roomkit.device.username}`;
            convo.sayFirst(text);

            convo.ask("Do you want to update your configuration? (yes/no/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {
                        convo.gotoThread("capture-ipaddress");
                    }
                }
                , {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.say("OK, keeping current settings.");
                        convo.next();
                    }
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, cancelling...");
                        convo.next();
                    }
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // [TODO] Use a thread to provide extra info
                        //convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);

            convo.addQuestion("What is the device's ip address? (cancel)", [
                {
                    pattern: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                    callback: function (response, convo) {
                        convo.gotoThread("capture-username");
                    },
                },
                {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, keeping current settings...");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // [TODO] Use a thread to provide extra info
                        //convo.say("Sorry, I am expecting an ip address.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], { key: "ipaddress" }, "capture-ipaddress");

            convo.addQuestion("What is the device's username? (cancel)", [
                {
                    pattern: /^\w{3,}$/,
                    callback: function (response, convo) {
                        convo.gotoThread("capture-password");
                    },
                },
                {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, keeping current settings...");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // [TODO] Use a thread to provide extra info
                        //convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], { key: "username" }, "capture-username");

            convo.addQuestion("What is the device's password? (cancel)", [
                {
                    pattern: /^\w{3,}$/,
                    callback: function (response, convo) {
                        convo.gotoThread("confirm-changes");
                    },
                },
                {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, keeping current settings...");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // [TODO] Use a thread to provide extra info
                        //convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], { key: "password" }, "capture-password");

            convo.addQuestion("Please confirm to update: (yes/no)", [
                {
                    pattern: "yes|oui|yep|yeh|da|ya|si",
                    callback: function (response, convo) {
                        bot.roomkit.device = {
                            'url': "ssh://" + convo.getResponses()['ipaddress'].answer,
                            'username': convo.getResponses()['username'].answer,
                            'password': convo.getResponses()['password'].answer,
                        };
                        bot.roomkit.connect();
                        convo.say("New settings stored, and now connected to the device.");
                        convo.next();
                    }
                },
                {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.say("Got it, keeping current settings...");
                        convo.next();
                    }
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // [TODO] Use a thread to provide extra info
                        //convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], {}, "confirm-changes");

        });
    });
};