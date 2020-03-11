
//
// Fallback Command
//
module.exports = function (controller) {

    controller.on( 'message,direct_message', async ( bot, message ) => {

        let markDown = `Sorry, I did not understand.  \nTry: ${ controller.checkAddMention( message.roomType, 'help' ) }`;
            
        await bot.reply( message, { markdown: markDown } );
    });
}