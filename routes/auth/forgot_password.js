var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth/forgot_password', {title: 'NodeJS Status'})
});

module.exports = router;
