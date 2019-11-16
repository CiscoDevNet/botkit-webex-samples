//
// Command: bot commons
//
module.exports = function (controller) {

    controller.hears( [ '^\.about', '^\.commons', '^\.bot', '^ping' ], 'message,direct_message', async(bot, message) => {

        let markDown = '```json\n';
        markDown += JSON.stringify( controller.botCommons, null, 4 );
        markDown += '\n```'
        await bot.reply( message, { markdown: markDown } );
    });
}