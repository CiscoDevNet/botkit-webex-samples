//
// Command: show current settings
//

const isAuthorized = require("./utils/restricted.js");

module.exports = function (controller) {

    controller.hears(["device", "info", "settings", "parameterss"], 'direct_message,direct_mention', function (bot, message) {

        // Check access
        if (!isAuthorized(bot, message)) {
            return;
        }

        var text = "Here are your device info:";
        text += `\n- url      : ${bot.roomkit.device.url}`;
        text += `\n- username : ${bot.roomkit.device.username}`;

        bot.reply(message, text);
    });
}
