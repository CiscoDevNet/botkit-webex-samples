# Changes

**v0.5.0 (2020-03-06): Align with updated botkit-template**
    - Remove template/ sample - moved to CiscoDevNet/botkit-template
    - Remove learninglab/ sample - lab is now based on botkit-template
    - Emoji sample - convert to feature/update for Botkit 0.7
    - Emoji sample - remove unsupported websocket functionality (now a supported part of Webex JS SDK and botkit-template)
    - Use .env better for config/secrets
    - roomid-phantom.js - convert to a feature, rename as '*_disabled', update readme with caveats
    - redis/ - remove this sample as Botkit storage usage has changed focus
    - externalapi/ - convert to feature `events.js`; host the JSON data API on the local Botkit web server
    - roomkit/ - convert to a feature `roomkit.js`; add xStatus CLI command; remove dynamic connection
    - disturbed/ - removed; Botkit no longer supports timeouts in conversations


**v0.4.0 (2018-12-17): Botkit framework update**
   - uses Botkit latest (v0.7.0) 

**v0.3.0 (2018-05-17): Webex Teams rebrand**
   - changing to new 'convos' code in the Botkit samples (after Webex rebrand)
   - uses Botkit latest (v0.6.14) 
   - fixed issues when 'convo.repeat()' needs a pre-pended message (several skills involved)
   - fixed issue in 'timeout' skill
   - added 'storage' skill to demo Botkit capability to store data (in-memory or to a backend)
   - tested also with "github:ObjectIsAdvantag/botkit#non-breaking"
       - tip: `npm install --save ObjectIsAdvantag/botkit#non-breaking`

