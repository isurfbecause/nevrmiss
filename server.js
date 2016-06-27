const request = require('request');

var url = `https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.address=sanfrancisco&location.within=50mi&sort_by=date&token=${process.env.EVENTBRITE_TOKEN}`;

var requestOptions = {
  url: url,
  json:true
};

request(requestOptions, (err, res, body) => {
  var events;

  if (err) {
    throw err;
  }

  events = body.events.forEach((event) => {

    var requestOptions = {
      url: `https://www.eventbriteapi.com/v3/events/${event.id}/ticket_classes/?token=${process.env.EVENTBRITE_TOKEN}`,
      json: true
    };

    var requestOptions = {
      url: `https://www.eventbriteapi.com/v3/venues/${event.venue_id}/?token=${process.env.EVENTBRITE_TOKEN}`,
      json: true
    };

    request(requestOptions, (err, res, body) => {
      console.log(body);
    });

    // request(requestOptions, (err, res, body) => {
    //   var tickets = body.ticket_classes.map((ticket) => {
    //     return {
    //       cost: ticket.cost,
    //       fee: ticket.fee,
    //       tax: ticket.cost,
    //       id: event.id,
    //       name: event.name.text,
    //       url: event.url,
    //       // description: event.description,
    //       start: event.start.local,
    //       end: event.end.local,
    //       currency: event.currency
    //     };
    //   });

    //   console.log(tickets);
    // });

  });

  // events = body.events.map((event) => {
  //   return {
  //     id: event.id,
  //     name: event.name.text,
  //     url: event.url,
  //     // description: event.description,
  //     start: event.start.local,
  //     end: event.end.local,
  //     currency: event.currency
  //   };
  // });
  // console.log(events);
});