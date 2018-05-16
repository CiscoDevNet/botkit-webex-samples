//
// loop: Example of a conversation with a menu that loops until explicitly stopped
//
module.exports = function (controller) {

    controller.hears(['loop'], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            var question = "Here are a few proposed DevNet activities:";
            question += "<br/> `1)` join a Community Of Interest (**communities**)";
            question += "<br/> `2)` take a Learning Lab (**labs**)";
            question += "<br/> `3)` check Upcoming Events (**events**)";
            question += "\n\nWhat do you want to check?<br/>_(type a number, a **bold keyword** or `stop`)_";
            convo.ask(question, [
                {
                    pattern: "1|community|communities",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_1');
                    },
                }
                , {
                    pattern: "2|lab|track|learn",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_2');
                    },
                }
                , {
                    pattern: "3|event|express",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_3');
                    },
                }
                , {
                    pattern: "cancel|stop",
                    callback: function (response, convo) {
                        convo.gotoThread('action_cancel');
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread('bad_response');
                    }
                }
            ]);

            // Menu option 1)
            convo.addMessage({
                text: "Excellent choice: now [discover the DevNet communities](https://developer.cisco.com/site/coi/) online, and pick your favorite...",
                action: 'default'
            }, 'menu_1');

            // Menu option 2)
            convo.addMessage({
                text: "Learnings **labs** are step-by-step tutorials. They are grouped into **tracks** to help you on your rampup journey. Just browse through [the learnings tracks](https://learninglabs.cisco.com/login) and pick the labs that suits your learning appetite!",
                action: 'default'
            }, 'menu_2');

            // Menu option 3)
            convo.addMessage({
                text: "Nothing's like meeting in person at a conference, training or a hackathon. Check the list of [DevNet events](https://developer.cisco.com/site/devnet/events-contests/events/) or ask the bot: invite `CiscoDevNet@sparkbot.io` to chat in a Webex Teams space.",
                action: 'default'
            }, 'menu_3');

            // Cancel
            convo.addMessage({
                text: "Got it, cancelling...",
                action: 'stop', // this marks the converation as unsuccessful
            }, 'action_cancel');

            // Bad response
            convo.addMessage({
                text: "Sorry, I did not understand.",
                action: 'default',
            }, 'bad_response');

        });
    });
};
