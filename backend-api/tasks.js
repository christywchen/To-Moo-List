const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('../utils');

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
    const { name } = req.body;
    const { listId } = req.params;
    const task = await db.Task.create({
        name,
        userId: req.user.id,
        listId,
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


module.exports = router;
