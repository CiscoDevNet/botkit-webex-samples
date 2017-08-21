//
// variables: threaded conversation where variables are set to store user choices
//
// Q: "What about coffee (yes / no / cancel)"
// A: no
// Q: "What would you like to drink?"
// A: Coke
//
// => drink = "Coke"
//
module.exports = function (controller) {

    controller.hears(['variables'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.addQuestion('What would you like to drink?', function (response, convo) {
                convo.say('I love ' + response.text + ' too');
                convo.setVar('drink', response.text);
                convo.next();
            }, {}, 'ask-drink');

            convo.ask("What about coffee (yes/**no**/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {
                        convo.say("Go, get some !");
                        convo.setVar('drink', "coffee");
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

            convo.on('end', function (convo) {
                if (convo.status == 'completed') {
                    var drink = convo.vars["drink"];
                    if (drink) {
                        console.log("LOG: picked: " + drink);
                    } else {
                        console.log("LOG: no drink was picked");
                    }
                }
            });
        });
    });
};
