//
// Command: PeopleCount
//

var debug=require("debug")("peoplecount");


// Check args
if (!process.env.JSXAPI_DEVICE_URL || !process.env.JSXAPI_USERNAME) {
    console.error("Please specify info to connect to your device as JSXAPI_DEVICE_URL, JSXAPI_USERNAME, JSXAPI_PASSWORD env variables");
    console.error("Bash example: JSXAPI_DEVICE_URL='ssh://10.10.1.52' JSXAPI_USERNAME='integrator' JSXAPI_PASSWORD='integrator' node example.js");
    process.exit(1);
}

// Empty passwords are supported
const password = process.env.JSXAPI_PASSWORD ? process.env.JSXAPI_PASSWORD : "";

// Connect to the device
debug("loading the jsxapi library");
const jsxapi = require('jsxapi');
debug("successfully loaded jsxapi");

console.log(`Connecting to RoomKit device listening at: ${process.env.JSXAPI_DEVICE_URL}`);
var connectFailureReason = "connecting to device...";
const xapi = jsxapi.connect(process.env.JSXAPI_DEVICE_URL, {
    username: process.env.JSXAPI_USERNAME,
    password: password
});
xapi.on('error', (err) => {
    console.error(`Connecting to device failed: ${err}`);
    connectFailureReason = `could not connect to device, err: ${err.message}`;
});

xapi.on('ready', () => {
    debug("successfully connected to the device");
    connectFailureReason = "";
});

module.exports = function (controller) {

    controller.hears(["peoplecount", "combien", "count", "participants"], 'direct_message,direct_mention', function (bot, message) {

        // Security checks: 
        //   1. if the person asking has the GRANTED_EMAIL, grant access from all spaces
        //   2. if a RESTRICITED_SPACE id is specified, check we are speaking from there (unless granted)
        var authorized = false;
        if (process.env.GRANTED_EMAIL) {
            if (message.original_message.personEmail == process.env.GRANTED_EMAIL) {
                debug(`granting access, user asking is the authorized person: ${process.env.GRANTED_EMAIL}`);
                authorized = true;
            }
        }

        // Check if we are in the reserved space
        if(!authorized && process.env.RESTRICITED_SPACE) {
            if (message.channel !== process.env.RESTRICITED_SPACE) {
                debug(`access not granted, user asking not in the space with id: : ${process.env.RESTRICITED_SPACE}`);
                bot.reply(message, `Sorry buddy, I don't talk to strangers.`);
                return;
            }
        }

        // If we did not manage to connect to the device, say it
        if (connectFailureReason !== "") {
            bot.reply(message, `Sorry, I cannot connect to your device.\n\nPlease check my settings (device ip address, credentials)`);
            return;
        }

        // Fetch current people count
        xapi.status
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
