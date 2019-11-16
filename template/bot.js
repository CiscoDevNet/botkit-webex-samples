//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the template bot.

// Import Botkit's core features
const { Botkit } = require('botkit');

// Import a platform-specific adapter for webex.
const { WebexAdapter } = require('botbuilder-adapter-webex');

// Load process.env values from .env file
require('dotenv').config();

// Load random UUID generator
const uuidv4 = require('uuid/v4');

const adapter = new WebexAdapter({
    
    access_token: process.env.ACCESS_TOKEN,
    public_address: process.env.PUBLIC_ADDRESS,
    secret: uuidv4()
})    

const controller = new Botkit({

    webhook_uri: '/api/messages',
    adapter: adapter,
    storage: null
});

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');
});

controller.webserver.get('/', (req, res) => {

    res.send(`This app is running Botkit ${ controller.version }.`);
});

controller.webserver.get('/ping', (req, res) => {

    res.send( JSON.stringify( botCommons, null, 4 ) );
});

controller.botCommons = {

    healthCheck: process.env.PUBLIC_ADDRESS + "/ping",
    upSince: new Date(Date.now()).toGMTString(),
    version: "v" + require("./package.json").version,
    owner: process.env.OWNER,
    support: process.env.SUPPORT,
    platform: process.env.PLATFORM,
    code: process.env.CODE
}

controller.checkAddMention = function( roomType, command ) {

    var botName = adapter.identity.displayName;

    if ( roomType == 'group' ) {
        
        return `\`@${ botName } ${ command }\``
    }

    return `\`${ command } \``
}

console.log( 'Health check available at: ' + controller.botCommons.healthCheck );