//
// Command: bot commons
//
module.exports = function (controller) {

    controller.hears(["^\.about", "^\.commons", "^\.bot", "^ping"], 'direct_message,direct_mention', function (bot, message) {
        var metadata = '{\n'
            + '   "owner"       : "' + bot.commons["owner"] + '",\n'
            + '   "support"     : "' + bot.commons["support"] + '",\n'
            + '   "up-since"    : "' + bot.commons["up-since"] + '",\n'
            + '   "healthcheck" : "' + bot.commons["healthcheck"] + '",\n'
            + '   "version"     : "' + bot.commons["version"] + '",\n'
            + '   "code"        : "' + bot.commons["code"] + '"\n'
            + '}\n';
        bot.reply(message, '```json\n' + metadata + '\n```');
    });
}
