//
// Example of a conversation with a menu that loops until explicitly stopped
//

const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'loop_chat', controller );

    let question = 'Here are a few proposed DevNet activities:\n';
    question += '  1. Join a Community Of Interest: (communities)\n';
    question += '  2. Take a Learning Lab: (labs)\n';
    question += '  3. Check Upcoming Events: (events)\n';
    question += 'What would you like to see?\n(type a number, a (keyword) or "stop")';

    convo.ask( question, [
        {
            pattern: '1|community|communities',
            handler: async (response, convo, bot) => {
                await convo.gotoThread( 'menu_1' );
            }
        },
        {
            pattern: '2|lab|track|learn',
            handler: async (response, convo, bot) => {
                await convo.gotoThread( 'menu_2' );
            }
        },
        {
            pattern: '3|event|express',
            handler: async (response, convo, bot) => {
                await convo.gotoThread( 'menu_3' );
            }
        },
        {
            pattern: 'cancel|stop',
            handler: async (response, convo, bot) => {
                await convo.gotoThread( 'action_cancel' );
            }
        },
        {
            default: true,
            handler: async (response, convo, bot) => {
                await bot.say( 'Unrecognized response...  \nTry again!' );
                await convo.repeat();
            },
        }  
    ]);

    // Menu option 1)
    convo.addMessage({
        text: 'Excellent choice: now discover the DevNet communities online, ' +
            'and pick your favorite: https://developer.cisco.com/site/coi/\n\n',
        action: 'default'
    }, 'menu_1');

    // Menu option 2)
    convo.addMessage({
        text: 'Learnings Labs are step-by-step tutorials. ' +
            'They are grouped into tracks to help you on your learning journey. ' +
            'Browse through the learnings tracks here: https://learninglabs.cisco.com/login\n\n',
        action: 'default'
    }, 'menu_2');

    // Menu option 3)
    convo.addMessage({
        text: 'Nothing like meeting in person at a conference, training or a hackathon. ' +
            'Check the list of DevNet events: https://developer.cisco.com/site/devnet/events-contests/events/\n\n',
        action: 'default'
    }, 'menu_3');

    // Cancel
    convo.addMessage({
        text: 'Got it, cancelling...',
        action: 'complete',
    }, 'action_cancel');


    controller.addDialog( convo );

    controller.hears( 'loop', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'loop_chat' );
    });

    controller.commandHelp.push( { command: 'loop', text: 'Example of a conversation that loops until explicitly stopped' } );

};

