//
// example to show how BotKit timeouts behave
// https://github.com/howdyai/botkit/blob/master/docs/readme.md#handling-conversation-timeouts
//
module.exports = function (controller) {

    controller.hears(['disturbed'], 'direct_message,direct_mention', function (bot, message) {

        bot.createConversation(message, function (err, convo) {
            convo.sayFirst("Then you're a disturbed person, let's check that...");

            convo.ask("What's your favorite color ?", function(response, convo) {
                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            });

            // If no answer after a minute, we want to give a few chances, then cancel the flow
            convo.setVar('chances', 1);
            convo.setTimeout(10000); // in milliseconds
            convo.onTimeout(function (convo) {
                var chances = convo.vars["chances"];
                if (chances < 2) {
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

            convo.activate();
        });
    });
};
