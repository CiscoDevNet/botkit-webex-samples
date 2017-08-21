//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "Here are my skills:";
        text += "\n- " + bot.enrichCommand(message, "color") + ": ask a user to pick a random color";
        text += "\n- " + bot.enrichCommand(message, "restricted") + ": let a user pick a color among a set of options";
        text += "\n- " + bot.enrichCommand(message, "threads") + ": branch to another thread";
        text += "\n- " + bot.enrichCommand(message, "variables") + ": enrich user-context amonf threads";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": display metadata about myself";
        bot.reply(message, text);
    });
}
