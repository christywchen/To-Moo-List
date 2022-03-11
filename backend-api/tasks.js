const express = require('express');
const router = express.Router();

const taskService = require('./services/task-service');
const { requireAuth } = require("../auth");

const { asyncHandler, taskNotFound, validateTask } = require('../utils');

router.use(requireAuth);

// Getting all tasks by userId
router.get('/', asyncHandler(async (req, res) => {
    const userId = res.locals.user.id

    const tasks = await taskService.getTasksByUser(userId);

    res.json({ tasks });
}));

// Get task by taskId
router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);

    const userId = res.locals.user.id;
    const task = await taskService.getTaskByPkAndUser(taskId, userId);

    if (task) {
        res.status(200);
        res.json({ task });
    } else {
        next(taskNotFound(taskId));
    }
}));

// Get completed tasks
router.get('/completed', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;

    const tasks = await taskService.getTasksByUser(userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else {
        next(taskNotFound());
    }
}));

// Get tasks by date
router.get('/today', asyncHandler(async (req, res, next) => {
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const userId = res.locals.user.id
    const tasks = await taskService.getTasksByDate(today, yesterday, userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}))

router.get('/tomorrow', asyncHandler(async (req, res, next) => {
    const today = new Date();
    let twoDaysAhead = new Date();
    twoDaysAhead.setDate(today.getDate() + 2);
    let yesterday = new Date();
    yesterday.setDate(today.getDate());

    const userId = res.locals.user.id
    const tasks = await taskService.getTasksByDate(twoDaysAhead, yesterday, userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}));

// Post new task
router.post('/', validateTask, asyncHandler(async (req, res) => {
    let { name, listId } = req.body;
    listId = parseInt(listId, 10)
    const userId = res.locals.user.id;

    if (!listId) {
        let task = await taskService.createTask(name, userId, null);
        task = await taskService.getTaskByPk(task.id);
        res.status(201);
        return res.json({ task });
    }

    else {
        let task = await taskService.createTask(name, userId, listId);
        task = await taskService.getTaskByPk(task.id);
        res.status(201);
        return res.json({ task });
    }
}));

// Patch - update a task
router.patch('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    let task = await taskService.getTaskByPk(taskId);

    if (task) {
        await taskService.updateTask(task, req.body);
        task = await taskService.getTaskByPk(taskId);

        res.status(200);
        res.json({ task }) //may need to change;
    } else {
        next(taskNotFound(taskId));
    }
}));

// Delete a task
router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    const task = await taskService.getTaskByPk(taskId);

    if (task) {
        await taskService.deleteTask(task);
        res.status(204).end();
    } else {
        next(taskNotFound(taskId));
    }
}))

module.exports = router;
