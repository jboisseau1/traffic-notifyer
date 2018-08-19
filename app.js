const express = require('express');
const app = express();
const request = require('request');
const moment = require('moment');
require('dotenv').config({ silent: true });
const pb = require('./PushBullet.js').PushBullet;
const CONFIG = require('./config.json');
const email = require('./email.js').email;
const AppPort = process.env.PORT;
const GMAPS_APIKEY = process.env.GMAPS_APIKEY;

const ORIGIN = CONFIG.ORIGIN; //latitude and longitude
const DESTINATION = CONFIG.DESTINATION; //latitude and longitude
const DEPARTURE_TIME = CONFIG.DEPARTURE_TIME; // departure_time=now
const THINGS_TO_AVOID = CONFIG.THINGS_TO_AVOID; //avoid=tolls|highways|ferries
const URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${ORIGIN}&destination=${DESTINATION}&${THINGS_TO_AVOID}&departure_time=${DEPARTURE_TIME}&key=${GMAPS_APIKEY}`;
const NAV_LINK = `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN}&destination=${DESTINATION}`;
app.get('/', (req, res) => {
  request.get(
    {
      url: URL
    },
    (err, response, body) => {
      if (body) {
        let jsonObj = JSON.parse(body);
        let resInfo = `beep boop
Here's today's traffic information:

Best route for today is - ${jsonObj.routes[0].summary}.
It should take you ${jsonObj.routes[0].legs[0].duration.text}.

Link: ${NAV_LINK}`;
        console.log('Request received sending this update: ', resInfo);
        if (process.env.PUSHBULLET_API_KEY) {
          pb.push(
            'note',
            CONFIG.DEVID,
            CONFIG.EMAIL,
            { title: 'Traffic Update', body: resInfo },
            undefined
          );
        } else if (process.env.ROBOT_EMAIL && process.env.ROBOT_PASS) {
          email(
            process.env.TO_EMAIL,
            `Traffic for ${moment().format('MM/DD/YYYY')}`,
            resInfo
          );
        }
        res.sendStatus(200);
      } else {
        let jsonObj = JSON.parse(err);
        res.sendStatus(404);
      }
    }
  );
});

app.listen(AppPort, () => console.log(`App running on port ${AppPort}`));
