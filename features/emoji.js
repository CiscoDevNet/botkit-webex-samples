const { BotkitConversation } = require( 'botkit' );

const emoji = require('node-emoji');

module.exports = async function (controller) {

    const convo = new BotkitConversation( 'emoji_chat', controller );

    let question =  'Hi, I am the Emoji bot!\n'; 
    question += '* Type any sentence with an emoji tag in it (like: "`I :heart: U`") to see me in action.\n';
    question += '* You can also use "`find {keyword}`" and "`random`" commands';

    convo.ask( { channelData: { markdown: question } }, [
        {
            pattern: 'random',
            handler: async ( response, convo, bot ) => {
                let random = emoji.random();
                let answer = 'Here\'s a random emoji tag and representation:';
                answer += `Type: "\`:${random.key}:\`", to get: ${random.emoji}`;
                await bot.say( { markdown: answer } );
            }
        },
        {
            pattern: '(?:find|search)\s*(.*)',
            handler: async ( response, convo, bot ) => {
                var keyword = response.split( ' ', 2 )[ 1 ];
                if ( !keyword ) {
                    await bot.say( { markdown: 'Find what, exactly..? Try: "`find smiley`"' } );
                    return;
                }

                var found = emoji.search( keyword );

                switch ( found.length ) {

                    case 0:
                        await bot.say( `Sorry, no match.  Try again...${ emoji.get('persevere') }` );
                        return;

                    case 1:
                        await bot.say( { 
                            markdown: `Type "\`:${ found[0].key }:\`" for ${ found[0].emoji }`
                        } )
                        return;

                    default:
                        var max = ( found.length < 3 ) ? found.length : 3;
                        var response = `Found ${ found.length }, showing ${ max }  \n`;
                        for ( i = 0; i < max; i++ ) {
                            response += `* Type "\`:${ found[ i ].key }:\`" for ${ found[ i ].emoji  }  \n`;
                        }
                        await bot.say( { markdown: response } );
                        return;
                }
            }
        },
        {
            default: true,
            handler: async ( response, convo, bot ) => {
                await bot.say( `Translation: ${ emoji.emojify( response ) }` );
            }
        },
    ]);

    controller.addDialog( convo );

    controller.hears( 'emoji', 'message,direct_message', async ( bot, message ) => {
        await bot.beginDialog( 'emoji_chat' );
    });

    controller.commandHelp.push( { 
            command: 'emoji', 
            text: 'Converts emoji tags into unicode characters and returns the "emojified" phrase'
    } );

}
