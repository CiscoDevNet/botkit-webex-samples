//
// responses: conversation with strict options.
//
// The response is vehiculed among threads with conversation context
//
//
module.exports = function (controller) {

    controller.hears(["responses"], "direct_message,direct_mention", function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("What is your favorite color?", [
                {
                    pattern: "^blue|green|ping|red|yellow$",
                    callback: function (response, convo) {
                        convo.gotoThread("success");
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread("bad_response");
                    }
                }
            ], { key: "picked" });

            // Success thread
            convo.addMessage(
                "I love the '{{responses.picked}}' color too!",
                "success");

            // Bad response
            convo.addMessage({
                text: "Sorry, I don't know this color. Try again...",
                action: 'default', // goes back to the thread's current state, where the question is not answered
            }, 'bad_response');
        });
    });
};
