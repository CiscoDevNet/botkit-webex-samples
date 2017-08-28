//
// Stores a value in BotKit's Redis user space, so that the value can be retreived later
// - save "any string"
// - read
//
module.exports = function (controller) {

    controller.hears([/save\s+\"(.*)\"/], 'direct_message,direct_mention', function (bot, message) {
        
        // Fetch value argument
        var value = message.match[1];
        if (!value) {
            bot.reply(message, 'please specify a value');
            return;
        }

        // Store value to Redis under user's Cisco Spark personId (so that it does not overlap with other users)
        var userId = message.original_message.personId;
        var data = { id: userId, value: value };
        controller.storage.users.save(data, function (err) {
            if (err) {
                bot.reply(message, 'sorry, could not access Redis, err: ' + err.message);
                return;
            }

            bot.reply(message, `Stored into Redis key space: "botkit:store:users", under personId of user: "${message.user}".`);
        });
    });


    controller.hears([/read/], 'direct_message,direct_mention', function (bot, message) {
        
        // Retreive stored value for the user id
        var userId = message.original_message.personId;
        controller.storage.users.get(userId, function (err, data) {
            if (err) {
                bot.reply(message, 'sorry, could not access Redis, err: ' + err.message);
                return;
            }

            // No data found for the current user
            if (data == null) {
                bot.reply(message, 'Did not find any data. Type `save "custom string"` to store a value');                
                return;
            }

            // Send the data back
            bot.reply(message, `Found value: "${data.value}".`);
        });
    });
}
