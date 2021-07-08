const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const getCoordinates = require('./lib/get-coordinates');
const GET_URL = require('./lib/url');
const webParsing = require('./lib/parsing');

const app = express();

app.set('port', process.env.PORT || 3060);

app.use(cors({
  origin: true,
}));
app.use(helmet());

app.get('/', async (req, res) => {
  const { v1, v2 } = req.query;

  const rs = getCoordinates(v1, v2);
  const url = GET_URL(rs.x, rs.y);

  await webParsing(url)
    .then(data => {
      res.status(200).json(data);
    },
    error => {
      console.log(error);
      return res.status(500).json(error);
    });
});

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}.`);
});
