const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const getRouter = require('./routes/get');

app.set('port', process.env.PORT || 3060);

app.get('/', (req, res) => {
  const pages = "Please leave your inquiry 'https://open.kakao.com/me/KHJcode' to use this api."
  res.status(200).json(pages);
});

app.use(cors({
  origin: true,
}));
app.use(helmet());
app.use('/get', getRouter);

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}.`);
});
