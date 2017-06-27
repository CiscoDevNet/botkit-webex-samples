//
// color: simplest use of Botkit's conversation system.
//
// In this example, Botkit hears a keyword, then asks a question. The answer is free text.
//
module.exports = function (controller) {

    controller.hears(['color'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.say('This is an example of using convo.ask with a single callback.');

            convo.ask('What is your favorite color?', function (response, convo) {
                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();
            });
        });

    });
};