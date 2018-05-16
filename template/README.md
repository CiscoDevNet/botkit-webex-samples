# Template to bootstrap a Botkit project for Webex Teams

This template regroups a set of good practices:

- configuration: pass settings either through environment variables on the command line, or by hardcoding some of them in the `.env` file. Note that env variable are priorized over the `env`file if values are found in both places.

- healthcheck: check if everything is going well by hitting the `ping` endpoint exposed automatically. 

- skills: organize your bot behaviours by placing code for 'commands', 'conversations' and 'events' in the [skills directory](skills/README.md). The bot comes with a few default skills: ".commons", "help", "fallback" and "welcome".

**Advanced users: check the ["CiscoDevNet Botkit template"](https://github.com/CiscoDevNet/botkit-template) repo branches for a more polished template, as well as the [Redis](https://github.com/CiscoDevNet/botkit-template/tree/redis), [Pluggable](https://github.com/CiscoDevNet/botkit-template/tree/plugin) branches.**


## How to run

Assuming you plan to expose your bot via [ngrok](https://ngrok.com),
you can run this template in a snatch.

1. Create a Bot account at ['Webex for Developers'](https://developer.webex.com/add-bot.html), and copy your bot's access token.

1. Launch ngrok to expose port 3000 of your local machine to the internet:

    ```sh
    ngrok http 3000
    ```

    Pick the HTTPS address that ngrok is now exposing. Note that ngrok exposes HTTP and HTTPS protocols, make sure to pick the HTTPS address.

1. [Optional] Open the `.env` file and modify the settings to accomodate your bot.

    _Note that you can also specify any of these settings via env variables. In practice, the values on the command line or in your machine env will prevail over .env file settings_

    To successfully run your bot, you'll need to specify a PUBLIC_URL for your bot, and a Webex Teams API access token (either in the .env settings or via env variables). In the example below, we do not modify any value in settings and specify all configuration values on the command line.

1. You're ready to run your bot

    From a Mac/Linux bash shell:

    ```shell
    git clone https://github.com/CiscoDevNet/botkit-webex-samples
    cd botkit-webex-samples
    cd template
    npm install
    ACCESS_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io node bot.js
    ```

    From a Windows command shell:

    ```shell
    git clone https://github.com/CiscoDevNet/botkit-webex-samples
    cd botkit-webex-samples
    cd template
    npm install
    set ACCESS_TOKEN=0123456789abcdef
    set PUBLIC_URL=https://abcdef.ngrok.io
    node bot.js
    ```

    where:

    - ACCESS_TOKEN is the REST API access token for your Webex Teams bot
    - PUBLIC_URL is the root URL at which the Webex cloud platform can reach your bot
    - [ngrok](http://ngrok.com) helps you expose the bot running on your laptop to the internet, type: `ngrok http 3000` to create a tunnel to Botkit's default port on your local machine
