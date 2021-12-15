const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('../utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const taskNotFound = taskId => {
    const err = new Error(`Task with id ${taskId} could not be found.`)
    err.title = "Task not found";
    err.status = 404;
    return err;
}

// get
router.get('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const { taskId } = req.params

    // const { userId } = req.session.auth;
    const { userId } = res.locals.user.id

    const task = await db.Task.findByPk(taskId, { where: { userId } })

    if (task) {
        res.json({ task });
    } else {
        next(taskNotFound(taskId));
    }
}))

// post
router.post('/lists/:id(\\d+)', asyncHandler(async (req, res) => {
    const { name, listId } = req.body;
    const task = await db.Task.create({
        name,
        userId: res.locals.user.id,
        listId,
        categoryId: 1,
    })
    res.status(201);
    res.json({ task });
}))

// put
router.put('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await db.Task.findByPk(taskId);
    if (task) {
        //may need to change;
        const { name, description, listId, deadline, isCompleted, categoryId } = req.body;
        await task.updata({
            name,
            description,
            listId,
            deadline,
            isCompleted,
            categoryId,
        })
        res.status(200);
        res.json({ task }) //may need to change;
    } else {
        next(taskNotFound(taskId));
    }
}))


// delete
router.delete('/tasks/:id(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await db.Task.findByPk(taskId);
    if (task) {
        await task.destroy();
        res.status(204).end();
    } else {
        next(taskNotFound(taskId));
    }
}))

// getting all tasks by userId
router.get('/tasks', asyncHandler(async (req,res) => {
    const tasks = await db.Task.findAll({
        where: {userId: res.locals.user.id}
    })
    res.json({ tasks });
}));

// getting tasks by date
router.get('/tasks/:dueToday', asyncHandler(async (req,res) => {
    const tasks = await db.Task.findAll({
        where: {
            userId: res.locals.user.id,
            deadline: {
                [Op.gte]: req.params.dueToday
            }
        }
    })

    res.json({ tasks });
}))

// Getting tasks by listId
router.get('/lists/:listId/tasks', asyncHandler(async (req,res) => {
    const tasks = await db.Task.findAll({
        where: {
            listId: req.params.listId
        }
    })
    res.json({ tasks })
}))

module.exports = router;
