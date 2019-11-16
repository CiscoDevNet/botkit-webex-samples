//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on( 'memberships.created', async( bot, message ) => {

        let markDown = `Hi, I am the **${ controller.adapter.identity.displayName }** bot!  \n`
        markDown += 'Type `help` to learn more about my skills.  ';

        if ( message.data.roomType == 'group' ) {

            markDown += `\n_Note that this is a "group" space.\n  I will answer only if mentioned!  \n`
            markDown += `For help, enter: ${ controller.checkAddMention( message.data.roomType, 'help' ) }_`
        }

        await bot.reply( message, { markdown : markDown} );
    });
}