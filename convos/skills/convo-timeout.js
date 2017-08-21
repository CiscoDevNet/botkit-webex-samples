//
// timeout: shows how BotKit timeouts behave in a conversation
//
// https://github.com/howdyai/botkit/blob/master/docs/readme.md#handling-conversation-timeouts
//
module.exports = function (controller) {

    controller.hears(['timeout'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.sayFirst("Then you're this kind of people that do not answer? let's check that...");

            convo.ask("What's your favorite color ?", function(response, convo) {
                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            });

            // If no answer after a minute, we want to give a few chances, then cancel the flow
            convo.setVar('chances', 1);
            convo.setTimeout(5000); // in milliseconds
            convo.onTimeout(function (convo) {
                var chances = convo.vars["chances"];
                if (chances < 3) {
                    chances++;
                    convo.setVar('chances', chances);
                    
                    convo.say('Did not hear from you :-(, giving you another chance ');
                    convo.repeat();
                    convo.next();
                }
                else {
                    convo.say("Looks like you're gone, cancelling...");
                    convo.next();
                }
            });
        });
    });
};
