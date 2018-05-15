//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "See me as an extension of your RoomKit device:";
        text += "\n- " + bot.enrichCommand(message, "count") + ": displays the number of faces detected by the device";
        text += "\n- " + bot.enrichCommand(message, "configure") + ": change parameters to connect to the device";
        text += "\n- " + bot.enrichCommand(message, "device") + ": shows the device's current parameters";
        text += "\n\nalso I have a few extra skills:"
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about the bot";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the word about its skills";
        bot.reply(message, text);
    });
}
