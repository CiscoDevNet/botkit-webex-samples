# BotKit samples for Cisco Spark

Run each sample in a snatch by setting up yout bot environment variables from the command line:

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

## Hello World bot

Simplest bot you can run, simply echoes a message with a mention of the Cisco Spark user.

![hello-bot-direct](docs/img/hello-bot-direct.png)

And don't forget to mention him in group rooms.

![hello-bot-group](docs/img/hello-bot-group.png)

Note that the hello bot will respond to any mentions,
no reason why he could not chat with other bots.
Below, the Hello bot (impersonnated via the Playground bot token) helling the CiscoDevNet bot.

![hello-bot-playing](docs/img/hello-bot-playing.png)



