var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(res.locals);
  res.render('home', { title: 'Home' });
});

module.exports = router;
