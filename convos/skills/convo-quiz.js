//
// Quiz: example of a muti-threaded conversation with timeout
//
//
module.exports = function (controller) {

    controller.hears(['quiz'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            // Default thread
            convo.ask("Ready for a challenge (yes/no/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {

                        // Apply elaps time (in milliseconds) to next askQuestion
                        convo.setTimeout(5000);
                        convo.onTimeout(function (convo) {
                            convo.gotoThread("missed");
                        });

                        convo.gotoThread('quiz');
                    },
                }
                , {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.say("Too bad, looking forward to play with you later...");
                        convo.next();
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.gotoThread('cancel');
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

            // Cancel thread
            convo.addMessage({
                text: "Got it, cancelling...",
                action: 'stop', // this marks the converation as unsuccessful
            }, 'cancel');

            // Quiz thread
            convo.addMessage("Let's start", "quiz");
            var challenge = pickChallenge();
            convo.addQuestion("Question: " + challenge.question, [
                {
                    pattern: "^"+ challenge.answer + "$",
                    callback: function (response, convo) {
                        convo.gotoThread('success');
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.gotoThread('cancel');
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, wrong answer. Try again!");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], {}, 'quiz');

            // Success thread
            convo.addMessage("Congrats, you did it!", "success");

            // Missed thread
            convo.addMessage("Time elapsed! you missed it, sorry.", "missed");
        });
    });
};


function pickChallenge() {
    var a = Math.round(Math.random()*5) + 4;
    var b = Math.round(Math.random()*5) + 4;
    return {
        question : "" + a + " x " + b + " =",
        answer : "" + (a * b)
    }
}