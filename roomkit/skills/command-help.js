//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "See me as an extension of your RoomKit:";
        text += "\n- " + bot.enrichCommand(message, "peoplecount") + ": displays the number of faces detected";
        text += "\n\nI also have extra skills though:"
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the word about my skills";
        bot.reply(message, text);
    });
}
