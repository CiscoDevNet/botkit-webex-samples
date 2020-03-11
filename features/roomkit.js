const jsxapi = require( 'jsxapi' );

const { BotkitConversation } = require( 'botkit' );

module.exports = function ( controller ) {

    // Object to store the jsxapi API cbject/connection and device details
    // Provides a connect() function to manage connecting to the target device
    var roomkit = {
        state: 'disconnected',
        connect: function ( address, user, password ) {

            return new Promise( ( resolve, reject ) => {

                // Empty passwords are supported
                if ( !( address && user ) ) reject( 'Roomkit: Unable to connect: Missing address or user' );

                // Use jsxapi to connect to the device; store the xApi object on roomkit
                this.xapi = jsxapi.connect( `ssh://${ address }`, { username: user, password: password } )
                .on( 'error', err => {
    
                    this.state = 'disconnected';
                    reject( `Error attempting connection to ${ address }: ${ err }` );

                } )
                .on( 'ready', () => {
    
                    this.state = 'connected';
                    this.address = address;
                    this.user = user;
                    resolve( );
                } )
            } )
        }
    }

    controller.hears( 'roomkit', 'message,direct_message', async ( bot, message ) => {

        // Retrieve the Webex email of the requesting user
        let requestor = await bot.api.people.get( message.user ).then( person => { return person.emails[ 0 ] } );

        // If a restricted User is configured, check to see if it matches the requesting User
        if ( process.env.ROOM_DEVICE_AUTHORIZED_USER &&
            ( requestor != process.env.ROOM_DEVICE_AUTHORIZED_USER ) ) {

            await bot.reply( message, { markdown: `(Roomkit) \`${ requestor }\` is not authorized for this feature` } );
            return;
        }

        // If a restrcited Space is configured, check to see if the request is coming from that Space
        if ( process.env.ROOM_DEVICE_AUTHORIZED_SPACE &&
            ( message.roomId != process.env.ROOM_DEVICE_AUTHORIZED_SPACE ) ) {

            await bot.reply( message, { markdown: `(Roomkit) Users in this Space are not authorized for this feature` } );
            return;
            }

        // If xApi is not already connected, and if a device address is configured...
        if ( roomkit.state != 'connected' ) {

            if ( process.env.ROOM_DEVICE_ADDRESS ) {

                await bot.reply( message, `(Roomkit) Connecting to device: ${ process.env.ROOM_DEVICE_ADDRESS }...` );

                // Attempt to connect to the device
                await roomkit.connect( 
                    process.env.ROOM_DEVICE_ADDRESS,
                    process.env.ROOM_DEVICE_USER,
                    process.env.ROOM_DEVICE_PASSWORD
                ).then( )
                // Handle any errors connecting
                .catch( async ( err ) => {
                    // This appears to be necessary to ensure the Botkit worker is in the
                    // correct conversation context
                    await bot.changeContext( message.reference );

                    await bot.reply( message, `(Roomkit) ${ err }` );
                })
            }
        }

        // This appears to be necessary to ensure the Botkit worker is in the
        // correct conversation context
        await bot.changeContext( message.reference );

        // If the connection was successful, or perhaps already existed from a previous interaction...
        if ( roomkit.state == 'connected' ) {

            await bot.reply( message, `(Roomkit) Device connection ready: ${ roomkit.user }@${ roomkit.address }`);

            let question = '**Commands available:**  \n';
            question += '* **peoplecount**: query the device\'s face-counting feature  \n';
            question += '* **xstatus {path}**: execute a T-Shell xStatus command for the given path  \n';

            await bot.reply( message, { channelData: { markdown: question } } );
        }
        else {
            
            await bot.reply( message, '(Roomkit) not connected to a device.  Exiting...' );
            return;
        }

        // The xApi device connect is in good shape, start the conversation
        await bot.beginDialog( 'roomkit_chat' );
    } );

    const convo = new BotkitConversation( 'roomkit_chat', controller );

    convo.ask( { channelData: { markdown: '(Roomkit) Enter a command, or `exit`' } }, [
        {
            pattern: '^peoplecount',
            handler: async ( response, convo, bot ) => {
                await convo.gotoThread( 'peoplecount_thread' );
            }
        },
        {
            pattern: '^xstatus',
            handler: async ( response, convo, bot ) => {

                // Execute xAPI xStatus request using the provided path
                await roomkit.xapi.status.get( response.split( 'status ' )[ 1 ] )
                .then( async ( resp ) => {

                    // If it succeeded, reply with the pretty printed JSON in a markdown code block
                    await bot.say( { channelData: { markdown: '```json\n' + JSON.stringify( resp, undefined, 4 ) + '\n```' } } );
                } )
                .catch( async ( err ) => {

                    let msg = `(Roomkit) Error executing xStatus request: ${ err.message }  \n`;
                    msg += 'Try: `xstatus SystemUnit Uptime`';

                    await bot.say( { channelData: { markdown: msg } } );
                })

                await convo.repeat();
            }
        },
        {
            pattern: '^exit',
            handler: async ( response,convo, bot ) => {
                await convo.gotoThread( 'exit_thread' );
            }
        },
        {
            default: true,
            handler: async ( response, convo, bot ) => {
                await bot.say( '(Roomkit) Unrecognized response...  \nTry again!' );
                await convo.repeat();
            }
        }  
    ]);

    convo.before( 'peoplecount_thread', async ( convo, bot ) => {

        // Fetch current people count
        await roomkit.xapi.status.get( 'RoomAnalytics PeopleCount Current' )
        .then( async count => {

            switch( count ) {

                // -1 indictes the device is in standby/halfwake mode
                case '-1':
                    await convo.setVar( 'analysis', 'Sorry, the device is not counting right now: wake it up!' );
                    break;

                case '0':
                    await convo.setVar( 'analysis', 'No faces detected!' );
                    break;            

                default:
                    await convo.setVar( 'analysis', `**Currently, I can see ${ count } face(s)**` );
            }
        } )
        .catch( async err => {

            console.log( `Roomkit: Error while counting: ${ err.message }` );
            await convo.setVar( 'analysis', `(Roomkit) Error while querying the device: ${ err.message }` );
            return;
        })
    });

    // Menu option peoplecount
    convo.addMessage( 
        { text: '(Roomkit) {{vars.analysis}}', action: 'default' },
        'peoplecount_thread' );

    // Menu option exit
    convo.addMessage(
        { text: '(Roomkit) Exiting...', action: 'complete' },
        'exit_thread' );

    controller.addDialog( convo );

    controller.commandHelp.push( { command: 'Roomkit', text: 'Query a room device using the jsxapi API over SSH' } );

}




