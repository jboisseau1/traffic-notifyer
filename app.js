const express = require('express');
const app = express();
require('dotenv').config({ silent: true });
const AppPort = process.env.PORT;
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(AppPort, () =>
  console.log(`Example app listening on port ${AppPort}!`)
);
