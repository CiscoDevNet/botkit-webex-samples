module.exports = function (controller) {

    controller.hears(["restricted"], "direct_message,direct_mention", function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("**What is your favorite color?**", [
                {
                    pattern: "^blue|green|pink|red|yellow$",
                    callback: function (response, convo) {
                        convo.say('Cool, I like ' + response.text + ' too!');
                        convo.next();
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        // We've got 2 options at this point:

                        // 1. simply repeat the question
                        convo.repeat();
                        convo.next();

                        // 2. or provide extra info, then repeat the question
                        //convo.gotoThread("bad_response");
                    }
                }
            ]);

            // Bad response
            //convo.addMessage({
            //    text: "Sorry, I don't know this color!<br/>_Tip: try 'blue', 'green', 'pink', 'red' or 'yellow._'",
            //    action: 'default', // goes back to the thread's current state, where the question is not answered
            //}, 'bad_response');
        });
    });
};





