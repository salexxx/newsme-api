const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const user = require('../models/user');
const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  if (!name || !password || password.length < 6 || name.match(/^[ ]+$/)) {
    throw new BadRequest('Ведите имя и пароль не меньше 6 символов');
  }
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      email,
      password: hash,
      name,
    }))
    .then((users) => res.send({
      data: {
        name: users.name, about: users.about, avatar: users.avatar, email: users.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже зарегистрирован');
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  user
    .findById(req.user._id).orFail(new NotFound('Пользователь не найден'))
    .then((someuser) => res.send({ data: someuser }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((usr) => {
      const token = jwt.sign({ _id: usr._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token, name: usr.name, id: usr._id });
    })
    .catch((err) => next(new Unauthorized('Неправильные почта или пароль')));
};
