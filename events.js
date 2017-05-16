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
        "endTime": "6:00PM",
        "category": "conference",
        "country": "Italy",
        "city": "Milan",
        "location_url": "http://milan2016.codemotionworld.com/"
  }
 */
var debug = require("debug")("samples");
var fine = require("debug")("samples:fine");

var request = require("request");


module.exports.fetchNext = function (limit, cb) {

    // Get list of upcoming events
    var options = {
        method: 'GET',
        url: "https://devnet-events-api.herokuapp.com/api/v1/events/next?limit=" + limit
    };

    request(options, function (error, response, body) {
        if (error) {
            debug("could not retreive list of events, error: " + error);
            cb(new Error("Could not retreive upcoming events, sorry [Events API not responding]"), null, null);
            return;
        }

        if ((response < 200) || (response > 299)) {
            console.log("could not retreive list of events, response: " + response);
            sparkCallback(new Error("Could not retreive upcoming events, sorry [bad anwser from Events API]"), null, null);
            return;
        }

        var events = JSON.parse(body);
        debug("fetched " + events.length + " events");
        fine(JSON.stringify(events));

        if (events.length == 0) {
            cb(null, events, "**Guess what? No upcoming event!**");
            return;
        }

        var nb = events.length;
        var msg = "**" + nb + " upcoming events:**\n";
        if (nb == 1) {
            msg = "**only one upcoming event:**\n";
        }
        for (var i = 0; i < nb; i++) {
            var current = events[i];
            //msg += "\n:small_blue_diamond: "
            msg += "\n" + (i+1) + ". ";
            msg += current.beginDay + " - " + current.endDay + ": [" + current.name + "](" + current.url + "), " + current.city + " (" + current.country + ")";
        }

        cb(null, events, msg);
    });
}


module.exports.fetchCurrent = function (cb) {

    // Get list of upcoming events
    var options = {
        method: 'GET',
        url: "https://devnet-events-api.herokuapp.com/api/v1/events/current"
    };

    request(options, function (error, response, body) {
        if (error) {
            debug("could not retreive list of events, error: " + error);
            cb(new Error("Could not retreive current events, sorry [Events API not responding]"), null, null);
            return;
        }

        if ((response < 200) || (response > 299)) {
            console.log("could not retreive list of events, response: " + response);
            sparkCallback(new Error("Could not retreive current events, sorry [bad anwser from Events API]"), null, null);
            return;
        }

        var events = JSON.parse(body);
        debug("fetched " + events.length + " events");
        fine(JSON.stringify(events));

        if (events.length == 0) {
            cb(null, events, "**Found no event currently going on.**");
            return;
        }

        var nb = events.length;
        var msg = "**" + nb + " events are running now:**";
        if (nb == 1) {
            msg = "**only one event is running now:**";
        }
        for (var i = 0; i < nb; i++) {
            var current = events[i];
            //msg += "\n:small_blue_diamond: "
            msg += "\n" + (i+1) + ". ";
            msg += current.beginDay + " - " + current.endDay + ": [" + current.name + "](" + current.url + "), " + current.city + " (" + current.country + ")";
        }

        cb(null, events, msg);
    });
}



module.exports.generateEventsDetails = function (event) {

    // 1 line
    var md = "about **" + event.name + "**";

    // 2 line
    md += "\n\n_" + event.category + " in " + event.city + " (" + event.country + ")";
    if (event.beginDay != event.endDay) {
        md += " from " + event.beginDayInWeek + " " + event.beginDay + ", " + event.beginTime;
        md += " till " + event.endDayInWeek + " " + event.endDay + ", " + event.endTime;
    }
    else {
        md += " on " + event.beginDayInWeek + " " + event.beginDay + ", from " + event.beginTime + " till " + event.endTime;
    }

    // 3rd and after...
    md += "_\n\n" + event.description;

    // last line
    var more = "more on [ciscodevnet](" + event.url + ")";
    if (event.location_url) {
        more += ", [organizer](" + event.location_url + ")";
    }
    more += ", [json](https://devnet-events-api.herokuapp.com/api/v1/events/" + event.id + ")";
    md += "\n\n" + more;

    return md;
}