const router = require('express').Router();
const userRout = require('./users');
const articleRout = require('./articles');
const NotFound = require('../errors/notfound');

router.use('/users', userRout);
router.use('/articles', articleRout);
router.use('/*', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});
module.exports = router;
