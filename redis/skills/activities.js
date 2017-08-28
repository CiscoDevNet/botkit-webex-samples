//
// Stores objects into a dedicated key space, and fetches the list to display it in a Spark room.
//
//
module.exports = function (controller) {

    controller.hears(["init"], 'direct_message,direct_mention', function (bot, message) {
        var learninglab = { id: "Communities", description: "Excellent choice: now [check the DevNet communities](https://developer.cisco.com/site/coi/) online, and pick your favorite...", href:"https://developer.cisco.com/site/coi/" };
        controller.storage.activities.save(learninglab, function (err) {
            if (err) {
                bot.reply(message, "cannot store activity 'learning lab' description");
                return;
            }
        });

        var learninglab = { id: "Learning labs", description: "Learnings **labs** are step-by-step tutorials. They are grouped into **tracks** to help you on your rampup journey. Just browse through [the learnings tracks](https://learninglabs.cisco.com/login) and pick the labs that suits your learning appetite!", href:"https://learninglabs.cisco.com/tracks" };
        controller.storage.activities.save(learninglab, function (err) {
            if (err) {
                bot.reply(message, "cannot store activity 'learning lab' description");
                return;
            }
        });

        var event = { id: "Events", description: "Nothing's like meeting in person at a conference, training or a hackathon. Check the list of [DevNet events](https://developer.cisco.com/site/devnet/events-contests/events/) or ask the bot: invite `CiscoDevNet@sparkbot.io` to chat in a Cisco Spark space.", href:"https://developer.cisco.com/site/devnet/events-contests/events/" };
        controller.storage.activities.save(event, function (err) {
            if (err) {
                bot.reply(message, "cannot store activity 'learning lab' description");
                return;
            }
        });

        bot.reply(message, "Redis key space 'botkit:store:activities' was successfully created");
    });


    controller.hears(["activities"], 'direct_message,direct_mention', function (bot, message) {
        // Fetch activities scores
        controller.storage.activities.all(function (err, list) {
            if (err) {
                bot.reply(message, `I am not feeling well, try again later ...\n**Redis not responding, err: ${err.message}**`);
                return;
            }

            if (list.length == 0) {
                bot.reply(message, "found no activity. Type `init` to fill some into Redis.");
                return;
            }

            var text = "Here are some DevNet activities :";
            list.forEach(function (activity) {
                text += `\n- [${activity.id}](${activity.href}): ${activity.description}`;
            });
            bot.reply(message, text);
        });
    });
}
