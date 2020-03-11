//
// Illustrates a muti-threaded conversation
//
// Q: "How about some coffee (yes / no / cancel)"
// A: no
// Q: "What would you like to drink instead..?"
// A: Coke
//
const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'coffee_chat', controller );

    convo.ask( 'How about some coffee? (yes / no / cancel)', [
        {
            pattern: 'yes|ya|yeah|sure|oui|si',
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'confirm' );
            }
        },
        {
            pattern: 'no|neh|non|nein|na|birk',
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'ask_drink' );
            }
        },
        {
            pattern: 'cancel|stop|exit',
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'cancel' );
            }
        },
        {
            default: true,
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'bad_response' );
            }
        }
    ])

    convo.addMessage( {
        text: 'Ah...I seem to be fresh out!',
        action: 'complete'
    }, 'confirm' );

    convo.addMessage( {
        text: 'Got it...cancelling',
        action: 'complete'
    }, 'cancel' );

    convo.addMessage( {
        text: 'Sorry, I did not understand!\nTip: try "yes", "no", or "cancel"',
        action: 'default'
    }, 'bad_response' );

    // Thread: ask for a drink
    convo.addQuestion( 'What would you like to drink instead..?', [], 'statedDrink', 'ask_drink' );
    convo.addMessage( 'Excellent!  I like {{ vars.statedDrink }} too', 'ask_drink' );

    controller.addDialog( convo );

    controller.hears( 'coffee', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'coffee_chat' );
    });

    controller.commandHelp.push( { command: 'coffee', text: 'Simple dialog example with threads' } );

}
