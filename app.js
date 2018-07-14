const express = require('express');
const app = express();
require('dotenv').config({ silent: true });
const AppPort = process.env.PORT;
const APIKEY = process.env.APIKEY;
const request = require('request');
app.get('/', (req, res) => {
  request.get(
    {
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood4&key=${APIKEY}`
    },
    (err, response, body) => {
      if (body) {
        let jsonObj = JSON.parse(body);
        console.log(jsonObj.routes[0].summary);
        res.send(jsonObj.routes);
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
