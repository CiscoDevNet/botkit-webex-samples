//
// Threaded conversation illustrating a survey.
// Responses are posted into a Webex Teams 'Survey' space via an Incoming Webhook
// TIP: specify an environment variable SURVEY_RESULTS_SPACE
//      with the id of an Incoming Webhook created 
//      from https://apphub.webex.com/integrations/Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0NlZGJiN2JhZjk3MTcxNjA2Y2ZiNDVjMTY0YWVmOWRjN2ZhYTQ3NjgwZjc3NGYxZWEwZjVkOGFhZTcxZjFlOWNi
// 
//
module.exports = function (controller) {

    controller.hears([/^survey/], "direct_message,direct_mention", function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("**Which DevNet session do you want to rate?**", [
                {
                    pattern: "^DEVNET-1808|DEVNET-1871|DEVNET-2071|DEVNET-2074|DEVNET-2896|DEVNET-3071|DEVNET-3610|DEVNET-3891$",
                    callback: function (response, convo) {
                        convo.gotoThread("rate_session");
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread('bad_response');
                    }
                }
            ], { key: "session" });

            // Bad response
            convo.addMessage({
                text: "Sorry, I don't know this session.<br/>_Tip: try DEVNET-1808, DEVNET-1871, DEVNET-2071, DEVNET-2074, DEVNET-2896, **[DEVNET-3071](https://www.ciscolive.com/us/learn/sessions/session-catalog/?search=DEVNET-3071)**, DEVNET-3610, DEVNET-3891_",
                action: 'default',
            }, 'bad_response');

            // Rating Thread
            convo.addQuestion("How would you rate session '{{responses.session}}' ?<br/>1(below), 2(low), 3(medium), 4(good), 5(great)", [
                {
                    pattern: "^1|2|3|4|5$",
                    callback: function (response, convo) {
                        let session = convo.extractResponse('session');
                        push(`Session ${session} was rated ${response.text}`, function (err) {
                          if (err) {
                            convo.gotoThread("post_survey_failed");
                            return;
                          }
                          
                          convo.setVar("session", session);
                          convo.gotoThread("success");
                        });
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.repeat();
                        convo.next();
                    }
                }
            ], {}, "rate_session");

            // Success thread
            convo.addMessage(
                "Thanks for your feedback!",
                "success");
              
            // Post survey failed
            convo.addMessage(
                "Sorry, could not post your responses",
                "post_survey_failed");
        });
    });
};

// Post message to the 'Survey Responses space'
function push(msg, cb) {
  var request = require("request");

  // Incoming webhook id
  let webhook_id = process.env.SURVEY_RESULTS_SPACE || "Y2lzY29zcGFyazovL3VzL1dFQkhPT0svOGQ3MDU5YTgtNTJjZi00MzdjLWI5OTUtOWE4N2Y3ZGFiMDk5";
  let options = { method: 'POST',
    url: 'https://api.ciscospark.com/v1/webhooks/incoming/' + webhook_id,
    headers: { 'Content-Type': 'application/json' },
    body: { markdown: msg },
    json: true };

  request(options, function (err, response, body) {
    if (err) cb(err.message);

    if (response.statusCode == 204) {
      cb(null);
      return; 
    }
    
    cb("Could not post message to Webex Teams")
  });
}