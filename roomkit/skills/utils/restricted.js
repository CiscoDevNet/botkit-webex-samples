// By default, the bot will respond only from a restricted space, or if the granted user is asking
// This utility function checks:
//   1. if the person asking is the GRANTED_EMAIL, grant access from all spaces
//   2. if a RESTRICITED_SPACE id is specified, check we are speaking from there (unless granted)
//
// Returns 
//   - true if the conversation can proceed
//   - false if we sent an access denied message
//
module.exports = function (bot, message) {
    // Is there a user that can invoke the bot in any space
    if (process.env.GRANTED_EMAIL) {
        if (message.original_message.personEmail == process.env.GRANTED_EMAIL) {
            debug(`granting access, user asking is the authorized person: ${process.env.GRANTED_EMAIL}`);
            return true;
        }
    }

    // Check if the bot must be invoked in a reserved space
    if (process.env.RESTRICITED_SPACE) {
        if (message.channel !== process.env.RESTRICITED_SPACE) {
            debug(`access not granted, user asking not in the space with id: : ${process.env.RESTRICITED_SPACE}`);
            bot.reply(message, `Sorry buddy, I don't talk to strangers.`);
            return false;
        }

        // Access granted
        return true;
    }

    return false;
}