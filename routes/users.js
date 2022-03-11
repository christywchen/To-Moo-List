const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler, loggedIn, userValidators, loginValidator } = require('../utils');
const { loginUser, logoutUser } = require('../auth');

const router = express.Router();

// get /signup
router.get('/signup', loggedIn, csrfProtection, asyncHandler(async (req, res) => {
  res.render('user-signup', {
    title: 'Sign Up',
    csrfToken: req.csrfToken(),
  });

}));

router.get('/login', loggedIn, csrfProtection, asyncHandler(async (req, res) => {
  res.render('user-login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
}));

router.get('/demo/login', asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(1);

  loginUser(req, res, user);
  res.redirect('/dashboard');
}))

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
    res.redirect('/dashboard');

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
      where: { username }
    })

    if (user) {
      const passMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passMatch) {
        loginUser(req, res, user);
        return res.redirect('/dashboard');
      }
    }
    errors.push("Login failed. Wrong username or password.");
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

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/login');
})

module.exports = router;
