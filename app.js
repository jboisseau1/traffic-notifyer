const express = require('express');
const app = express();
const request = require('request');
require('dotenv').config({ silent: true });
const sendMessage = require('./index.js');

const AppPort = process.env.PORT;
const APIKEY = process.env.APIKEY;

const ORIGIN = '38.9552958,-77.3665917'; //latitude and longitude
const DESTINATION = '38.8677246,-77.1815755'; //latitude and longitude
const DEPARTURE_TIME = 'now'; // departure_time=now
const THINGS_TO_AVOID = 'avoid=tolls'; //avoid=tolls|highways|ferries

app.get('/', (req, res) => {
  request.get(
    {
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${ORIGIN}&destination=${DESTINATION}&${THINGS_TO_AVOID}&departure_time=${DEPARTURE_TIME}&key=${APIKEY}`
    },
    (err, response, body) => {
      if (body) {
        let jsonObj = JSON.parse(body);
        let resInfo = `
        beep boop here's today's traffic information:

        Best route for today is - ${jsonObj.routes[0].summary}.
        It should take you ${jsonObj.routes[0].legs[0].duration.text}.

        `;
        console.log(resInfo);
        console.log(sendMessage);
        res.send(jsonObj);
      } else {
        let jsonObj = JSON.parse(err);
        res.send(jsonObj);
      }
    }
  );
});

app.listen(AppPort, () =>
  console.log(`Example app listening on port ${AppPort}!`)
);
