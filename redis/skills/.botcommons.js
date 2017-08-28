//
// Command: bot commons
//
module.exports = function (controller) {

    controller.hears([/^ping/, /^\.about/, /^\.commons/, /^\.bot/], 'direct_message,direct_mention', function (bot, message) {
        // The BotCommons metadata need to be built after the bot identity info has been fetched from Cisco Spark.
        // As we don't have a Bot Initialization Complete event, we'll initialize this value when the bot commons data are fetched
        bot.commons.identity = bot.botkit.identity;

        bot.reply(message, '```json\n' + JSON.stringify(bot.commons, null, 4) + '\n```');
    });
}
