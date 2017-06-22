//
// Fallback Command
//
module.exports = function (controller) {

    controller.hears(["(.*)"], 'direct_message,direct_mention', function (bot, message) {
        var mardown = "Sorry, I did not understand.<br/>Try "
            + bot.enrichCommand(message, "help");
            
        bot.reply(message, mardown);
    });
}