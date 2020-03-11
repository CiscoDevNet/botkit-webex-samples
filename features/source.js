//
// Displays the code of the specified skill
//
const fs = require('fs');
const { BotkitConversation } = require( 'botkit' );

module.exports = function ( controller ) {

    const convo = new BotkitConversation( 'source_chat', controller );

    let sourceFiles = fs.readdirSync( 'features' ).filter( ( value, index, arr ) => {
        return value.endsWith( '.js' );
    } );

    let question = 'Select a "feature" JavaScript file by # to see the source code (or "cancel"):  \n';
    let respPattern = '^';

    sourceFiles.forEach( ( value, index, arr ) => {

        question += `${ index + 1 }. ${ value }  \n`;

        respPattern += `${ index + 1 }`;
        respPattern += ( index = ( arr.length - 1 ) ) ? '|' : '$';
    })

    convo.ask( question, [
        {
            pattern: respPattern,
            handler: async ( response, convo, bot ) => {

                await bot.say( { markdown:  getSource( response ) } );
                await convo.stop();
            }
        },
        {
            pattern: 'cancel',
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'cancel' );
            }
        },
        {
            default: true,
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'invalid' );
            }
        }
    ], 'selection' );

    convo.addMessage( { 
        text: 'Got it, cancelling...',
        action: 'complete'
    }, 'cancel' );

    convo.addMessage( { 
        text: 'Unrecognized response!',
        action: 'default'
    }, 'invalid' );

    controller.addDialog( convo );

    controller.hears( 'source', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'source_chat' );
    });

    function getSource( selection ) {

        let selectedFile = sourceFiles[ parseInt( selection ) - 1 ];
        let normalizedPath = require( 'path' ).join( __dirname, selectedFile );

        let markDown = '```javascript\n';
        markDown += fs.readFileSync( normalizedPath ).toString();
        markDown += '\n```';

        return markDown;
    }

    controller.commandHelp.push( { command: 'source', text: 'Show the source code of the available "feature" files' } );

}
