const router = require('express').Router();
const userRout = require('./users');
const articleRout = require('./articles');

router.use('/users', userRout);
router.use('/articles', articleRout);

module.exports = router;
