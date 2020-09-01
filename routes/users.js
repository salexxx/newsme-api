const userRout = require('express').Router();
const { getUser } = require('../controllers/user');

userRout.get('/me', getUser);
module.exports = userRout;
