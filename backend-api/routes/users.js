const express = require('express');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const db = require('../../db/models');
const { csrfProtection, asyncHandler, userValidators} = require('../../utils');
const router = express.Router();

//route for registration 
router.post('/signup', csrfProtection, userValidators, asyncHandler(async(req, res) => {
    const {username, firstName,lastName, email, password } = req.body;
    const user = await db.User.build({
        username,
        firstName,
        lastName,
        email
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const hashPass = await bcrypt(password, 10);
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
        })
    }

}))

module.exports = router;
