const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, validatePriority, priorityNotFound } = require('../utils');

router.get('/', asyncHandler(async(req,res) =>{
    const priorities = await db.Priority.findAll();
    res.json({ priorities });
}));

router.get('/:priorityId', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const priorityId = req.params.priorityId

    const tasks = await db.Task.findAll({
        where: {
            priorityId,
            userId
        },
        include: [db.List, db.Priority]
    })

    if (tasks) {
        res.status(200);
        res.json({ tasks })
    } else next(priorityNotFound());
}));

router.post('/', validatePriority, asyncHandler(async(req,res) => {
    const { name } = req.body;
    const priority = await db.Priority.create({
        name
    })

    res.status(201);
    res.json({ priority });
}))

module.exports = router;
