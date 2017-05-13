# BotKit samples for Cisco Spark

You can run any sample in a snatch:

```shell
> git clone https://github.com/CiscoDevNet/botkit-ciscospark-samples
> cd botkit-ciscospark-samples
> npm install
> SPARK_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" node helloworld.js
```

where:

- SPARK_TOKEN is the API access token of your Cisco Spark bot
- PUBLIC_URL is the root URL at which Cisco Spark can reach your bot
- SECRET is the secret that Cisco Spark uses to sign the JSON webhooks events posted to your bot
- [ngrok](http://ngrok.com) is the tunnel engine that will expose your bot on the internet, type: `ngrok http 8080` to launch

**New to BotKit?**
Read the [BotKit for CiscoSpark Guide](https://github.com/howdyai/botkit/blob/master/readme-ciscospark.md)

**New to CiscoSpark?**
Read the [Starter Guide](https://github.com/ObjectIsAdvantag/hackathon-resources#cisco-spark-starter-guide-chat-calls-meetings) we use at hackathon. Or go straight to [Spark4Devs](https://developer.ciscospark.com), signin and click [My apps](https://developer.ciscospark.com/apps.html) to create a bot account.


## Hello World bot

Simplest bot [you can code](blob/master/helloworld.js#L62): simply echoes a message with a mention of the Cisco Spark user that mentionned him.

![hello-bot-direct](docs/img/hello-bot-direct.png)

And don't forget to mention him in group rooms.

![hello-bot-group](docs/img/hello-bot-group.png)

Note that the bot will respond to anyone mentioning him,
then no reason why he could not chat with other bots.
Below, the Hello bot (impersonnated via the Playground bot token) helling the CiscoDevNet bot.

![hello-bot-playing](docs/img/hello-bot-playing.png)



## Emoji events bot

This [bot turns emoji tags](blob/master/emoji.js#58) to unicode characters and posts back the 'emojified' phrase

The bot leverages the [experimental websocket library for CiscoSpark](https://github.com/marchfederico/ciscospark-websocket-events).

![emoji](docs/img/emoji-websocket.png)




## CiscoDevNet events bot

The bot illustrates how you can create Cisco Spark conversations with BotKit.

It calls an external API hosted on Heroku that lists current and upcoming events at DevNet.

[Check the source code](/blob/master/devnet.js#L117) of the bot.

![devnet-botkit](docs/img/devnet-botkit-convo.png)
