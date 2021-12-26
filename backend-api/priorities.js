const express = require('express');
const router = express.Router();
const priorityService = require('./services/priority-service');
const { asyncHandler, validatePriority, priorityNotFound } = require('../utils');

// Get all priorities
router.get('/', asyncHandler(async (req, res) => {
    const priorities = await priorityService.getPriorities();

    res.json({ priorities });
}));

// Get all tasks by priorityId and userId
router.get('/:priorityId', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const priorityId = req.params.priorityId

    const tasks = await priorityService.getTasksByPriorityAndUser(priorityId, userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks })
    } else {
        next(priorityNotFound());
    }
}));

// Create a new priority
router.post('/', validatePriority, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const priority = await priorityService.createPriority(name);

    res.status(201);
    res.json({ priority });
}))

module.exports = router;
