var express = require('express');
var app = express();
var eventbrite = require('./controllers/eventbrite');

eventbrite.getEvents({}, (err, result) => {
  if (err) {
    throw err;
  }

  console.log(result);
});

//test
