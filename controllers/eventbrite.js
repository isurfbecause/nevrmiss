const request = require('request');
const async = require('async');
const baseUrl = 'https://www.eventbriteapi.com/v3';
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

exports.getEvents = getEvents;
exports.getEventsApi = getEventsApi;
exports.getVenuesApi = getVenuesApi;

function getEvents(params, callback) {
  params = {
    address: params.address || 'sanfrancisco',
    query: params.query || 'hackathons',
    withIn: params.withIn || '50mi',
    sort: params.sort || 'date'
  };

  async.waterfall([
      (waterCb) => {
      //Get events
      let url = `/events/search/?q=${params.query}&location.address=${params.address}&location.within=${params.withIn}&sort_by=${params.sort}&`;

      getEventsApi(url, waterCb);
      },
      (events, waterCb) => {
        //Get venue information for each event
        async.forEach(events, (event, eachCb) => {
          let url = `/venues/${event.venue_id}/?`;

          getVenuesApi(url, event, eachCb);

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
          let url = `/events/${event.id}/ticket_classes/?`;

          request.get(getOptions(url), (err, res, body) => {
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
      callback(null, events);
  });
}

function getEventsApi(url, cb) {
  request.get(getOptions(url), (err, res, body) => {
    let events = [];

    if (err) {
      return cb(err);
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

    return cb(null, events);
  });
}

function getVenuesApi(url, event, cb) {
  return request.get(getOptions(url), (err, res, body) => {
    if (err) {
      return cb(err);
    }

    event.venue = {
      name: body.name,
      address_1: body.address.address_1,
      address_2: body.address.address_2,
      city: body.address.city,
      region: body.address.region,
      postal_code: body.address.postal_code
    };

    cb(null, event.venue);
  });
}

function getOptions(url) {
  return {
    url: `${baseUrl}${url}token=${EVENTBRITE_TOKEN}`,
    json:true
  };
}