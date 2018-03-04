//
// Command: PeopleCount
//

const debug = require("debug")("peoplecount");
const isAuthorized = require("./utils/restricted.js");

module.exports = function (controller) {

    controller.hears(["peoplecount", "combien", "count", "participants"], 'direct_message,direct_mention', function (bot, message) {

        // Check access
        if (isAuthorized(bot, message)) {
            return;
        }

        // If we did not manage to connect to the device, say it
        if (bot.roomkit.state !== "success") {
            bot.reply(message, `Sorry, I cannot connect to your device.\n\nPlease check the device settings (ip address, credentials).`);
            return;
        }

        // Fetch current people count
        bot.roomkit.xapi.status
            .get('RoomAnalytics PeopleCount')
            .then((count) => {
                // Is the device counting
                if (count.Current == -1) {
                    bot.reply(message, `Sorry, your RoomKit am not counting right now: wait it up!`);
                    return;
                }
                
                bot.reply(message, `**Well, I can see ${count.Current} faces**`);
            })
            .catch((err) => {
                console.error(`PeopleCount: error while counting: ${err.message}`);
                bot.reply(message, `_Oups, I cannot see, try again later..._\n   error while contacting the device: ${err.message}`);
            });
    });
}
