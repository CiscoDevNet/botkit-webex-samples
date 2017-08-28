//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "Simply put, I am a Redis storage demo for Botkit.";
        text += "\n\nTo experiment the 'users' storage, type:";
        text += "\n- " + bot.enrichCommand(message, 'save "a string"') + ": stores the specified value as private to the current user";
        text += "\n- " + bot.enrichCommand(message, "read") + ": shows the last stored value for the user";     
        text += "\n\nTo experiment a custom 'global' storage, type";
        text += "\n- " + bot.enrichCommand(message, 'init') + ": load some activities into Redis";
        text += "\n- " + bot.enrichCommand(message, 'activities') + ": shows the stored list of activities";
        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        bot.reply(message, text);
    });
}
