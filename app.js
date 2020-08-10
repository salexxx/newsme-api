require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { errors } = require('celebrate');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/notfound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralizedErr } = require('./errors/centralized');
const limiter = require('./constants/limiter');

mongoose.connect('mongodb://localhost:27017/newsme', {
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

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login);
app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().required().min(2),
    }),
  }),
  createUser);
app.use(auth);
app.use(router);
app.use('/*', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(centralizedErr);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
