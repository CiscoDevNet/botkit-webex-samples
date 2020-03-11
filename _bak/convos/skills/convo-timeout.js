//
// timeout: shows how Botkit timeouts behave in a conversation
//
// https://github.com/howdyai/botkit/blob/master/docs/readme.md#handling-conversation-timeouts
//
module.exports = function (controller) {

    controller.hears(['timeout'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.sayFirst("Are you this kind of person that do not answer? Let's check that...");

            convo.ask("**What's your favorite color ?**", function (response, convo) {
                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            });

            // If no answer after a minute, we want to give a few chances, then cancel the flow
            convo.setVar('chances', 1);
            convo.setTimeout(3000); // in milliseconds
            convo.onTimeout(function (convo) {
                var chances = convo.vars["chances"];
                if (chances < 3) {
                    convo.setVar('chances', ++chances);

                    convo.gotoThread('bad_response');
                }
                else {
                    convo.say("Looks like you're gone, cancelling...");
                    convo.next();
                }
            });

            // Bad response
            convo.addMessage({
                text: 'Did not hear from you :-( <br/>_giving you another chance_',
                action: 'default', // goes back to the thread's current state, where the question is not answered
            }, 'bad_response');
        });
    });
};
