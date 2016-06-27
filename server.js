const request = require('request');
const async = require('async');

var url = `https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.address=sanfrancisco&location.within=50mi&sort_by=date&token=${process.env.EVENTBRITE_TOKEN}`;

async.waterfall([
    function(waterCb) {
      var requestOptions = {
        url: url,
        json:true
      };

    request(requestOptions, (err, res, body) => {
      var events = [];

      if (err) {
        return autoCb(err);
      }

      events = body.events.map((event) => {
        return {
          id: event.id,
          name: event.name.text,
          url: event.url,
          description: event.description,
          start: event.start.local,
          end: event.end.local,
          currency: event.currency,
          venue_id: event.venue_id
        };
      });

      waterCb(null, events);
    });
    },
    function(events, callback) {
      var venue = [];

      async.forEach(result.getEvents, (event, eachCb) => {
        var requestOptions = {
          url: `https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.EVENTBRITE_TOKEN}`,
          json: true
        };

        request(requestOptions, (err, res, body) => {
          if (err) {
            throw err;
          }

          venue = {
            name: body.name,
            address: body.address
          };

          eachCb()
        });
          autoCb(null, venue);
      });
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});

async.auto({
  getEvents: (autoCb) => {
    var requestOptions = {
      url: url,
      json:true
    };

    request(requestOptions, (err, res, body) => {
      var events = [];

      if (err) {
        return autoCb(err);
      }

      events = body.events.map((event) => {
        return {
          id: event.id,
          name: event.name.text,
          url: event.url,
          description: event.description,
          start: event.start.local,
          end: event.end.local,
          currency: event.currency,
          venue_id: event.venue_id
        };
      });

      autoCb(null, events);
    });
  },
  getVenues: ['getEvents', (result, autoCb) => {
    var venue = [];

    async.forEach(result.getEvents, (event, eachCb) => {
      var requestOptions = {
        url: `https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.EVENTBRITE_TOKEN}`,
        json: true
      };

      request(requestOptions, (err, res, body) => {
        if (err) {
          throw err;
        }

        venue = {
          name: body.name,
          address: body.address
        };

        eachCb()
      });
        autoCb(null, venue);
    });
  }],
  // getTickets: ['getEvents', 'getVenues', (result, autoCb) => {
  //   var tickets = [];

  //   result.getEvents.forEach((event) => {
  //     var requestOptions = {
  //       url: `https://www.eventbriteapi.com/v3/events/${event.id}/ticket_classes/?token=${process.env.EVENTBRITE_TOKEN}`,
  //       json: true
  //     };

  //     request(requestOptions, (err, res, body) => {
  //       if (err) {
  //         // return autoCb(err);
  //       }

  //       tickets = body.ticket_classes.map((ticket) => {
  //         return {
  //           cost: ticket.cost,
  //           fee: ticket.fee,
  //           tax: ticket.cost,
  //         };
  //       });

  //       // autoCb(null, tickets);
  //     });
  //   });
  // }]
});