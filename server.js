const request = require('request');
const async = require('async');

var url = `https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.address=sanfrancisco&location.within=50mi&sort_by=date&token=${process.env.EVENTBRITE_TOKEN}`;

async.waterfall([
    (waterCb) => {
      var requestOptions = {
        url: url,
        json:true
      };

    request(requestOptions, (err, res, body) => {
      var events = [];

      if (err) {
        return waterCb(err);
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
    (events, waterCb) => {
      async.forEach(events, (event, eachCb) => {
        var requestOptions = {
          url: `https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.EVENTBRITE_TOKEN}`,
          json: true
        };

        request(requestOptions, (err, res, body) => {
          if (err) {
            return eachCb(err);
          }

          event.venue = {
            name: body.name,
            address:  body.address,
            address_1: body.address.address_1,
            address_2: body.address.address_2,
            city: body.address.city,
            region: body.address.region,
            postal_code: body.address.postal_code
          };

          eachCb();
        });
      }, (err) => {
          if (err) {
            return waterCb(err);
          }

          waterCb(null, events);
        });
    },
    (events, waterCb) => {
      async.forEach(events, (event, eachCb) => {
        var requestOptions = {
          url: `https://www.eventbriteapi.com/v3/events/${event.id}/ticket_classes/?token=${process.env.EVENTBRITE_TOKEN}`,
          json: true
        };

        request(requestOptions, (err, res, body) => {
          if (err) {
            return eachCb(err);
          }

          body.ticket_classes.map((ticket) => {
            event.cost = ticket.cost;
            event.fee= ticket.fee;
            event.tax= ticket.cost;
          });

          eachCb();
        });
      }, (err) => {
        if (err) {
          return waterCb(err);
        }

        waterCb(null, events);
      });
    }], function (err, events) {
    console.log('events ', events);
});