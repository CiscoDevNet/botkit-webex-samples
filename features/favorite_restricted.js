//
// Forces the user to pick among a predefined list of options
//
const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'guess_chat', controller );

    convo.ask( 'Can you guess one of my favorite colors?', [
        {
            pattern: '^blue|green|pink|red|yellow$',
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'success' );
            }
        },
        {
            default: true,
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'failure' )
            }
        }
    ], 'guessedColor');

    convo.addMessage( {
        text: 'Wow!  You guessed right, {{ vars.guessedColor }} is one of my favorites',
        action: 'complete'
    }, 'success' );

    convo.addMessage( {
        text: 'Nope...',
        action: 'default'
    }, 'failure' );

    controller.addDialog( convo );

    controller.hears( 'guess', 'message,direct_message', async (bot, message) => {

        await bot.beginDialog( 'guess_chat' );
    });


    controller.commandHelp.push( { command: 'guess', text: 'Conversation example - guess from a restricted list of options' } );
};
