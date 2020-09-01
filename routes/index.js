const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRout = require('./users');
const articleRout = require('./articles');
const NotFound = require('../errors/notfound');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login);
router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().required().min(2),
    }),
  }),
  createUser);
router.use(auth);
router.use('/users', userRout);
router.use('/articles', articleRout);
router.use('/*', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});
module.exports = router;
