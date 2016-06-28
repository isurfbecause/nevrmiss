var express = require('express');
var app = express();
var eventbrite = require('./controllers/eventbrite');

eventbrite.getEvents({});