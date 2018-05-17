//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function (bot, message) {
        var text = "My skills are mainly about showing conversations examples (ordered by complexity) :";
        text += "\n- " + bot.enrichCommand(message, "color") + ": simplest conversation";
        text += "\n- " + bot.enrichCommand(message, "coffee") + ": conversation with yes/no menu option";
        text += "\n- " + bot.enrichCommand(message, "timeout") + ": experience how Botkit timeouts behave";
        text += "\n- " + bot.enrichCommand(message, "activities") + ": conversation with a rich menu";
        text += "\n- " + bot.enrichCommand(message, "loop") + ": conversation with a menu that loops until explicitly stopped";
        text += "\n- " + bot.enrichCommand(message, "cheese") + ":  simple use of Botkit Threads conversation system";
        text += "\n- " + bot.enrichCommand(message, "drink") + ": illustrates Botkit threaded conversations";
        text += "\n- " + bot.enrichCommand(message, "variables") + ": threaded conversation where responses are vehiculed via variables";
        text += "\n- " + bot.enrichCommand(message, "responses") + ": threaded conversation where responses are vehiculed via context";
        text += "\n- " + bot.enrichCommand(message, "quiz") + ": threaded conversation with timeout";
        text += "\n- " + bot.enrichCommand(message, "storage") + ": store user preferences";
        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about the bot";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreading the word about my skills";
        bot.reply(message, text);
    });
}
