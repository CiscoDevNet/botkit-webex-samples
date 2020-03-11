    const { BotkitConversation } = require( 'botkit' );

    module.exports = function( controller ) {

        const convo = new BotkitConversation( 'flag_colors', controller );

        convo.ask( 'Can you name one of the colors on the flag of the United States of America..?', [
            {
                pattern: '^red|white|blue$',
                handler: async (response, convo, bot) => {
                    await bot.say( `Correct! "${ response }" is one of the three colors on the US flag` );
                },
            },
            {
                default: true,
                handler: async (response, convo, bot) => {
                    await bot.say( 'Incorrect :/  \nTry again!' );
                    await convo.repeat();
                },
            }    
        ]);

        controller.addDialog( convo );

        controller.hears( 'quiz', 'message,direct_message', async ( bot, message ) => {

            await bot.beginDialog( 'flag_colors' );
        });

        controller.commandHelp.push( { command: 'quiz', text: 'Conversation/thread example implementing a flag quiz' } );
    }