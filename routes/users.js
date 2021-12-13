var express = require('express');
var router = express.Router();
const {csrfProtection, asyncHandler,} = require('../utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//route for registration (front-end)
router.get('/signup', csrfProtection, asyncHandler(async (req, res) => {
    res.render('user-signup', {
      title:'Sign Up',
      csrfToken: req.csrfToken(),
    })
}))

//route for registration (back-end)
router.post('/signup', )

module.exports = router;
