const res = require('express/lib/response');
const { user } = require('pg/lib/defaults');
const db = require('./db/models');
const { User } = db;

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id
    };

    console.log(req.session)
};

const requireAuth = (req, res, next) => {
    if (!res.locals.authenticated) {
        return res.redirect('/user/login');
    }
    return next();
}

const restoreUser = async (req, res, next) => {
    console.log(req.session);
    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await User.findByPk(userId);

            // if they exist, set res.locals to true to authenticate the user
            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            }
        } catch (err) {
            // if they don't exist, do not authenticate and pass on the error
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        // if no req.session.auth property exists at all
        // do not authenticate either
        res.locals.authenticated = false;
        next();
    }
}

const logoutUser = (req, res) => {
    delete req.session.auth;
};

module.exports = {
    loginUser,
    restoreUser,
    logoutUser,
    requireAuth,
};
