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
                        convo.say("Excellent choice: now [discover the DevNet communities](https://developer.cisco.com/site/coi/) online, and pick your favorite...");
                        convo.repeat();
                        convo.next();
                    },
                }
                , {
                    pattern: "2|lab|track|learn",
                    callback: function (response, convo) {
                        convo.say("Learnings **labs** are step-by-step tutorials. They are grouped into **tracks** to help you on your rampup journey. Just browse through [the learnings tracks](https://learninglabs.cisco.com/login) and pick the labs that suits your learning appetite!");
                        convo.repeat();
                        convo.next();
                    },
                }
                , {
                    pattern: "3|event|express",
                    callback: function (response, convo) {
                        convo.say("Nothing's like meeting in person at a conference, training or a hackathon. Check the list of [DevNet events](https://developer.cisco.com/site/devnet/events-contests/events/) or ask the bot: invite `CiscoDevNet@sparkbot.io` to chat in a Cisco Spark space.");
                        convo.repeat();
                        convo.next();
                    },
                }
                , {
                    pattern: "cancel|stop",
                    callback: function (response, convo) {
                        convo.say("Got it!");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("Sorry, I did not understand.");
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
        });
    });
};
