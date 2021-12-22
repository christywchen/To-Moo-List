const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, taskNotFound } = require('../utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// get / search
router.get('/tasks/:word(*+)', asyncHandler(async (req, res, next) => {
    // '/tasks/:word(\\w+)'
    const word = req.params.word;
    const userId = parseInt(res.locals.user.id, 10);

    // const allTasks = await db.Task.findAll({
    //     where: { userId }
    // });

    // const caseInsensitive = word.toLowerCase();

    // const taskIds = allTasks.map( ({ name }) => name.split(' '))

    // const taskIds = allTasks.reduce((acc, task) => {
    //     const taskName = task.name.toLowerCase();
    //     const reg = new RegExp(`\b($${caseInsensitive})\b`)
    //     console.log(taskName)
    //     console.log(caseInsensitive)
    //     console.log('reg: ', taskName.match(reg))
    //     if (taskName.match(reg)) {
    //         acc = [...acc, task.id]
    //     }
    //     return acc;
    // }, [])

    // const tasks = await db.Task.findAll({
    //     where: {
    //         userId,
    //         id: [...taskIds]
    //     }
    // })

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
