require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralizedErr } = require('./errors/centralized');
const limiter = require('./constants/limiter');

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB : 'mongodb://localhost:27017/newsme', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(helmet());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(centralizedErr);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
