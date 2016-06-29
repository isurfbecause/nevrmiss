const mocha = require('mocha');
const sinon = require('sinon');
const request = require('request');
const eventbrite = require('../../controllers/eventbrite.js');
const assert = require('assert');

let stubResults = {
  events:
  [{ name: { text: 'hackathon sf'},
       description: {description: 'A very cool hackathon'},
       id: '26229683690',
       url: 'http://www.eventbrite.com/e/protohack-the-code-free-hackathon-san-francisco-ca-tickets-26229683690?aff=ebapi',
       start: {local: '2016-24-06'},
       end: {local: '2016-26-06'},
       created: '2016-06-23T18:13:19Z',
       changed: '2016-06-26T00:41:50Z',
       capacity: 120,
       status: 'live',
       currency: 'USD',
       listed: true,
       shareable: true,
       online_event: false,
       tx_time_limit: 960,
       hide_start_date: false,
       hide_end_date: false,
       locale: 'en_US',
       is_locked: false,
       privacy_setting: 'unlocked',
       is_series: false,
       is_series_parent: false,
       is_reserved_seating: false,
       logo_id: '22070791',
       organizer_id: '7488486017',
       venue_id: '15823164',
       category_id: '102',
       subcategory_id: '2004',
       format_id: '2',
       resource_uri: 'https://www.eventbriteapi.com/v3/events/26229683690/',
       logo: [Object] }]
   };

describe('getEvents', function() {
  before(function(done) {
    sinon
      .stub(request, 'get')
      .yields(null, null, stubResults);
    done();
  });

  after(function(done) {
    request.get.restore();
    done();
  });

  it('should return events', function (done) {
    var expect = [ { id: '26229683690', name: 'hackathon sf', url: 'http://www.eventbrite.com/e/protohack-the-code-free-hackathon-san-francisco-ca-tickets-26229683690?aff=ebapi', description: { description: 'A very cool hackathon' }, start: '2016-24-06', end: '2016-26-06', currency: 'USD', venue_id: '15823164' } ];

    eventbrite.getEventsApi({}, (err, res) => {
      assert.deepEqual(res, expect);
      done();
    });
  });
});


describe('getVenues', function() {
  let venueStub = {
    name: 'Westfield Mall',
    address:
      {
        address_1: '123 San Francisco St.',
        address_2: 'Suite 150',
        city: 'San Francisco',
        region: 'CA',
        postal_code: '94102'
      }
  };

  before(function(done) {
    sinon
      .stub(request, 'get')
      .yields(null, null, venueStub);
    done();
  });

   after(function(done) {
    request.get.restore();
    done();
  });

  it('should return events', function (done) {
    var event = { name: 'Westfield Mall',
  address_1: '123 San Francisco St.',
  address_2: 'Suite 150',
  city: 'San Francisco',
  region: 'CA',
  postal_code: '94102',
  notThis: 'do not include' };

    var expect = { name: 'Westfield Mall',
  address_1: '123 San Francisco St.',
  address_2: 'Suite 150',
  city: 'San Francisco',
  region: 'CA',
  postal_code: '94102' };

    eventbrite.getVenuesApi('www.test.com', event, (err, res) => {
      // console.log('res ', res);
      assert.deepEqual(res, expect);
      done();
    });
  });
});






























