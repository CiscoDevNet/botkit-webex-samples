//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {

        var welcome = `Hi <@personId:${message.original_message.actorId}>, so glad meeting you!`;

        if (this.identity) {
            welcome += `<br/>I am the **${this.identity.displayName}** bot`;
        }

        bot.reply(message, welcome, function (err, messageAck) {

            var help = "Type `help` to learn about my skills.";

            if (messageAck.roomType == "group") {
                help = "Note that this is a 'Group' Space. I will answer only if mentionned.<br/>";
                help += "To learn about my skills, type " + bot.enrichCommand(messageAck, "help");
            }

            bot.say({
                text: `_${help}_`,
                channel: message.channel
            }, function (err, messageAck) {
                if (err) {
                    console.log("Error while pushing help message, err: " + err.message)
                    return;
                }
            });
        });
    });
}
