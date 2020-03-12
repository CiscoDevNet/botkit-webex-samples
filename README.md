# botkit-webex-samples

This project implements a Botkit + Webex Teams adapter bot, based on the DevNet [botkit-template](https://www.github.com/CiscoDevNet/botkit-template) project, providing some additional interesting samples and examples:

- `emoji.js`- Converts emoji tags into unicode characters and returns the "emojified" phrase

- `events.js` - Retrieve/display DevNet event details from an HTTP REST API providing JSON data

- `roomid-phantom.js` - Helpful utility bot; when added to a room, it creates a separate space with the requestor and outputs the roomId of the original room

- `roomkit.js` - Interact with a Cisco room device via xAPI/jsxapi.  Query the device's 'PeopleCount' function, or execute an ad hoc 'xStatus' CLI command

- `survey.js` - Implements a basic survey, posting survey data into a cloud service (i.e. Webex Teams) via an external REST API 

## Websockets vs. Webhooks

Most Botkit features can be implemented by using the Webex Teams JS SDK websockets functionality, which establishes a persistent connection to the Webex Teams cloud for outbound and inbound messages/events.

Webex Teams also supports traditional HTTP webhooks for messages/events, which requires that your bot be accessible via a publically reachable URL.  A public URL is also needed if your bot will be serving any web pages/files, e.g. images associated with the cards and buttons feature or the health check URL.

- If you don't need to serve buttons and cards images, you can set the environment variable `WEBSOCKET_EVENTS=True` and avoid the need for a public URL
- If you are implementing buttons & cards, you will need a public URL (e. g. by using a service like Ngrok, or hosting your bot in the cloud) - configure this via the `PUBLIC_URL` environment variable 

## How to run (local machine)

Assuming you plan to us [ngrok](https://ngrok.com) to give your bot a publically available URL (optional, see above), you can run this template in a jiffy:

1. Clone this repo:

    ```sh
    git clone https://github.com/CiscoDevNet/botkit-webex-samples.git

    cd botkit-webex-samples
    ```

1. Install the Node.js dependencies:

    ```sh
    npm install
    ```

1. Create a Webex Teams bot account at ['Webex for Developers'](https://developer.webex.com/my-apps/new/bot), and note/save your bot's access token

1. Launch Ngrok to expose port 3000 of your local machine to the internet:

    ```sh
    ngrok http 3000
    ```

    Note/save the 'Forwarding' HTTPS address that ngrok generates

1. Rename the `env.example` file to `.env`, then edit to configure the settings and info for your bot.  Individual features included in this project may need specific configurations in `.env` (see the comments at the top of each feature `.js` file for details.)

    >Note: you can also specify any of these settings via environment variables (which will take precedent over any settings configured in the `.env` file)...often preferred in production environments

    To successfully run all of the sample features, you'll need to specify at minimum a `WEBEX_ACCESS_TOKEN` (Webex Teams bot access token), and either a `PUBLIC_URL` or enable `WEBSOCKET_EVENTS`.

    >Note: If running on Glitch.me or Heroku (with [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata) enbaled), the `PUBLIC_URL` will be auto-configured

    Additional values in the `.env` file (like `OWNER` and `CODE`) are used to populate the healthcheck URL meta-data.

    Be sure to save the `.env` file!

1. You're ready to run your bot:

    ```sh
    node bot.js
    ```

## Quick start on Glitch.me

* Click [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/CiscoDevNet/botkit-template)

* Open the `.env` file, then uncomment the `WEBEX_ACCESS_TOKEN` variable and paste in your bot's access token

    **Optional**: enter appropirate info in the "Bot meta info..." section

    >Note that thanks to Glitch `PROJECT_DOMAIN` env variable, you do not need to add a `PUBLIC_URL` variable pointing to your app domain

You bot is all set, responding in 1-1 and 'group' spaces, and sending a welcome message when added to a space!

You can verify the bot is up and running by browsing to its healthcheck URL (i.e. the app domain.)

## Quick start on Heroku

* Create a new project pointing to this repo.

* Open your app settings, view your config variables, and add a `WEBEX_ACCESS_TOKEN` variable with your bot's access token as value.

* Unless your app is using [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata), you also need to add a PUBLIC_URL variable pointing to your app domain.

![](assets/images/heroku_config-variables.png)

You bot is all set, responding in 1-1 and 'group' spaces, and sending a welcome message when added to a space!

You can verify the bot is up and running by browsing to its healthcheck URL (i.e. the app domain.)