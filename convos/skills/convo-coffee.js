//
// coffee: example of a conversation with yes/no options
//
// "What about coffee (yes / no / cancel)"
//
module.exports = function (controller) {

    controller.hears(['coffee'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("What about coffee (yes/no/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {
                        convo.say("Go, get some !");
                        convo.next();
                    },
                }
                , {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.say("I am not a big fan neither.");
                        convo.next();
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, cancelling...");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
        });
    });
};
