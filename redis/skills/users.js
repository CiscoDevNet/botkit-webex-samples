//
// Stores a value in Botkit's Redis user space, so that the value can be retreived later
// - store any_string
// - fetch
//
module.exports = function (controller) {

    controller.hears([/store[\s]+(.*)/], 'direct_message,direct_mention', function (bot, message) {
        
        // Fetch value argument
        var value = message.match[1];
        if (!value) {
            bot.reply(message, 'please specify a value');
            return;
        }

        // Store value to Redis under user's Webex Teams personId (so that it does not overlap with other users)
        var userId = message.actorId;
        var data = { id: userId, value: value };
        controller.storage.users.save(data, function (err) {
            if (err) {
                bot.reply(message, 'sorry, could not access Redis, err: ' + err.message);
                return;
            }

            bot.reply(message, `Stored into Redis key space: "botkit:store:users", of user: "${message.user}".`);
        });
    });


    controller.hears([/fetch/], 'direct_message,direct_mention', function (bot, message) {
        
        // Retreive stored value for the user id
        var userId = message.actorId;
        controller.storage.users.get(userId, function (err, data) {
            if (err) {
                bot.reply(message, 'sorry, could not access Redis, err: ' + err.message);
                return;
            }

            // No data found for the current user
            if (data == null) {
                bot.reply(message, 'Did not find any data. Type `store custom_string` to save a value');                
                return;
            }

            // Send the data back
            bot.reply(message, `Found value: "${data.value}".`);
        });
    });
}
