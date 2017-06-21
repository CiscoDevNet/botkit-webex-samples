//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {
        bot.reply(message, "Hi, I am the **"+ process.env.BOT_NICKNAME + "** bot. Type `help` to learn more about my skills."
            , function (err, newMessage) {
                if (newMessage.roomType == "group") {
                    bot.reply(message, "_Note that this is a 'Group' Space. \
                       I will answer only if mentionned:<br/> \
                       for help, type "+ bot.enrichCommand(newMessage, "help") + "_");
                }
            });
    });
}
