const express = require('express');
const router = express.Router();

const getCoordinates = require('../script/getCoord');
const webParsing = require('../script/parsing');

router.get('/', (req, res) => res.status(200).json('/get/mode/key/latitude/longitude'));

router.get('/:mode/:id/:v1/:v2', userCheck, async (req, res, next) => {
  const v1 = req.params.v1;
  const v2 = req.params.v2;
  const rs = getCoordinates('toXY', v1, v2);
  const url = `https://www.weather.go.kr/weather/forecast/digital_forecast.jsp?x=${rs.x}&y=${rs.y}&unit=K`;
  const mode = req.params.mode;

  await webParsing(url, mode)
    .then(data => {
      res.status(200).json(data);
    },
    error => {
      return res.status(404).json('Not found.');
  });
});

function userCheck(req, res, next) {
  const userkey = ['turbo'];

  if (userkey.includes(req.params.id)) return next();
  return res.status(404).json('User key is not found.');
}

module.exports = router;
