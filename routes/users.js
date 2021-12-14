const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler, userValidators, loginValidator } = require('../utils');
const { loginUser, logoutUser } = require('../auth');

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
  res.render('user-login', {
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
  const { username, password } = req.body;
  const validatorErrors = validationResult(req);

  let errors = [];

  if (validatorErrors.isEmpty()) {

    const user = await db.User.findOne({
      where: {username}
    })

    if (user) {
      const passMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passMatch) {
        loginUser(req, res, user);
        res.redirect('/');
      }
    }
    errors.push("Login failed. Wrong username/password.");
  } else {
    errors = [...errors, ...validatorErrors.array().map(err => err.msg)];
  }
  res.render("user-login", {
    title: "Login",
    username,
    errors,
    csrfToken: req.csrfToken(),
  });
}));

router.post('/logout', (req,res) => {
  logoutUser(req,res);
  res.redirect('/users/login');
})

module.exports = router;
