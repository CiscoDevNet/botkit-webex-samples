// Threaded conversation illustrating a survey.
// Responses are posted into the Webex Teams Space
// configured via SURVEY_SPACE (the bot must be a member)
// or simply back into the Space the survey was submitted from
// if SURVEY_RESULTS_SPACE is empty

const { BotkitConversation } = require( 'botkit' );

module.exports = function ( controller ) {

    const convo = new BotkitConversation( 'survey_chat', controller );

    convo.before( 'default', async ( convo, bot ) => {

        if ( !convo.vars.survey_space ) {

            convo.setVar( 'survey_space', 
                process.env.SURVEY_RESULTS_SPACE ? process.env.SURVEY_RESULTS_SPACE : convo.vars.channel );
            
            if ( !process.env.SURVEY_RESULTS_SPACE ) {
                await convo.gotoThread( 'survey_warn_space' );
            }
        }
    } );

    let question = '(Survey) Please enter the session for which you\'d like to provide feedback  \n';
    question += '_Available sessions: DEVNET-1808 / DEVNET-1871 / DEVNET-2071 / DEVNET-2074 / DEVNET-2896_';
    
    convo.ask( { channelData: { markdown: question } }, [
        {
            pattern: '^DEVNET-1808|DEVNET-1871|DEVNET-2071|DEVNET-2074|DEVNET-2896&',
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'survey_confirm' );
            }
        },
        {
            default: true,
            handler: ( async ( response, convo ) => {
                await convo.gotoThread( 'survey_cancel' );
            })
        }
    ], 'survey_session_id' );

    convo.addMessage( {
        text: '(Survey) No survey results Space configured; using current Space',
        action: 'default'
    }, 'survey_warn_space');

    convo.addMessage( {
        text: '(Survey) Unrecognized session Id...',
        action: 'default'
    }, 'survey_cancel' );

    let rate = `How would you rate this session?  \n`;
    rate += '_Options: 1|poor, 2|weak, 3|adequate, 4|good, 5|great_  \n';
    rate += '_(or provide your own free-form response!)_';

    convo.addQuestion( 
        { channelData: { markdown: rate } }, 
        async ( response, convo ) => {

            await convo.gotoThread( 'survey_submit' );
        },
        'survey_rating',
        'survey_confirm' );

    convo.before( 'survey_submit', async ( convo, bot) => {

        let result = '';

        await bot.api.messages.create( {
            roomId: convo.vars.survey_space,
            text: `(Survey) Session ${ convo.vars.survey_session_id } was rated: ${ convo.vars.survey_rating }`
        } )
        .then( async () => {
            convo.setVar('survey_result', 'Thanks for providing your feedback!')
        } )
        .catch( async ( err ) => {
            convo.setVar('survey_result', `Error submitting results: ${err.body.message}`)
        } )
    } );

    convo.addMessage( {
        text: '(Survey) {{vars.survey_result}}',
        action: 'complete'
    }, 'survey_submit' )

    controller.addDialog( convo );

    controller.hears( 'survey', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'survey_chat' );
    });

    controller.commandHelp.push( { command: 'survey', text: 'Ask a survey question, post results to a Webex Teams Space' } );

}