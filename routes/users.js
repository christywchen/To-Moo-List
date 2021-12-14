const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler, userValidators, loginValidator } = require('../utils');
const { loginUser } = require('../auth');

const router = express.Router();

// get /signup
router.get('/signup', csrfProtection, asyncHandler(async (req, res) => {
  res.render('user-signup', {
    title: 'Sign Up',
    csrfToken: req.csrfToken(),
  });

  console.log(res.locals.error)
}));

router.get('/login', csrfProtection, asyncHandler(async (req, res) => {
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
}));

// post /signup
router.post('/signup', csrfProtection, userValidators, asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  const user = await db.User.build({
    username,
    firstName,
    lastName,
    email
  });

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashPass = await bcrypt.hash(password, 10);
    user.hashedPassword = hashPass;
    await user.save();

    loginUser(req, res, user);

    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map(error => error.msg);

    res.render('user-signup', {
      title: "Sign Up",
      email,
      username,
      firstName,
      lastName,
      csrfToken: req.csrfToken(),
      errors
    });

  }
}));

router.post('/login', csrfProtection, loginValidator, asyncHandler(async (req, res) => {

}));

module.exports = router;
