//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {
        var welcome = "Hi";
        if (process.env.BOT_NICKNAME) {
            welcome += ", I am the **"+ process.env.BOT_NICKNAME + "** bot";
        }
        welcome += "! Type `help` to learn more about my skills.";
        bot.reply(message, welcome
            , function (err, newMessage) {
                if (newMessage.roomType == "group") {
                    bot.reply(message, "_Note that this is a 'Group' Space. \
                       I will answer only if mentionned:<br/> \
                       for help, type "+ bot.enrichCommand(newMessage, "help") + "_");
                }
            });
    });
}
