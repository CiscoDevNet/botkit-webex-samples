module.exports = function (controller) {

    controller.hears(["threads"], "direct_message,direct_mention", function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("What is your favorite color?", [
                {
                    pattern: "^blue|green|pink|red|yellow$",
                    callback: function (response, convo) {
                        convo.gotoThread("success");
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, I don't know this color. Try another one...");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], { key: "answer" });

            // Success thread
            convo.addMessage(
                "Cool, I love '{{responses.answer}}' too",
                "success");
        });
    });
};
