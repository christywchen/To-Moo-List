var express = require('express');
const res = require('express/lib/response');
// const { user, user } = require('pg/lib/defaults');
var router = express.Router();
const { requireAuth } = require('../auth');

const db = require('../db/models');
const { User } = db;


/* GET home page. */
router.get('/*', requireAuth, function (req, res, next) {
  res.render('dashboard-list', { title: 'Dashboard' });
});

//check if the user is already signed up/logged in
router.get('/', (req, res, next) => {
  const persistentUser = async (req, res) => {
    if (req.session.auth) {
      const { userId } = req.session.auth;
      const person = await User.findByPK(userId);
      if (person) return true;
      // else return false
  // } 
      else return false
  }
  if (persistentUser()) {
    res.render('dashboard-list');
  } else {
    res.render('user-login')
  }

}});


module.exports = router;
