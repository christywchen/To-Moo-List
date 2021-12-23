const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, taskNotFound } = require('../utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// get / search
router.get('/tasks/:word(*+)', asyncHandler(async (req, res, next) => {
    const word = req.params.word;
    const userId = parseInt(res.locals.user.id, 10);
    const tasks = await db.Task.findAll({
        where: {
            userId,
            name: {
                [Op.iLike]: '%' + word + '%'
            }
        },
        include: [db.List, db.Category]
    });

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else {
        next(taskNotFound())
    }
}))

module.exports = router;
