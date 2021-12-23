const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, taskNotFound } = require('../utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// get
router.get('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);

    // Does this need destruturing??
    const userId = res.locals.user.id;

    const task = await db.Task.findByPk(taskId, {
        where: userId,
        include: [db.List, db.Category]
    });

    if (task) {
        res.json({ task });
    } else {
        next(taskNotFound(taskId));
    }
}));

// completed
router.get('/tasks/completed', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id

    const tasks = await db.Task.findAll({
        where: { userId },
        include: [db.List, db.Category]
    });

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else {
        next(taskNotFound());
    }
}));



// post
router.post('/lists/:id(\\d+)', asyncHandler(async (req, res) => {
    let { name, listId } = req.body;
    listId = parseInt(listId, 10)
    const userId = res.locals.user.id;

    const task = await db.Task.create({
        name,
        userId,
        listId,
    })
    res.status(201);
    res.json({ task });
}));

// put
router.put('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await db.Task.findByPk(taskId);
    if (task) {
        //may need to change;
        const { name, description, listId, deadline, isCompleted, categoryId } = req.body;
        await task.update({
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
}));

// patch
router.patch('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await db.Task.findByPk(taskId);

    if (task) {
        //may need to change;
        const { name, description, listId, deadline, isCompleted, categoryId } = req.body;
        await task.update({
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
}));

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
router.get('/tasks', asyncHandler(async (req, res) => {
    const tasks = await db.Task.findAll({
        where: { userId: res.locals.user.id },
        include: [db.List, db.Category]
    })
    res.json({ tasks });
}));

// getting tasks by date
router.get('/tasks/today', asyncHandler(async (req, res) => {
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const tasks = await db.Task.findAll({
        where: {
            userId: res.locals.user.id,
            deadline: {
                [Op.lt]: today,
                [Op.gt]: yesterday
            }
        },
        include: [db.List, db.Category]
    })

    res.json({ tasks });
}))

router.get('/tasks/tomorrow', asyncHandler(async (req, res) => {

    const today = new Date();
    let twoDaysAhead = new Date();
    twoDaysAhead.setDate(today.getDate() + 2);
    let yesterday = new Date();
    yesterday.setDate(today.getDate());

    const tasks = await db.Task.findAll({
        where: {
            userId: res.locals.user.id,
            deadline: {
                [Op.lt]: twoDaysAhead,
                [Op.gt]: yesterday
            }
        },
        include: [db.List, db.Category]
    })

    res.json({ tasks });
}));

// Getting tasks by listId
router.get('/lists/:listId/tasks', asyncHandler(async (req, res) => {
    const tasks = await db.Task.findAll({
        where: {
            listId: req.params.listId
        },
        include: [db.List, db.Category]
    })
    res.json({ tasks })
}));

// Getting tasks by categoryId
router.get('/categories/:categoryId', asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const categoryId = req.params.categoryId

    const tasks = await db.Task.findAll({
        where: {
            categoryId,
            userId
        },
        include: [db.List, db.Category]
    })
    res.json({ tasks })
}));

module.exports = router;
