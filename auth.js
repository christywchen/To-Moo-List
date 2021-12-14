const db = require('./db/models');
const { User } = db;

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id
    };

    console.log(req.session)
};

module.exports = {
    loginUser
};
