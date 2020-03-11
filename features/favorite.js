//
// Simplest use of Botkit's conversation system
//
const { BotkitConversation } = require( 'botkit' );

module.exports = function( controller ) {

    const convo = new BotkitConversation( 'fav_color_chat', controller );

    convo.say( 'This is a Botkit conversation sample.' );
    convo.ask(
        'What is your favorite color?',
        async ( answer, convo, bot ) => {},
        'stated_color' 
    );
    convo.say( `Cool, I like {{ vars.stated_color }} too!` );

    controller.addDialog( convo );

    controller.hears( 'favorite', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'fav_color_chat' );
    });

    controller.commandHelp.push( { command: 'favorite', text: 'Pick a favorite color (Botkit conversations)' } );

}
