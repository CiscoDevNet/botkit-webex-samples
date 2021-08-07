//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/*
 * Structure of an event
 * 
 * {
        "id": "CodeMotionMilan2016",
        "name": "Code Motion Milan",
        "url": "https://communities.cisco.com/events/1875",
        "description": "What is it? Codemotion is one of the biggest tech conferences in EMEA for software developers, with an international network of 40.000 developers and 2,000 speakers. What are you waiting for to be a Codemotioner?",
        "beginDate": "2016-11-25T07:30:00.000Z",
        "beginDay": "Nov 25",
        "beginDayInWeek": "friday",
        "beginTime": "9:30AM",
        "endDate": "2016-11-26T16:00:00.000Z",
        "endDay": "Nov 26",
        "endDayInWeek": "saturday",
        "endTime": "6:00PM",public_url
        "category": "conference",
        "country": "Italy",
        "city": "Milan",
        "location_url": "http://milan2016.codemotionworld.com/"
  }
 */

const { BotkitConversation } = require( 'botkit' );
const fetch = require( 'node-fetch' );

module.exports = async function (controller) {

    controller.hears( 'events', 'message,direct_message', async ( bot, message ) => {
        await fetch( `http://localhost:${ process.env.PORT }/www/events.json`)
            .then(res => res.json())
            .then( async json => {

                var nb = json.length;

                var msg = `**${ nb } events found:**\n`;

                for (var i = 0; i < nb; i++) {
                    var current = json[i];
                    msg += `\n ${ i+1 }. `;
                    msg += `${ current.beginDay } - ${ current.endDay }: [${ current.name }](${ current.url }), ${ current.city } (${ current.country })`;
                }

                await bot.reply( message, { markdown: msg } );
            })
    });

    controller.commandHelp.push( { command: 'events', text: 'Retrieve DevNet event details from an HTTP API providing JSON data' } );

}
