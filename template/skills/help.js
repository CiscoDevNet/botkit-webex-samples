//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention,mention', function (bot, message) {
        var text = "Here are the commands I understand " 
         + bot.enrichCommand(message, ".commons")
         + ", " 
         + bot.enrichCommand(message, "help") 

        bot.reply(message, text);
    });
}
