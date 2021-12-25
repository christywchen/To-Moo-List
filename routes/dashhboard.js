var express = require('express');
var router = express.Router();
const { requireAuth } = require('../auth');


/* GET home page. */
router.get('/*', requireAuth, function (req, res, next) {
  res.render('dashboard-list', { title: 'Dashboard' });
});

module.exports = router;
