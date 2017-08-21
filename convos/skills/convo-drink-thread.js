//
// drink: illustes mutiple threaded conversation
//
// Q: "What about coffee (yes / no / cancel)"
// A: no
// Q: "What would you like to drink?"
// A: Coke
//
module.exports = function (controller) {

    controller.hears(['drink'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.addQuestion('What would you like to drink?', function (response, convo) {
                convo.say('I love ' + response.text + ' too');
                convo.next();
            }, {}, 'ask-drink');

            convo.ask("What about coffee (yes/**no**/cancel)", [
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
                        convo.gotoThread('ask-drink');
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
