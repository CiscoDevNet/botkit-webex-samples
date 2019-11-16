
//
// Command: help
//
module.exports = function (controller) {

    controller.hears( [ 'help', 'who' ], 'message,direct_message', async( bot, message ) => {

        let markDown = 'Here are my skills:  \n';
        markDown += `- ${ controller.checkAddMention( message.roomType, '.commons' ) } : shows metadata about myself  \n`;
        markDown += `- ${ controller.checkAddMention( message.roomType, 'help' )} : spreads the word about my skills`;
        await bot.reply( message, { markdown: markDown } );
    });
}