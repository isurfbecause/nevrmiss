const request = require('request');
const async = require('async');
const baseUrl = 'https://www.eventbriteapi.com/v3';
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

let params = {
  address: 'sanfrancisco',
  query: 'hackathons',
  withIn: '50mi',
  sort: 'date'
};

function getOptions(url) {
  return {
    url: `${baseUrl}${url}token=${EVENTBRITE_TOKEN}`,
    json:true
  };
}

async.waterfall([
    (waterCb) => {
    //Get events
    var url = `/events/search/?q=${params.query}&location.address=${params.address}&location.within=${params.withIn}&sort_by=${params.sort}&`;

    request(getOptions(url), (err, res, body) => {
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
      //Get venue information for each event
      async.forEach(events, (event, eachCb) => {
        var url = `/venues/${event.venue_id}/?`;

        request(getOptions(url), (err, res, body) => {
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
      // Get ticket information for each event
      async.forEach(events, (event, eachCb) => {
        var url = `/events/${event.id}/ticket_classes/?`;

        request(getOptions(url), (err, res, body) => {
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