//
// Command: PeopleCount
//

const debug = require("debug")("peoplecount");
const isAuthorized = require("./utils/restricted.js");

module.exports = function (controller) {

    controller.hears(["count", "peoplecount", "participants", "faces", "combien"], 'direct_message,direct_mention', function (bot, message) {

        // We do not check access for this command
        //if (isAuthorized(bot, message)) {
        //    bot.reply(message, "sorry, you're not authorized to access the configuration settings of the device");
        //    return;
        //}

        // If we did not manage to connect to the device, say it
        if (bot.roomkit.connection.state !== "success") {
            bot.reply(message, "Sorry, I cannot connect to the device.\n\nPlease check the settings (ip address, credentials).");
            return;
        }

        // Fetch current people count
        bot.roomkit.xapi.status
            .get('RoomAnalytics PeopleCount')
            .then((count) => {
                // Is the device counting
                if (count.Current == -1) {
                    bot.reply(message, "Sorry, your RoomKit is not counting right now: wake it up!");
                    return;
                }
                
                if (count.Current == 0) {
                    bot.reply(message, "No face detected.");
                    return;
                }

                bot.reply(message, `**Currently, I can see ${count.Current} face(s)**`);
                return;
            })
            .catch((err) => {
                debug(`roomkit: PeopleCount error while counting: ${err.message}`);
                bot.reply(message, `_Oups, I am blind right now. Try again later..._\nerror while contacting the device: ${err.message}`);
                return;
            });
    });
}
