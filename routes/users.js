const userRout = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { getUser } = require('../controllers/user');

// userRout.get('/', getUsers);

userRout.get('/me', getUser);
module.exports = userRout;
