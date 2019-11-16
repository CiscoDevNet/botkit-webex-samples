# Botkit samples for Webex Teams

This community project driven regroups:

- Webex Teams bot samples built with [Howdy's Botkit](https://github.com/howdyai/botkit) 
- A template to quickly bootstrap your Botkit / Webex Teams bot project _(updated for Botkit 4.5)_
- An experimental websocket usage example

We suggest you start with the HelloWorld bot sample below.

**New to Botkit?**

- Read the ["Botkit guide"](https://botkit.ai/docs/v4/platforms/webex.html)
- Take the ["Create Conversational Bots with Botkit" learning lab](https://learninglabs.cisco.com/tracks/collab-cloud/spark-apps/collab-spark-botkit/step/1)

**New to Webex Teams?**

- Go straight to [Webex for Developers](https://developer.webex.com), sign in and click [My apps](https://developer.webex.com/my-apps) to create a Webex Teams bot account

## Hello World (bot command)

Simplest bot you can code: echo a message plus the Webex Teams user name that mentioned the bot:

![hello-bot-direct](docs/img/hello-bot-direct.png)

And don't forget to `@mention` the bot in group spaces:

![hello-bot-group](docs/img/hello-bot-group.png)

Note that the bot will respond to anyone mentioning it, which means it can chat with other bots!

![hello-bot-playing](docs/img/hello-bot-playing.png)

Assuming your bot is accessible from the internet or you exposed it via a tunneling tool such as [ngrok](https://ngrok.com), you can run any sample in a jiffy:

### How to run helloworld.js

[ngrok](http://ngrok.com) helps you expose the bot running on your laptop to the internet, type: `ngrok http 8080` to launch

From a Mac/Linux terminal window, type:

```shell
git clone https://github.com/CiscoDevNet/botkit-webex-samples
cd botkit-webex-samples
npm install
ACCESS_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io node helloworld.js
```

From a Windows CMD shell, type:

```shell
git clone https://github.com/CiscoDevNet/botkit-webex-samples
cd botkit-webex-samples
npm install
set ACCESS_TOKEN=0123456789abcdef
set PUBLIC_URL=https://abcdef.ngrok.io
set SECRET=not that secret
node helloworld.js
```

where:

- ACCESS_TOKEN is the API access token of your Webex Teams bot
- PUBLIC_URL is the root URL at which the Webex Cloud platform can reach your bot

## Bootstrap a Botkit project for Webex Teams (template)

The [template](template/) regroups a set of best practices:
- configuration: pass settings either through environment variables on the command line, or by hardcoding some of them in the `.env` file. Note that env variable are priorized over the `env`file if values are found in both places.
- healthcheck: check if everything is going well by hitting the `ping` endpoint exposed automatically. 
- skills: organize your bot behaviours by placing 'hear commands', 'convos' and 'events' in the [skills directory](template/skills/). The bot comes with a ".commons", "help", "fallback" and "welcome" skills.

## Conversations demo bot (convos)

A [conversational bot](convos/) that illustrates Botkit conversation system through examples. The bot is built with the [template provided in this repo](template/).

You can test the bot live by inviting `convos@sparkbot.io` to a Webex Teams's space.

![convos](docs/img/convos.png)

## DevNet events (external api invocation)

This bot illustrates how you can [create conversations](externalapi/bot.js#L117),
and uses a [wrapper to an external API](externalapi/events.js) hosted on Heroku that lists current and upcoming events at DevNet.

![devnet-Botkit](docs/img/devnet-botkit-convo.png)

## Emoji (websocket)

This [bot turns emoji tags](emoji.js#58) to unicode characters and posts back the 'emojified' phrase

The bot leverages the [experimental websocket library for Webex Teams](https://github.com/marchfederico/ciscospark-websocket-events),
so that you don't need to register a Webhook and expose your bot on the internet.

From a Mac/Linux bash shell, type:

```shell
> npm install
> ACCESS_TOKEN=0123456789abcdef node emoji.js
```

From a Windows shell, type:

```shell
> npm install
> set ACCESS_TOKEN=0123456789abcdef
> node emoji.js
```

![emoji](docs/img/emoji-websocket.png)