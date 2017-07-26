//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "My skills are mainly about showing conversations examples (ordered by complexity) :";
        text += "\n- " + bot.enrichCommand(message, "color") + ": simplest conversation";
        text += "\n- " + bot.enrichCommand(message, "coffee") + ": conversation with yes/no menu option";
        text += "\n- " + bot.enrichCommand(message, "timeout") + ": shows how BotKit timeouts behave in a conversation";
        text += "\n- " + bot.enrichCommand(message, "activities") + ": conversation with an advanced menu";
        text += "\n- " + bot.enrichCommand(message, "loop") + ": conversation with a menu that loops until explicitly stopped";
        text += "\n- " + bot.enrichCommand(message, "cheese") + ":  simple use of Botkit's threads conversation system";
        text += "\n- " + bot.enrichCommand(message, "drink") + ": illustrates BotKit threaded conversations";
        text += "\n- " + bot.enrichCommand(message, "variables") + ": threaded conversation where variables are set to store user choices";
        text += "\n- " + bot.enrichCommand(message, "responses") + ": threaded conversation where user responses are vehiculed via context";
        text += "\n- " + bot.enrichCommand(message, "quiz") + ": threaded conversation with timeout";
        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        bot.reply(message, text);
    });
}
