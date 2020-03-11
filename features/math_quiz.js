//
// Quiz: example of a muti-threaded conversation with timeout
//
//TODO: implement timeout mechanism for Botkit 4.5

const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'math_chat', controller );

    convo.ask( 'Ready for a challenge? (yes/no/cancel)', [
        {
            pattern: 'yes|ya|yeah|sure|oui|si',
            handler: async ( response, convo ) => {

                convo.gotoThread( 'quiz' );
            }
        },
        {
            pattern: 'no|neh|non|na|birk|cancel|stop|exit',
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'cancel' );
            },
        },
        {
            default: true,
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'bad_answer' );
            }
        }
    ]);

    // Thread: bad response
    convo.addMessage({
        text: 'Sorry, I did not understand...',
        action: 'default', // goes back to the thread's current state, where the question is not answered
    }, 'bad_answer' );

    // Thread: cancel
    convo.addMessage({
        text: 'Got it, cancelling...',
        action: 'stop', // this marks the converation as unsuccessful
    }, 'cancel');

    // Thread: quiz

    convo.addMessage( 'Let\'s go...', 'quiz' );

    let challenge = pickChallenge();

    convo.addQuestion( {
        text: async ( template, vars ) => { 
            
            return `Question: ${ challenge.question }` }
        },
        [
            {
                pattern: 'cancel|stop|exit',
                handler: async ( response, convo ) => {

                    await convo.gotoThread( 'cancel' );
                }
            },
            {
                default: true,
                handler: async (response, convo) => {

                    if ( response == challenge.answer){
                        challenge = pickChallenge();
                        await convo.gotoThread( 'success' )
                    }
                    else {
                        await convo.gotoThread( 'wrong_answer' );
                    }
                }
            }
        ], {}, 'quiz');

    // Thread: quiz - success
    convo.addMessage( 'Congrats, you did it!', 'success');

    // Thread: quiz - missed
    // convo.addMessage( 'Time elapsed! you missed it, sorry.', 'missed' ); //TODO

    // Thread: quiz - wrong answer
    convo.addMessage({
        text: 'Sorry, wrong answer. Try again!',
        action: 'quiz', // goes back to the thread's current state, where the question is not answered
    }, 'wrong_answer');

    controller.addDialog( convo );

    function pickChallenge() {
        var a = Math.round(Math.random() * 5) + 4;
        var b = Math.round(Math.random() * 5) + 4;
        return {
            question:  `${ a } x ${ b } =`,
            answer: `${ a*b }`
        }
    }

    controller.hears( 'math', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'math_chat' );
    });

    controller.commandHelp.push( { command: 'math', text: 'Conversation/thread example implementing a math quiz' } );

}