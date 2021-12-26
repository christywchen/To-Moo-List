const express = require('express');
const router = express.Router();
const searchService = require('./services/search-service')
const { asyncHandler, taskNotFound } = require('../utils');

// Get all tasks based on search query
router.get('/tasks/:word(*+)', asyncHandler(async (req, res, next) => {
    const word = req.params.word;
    const userId = parseInt(res.locals.user.id, 10);
    const tasks = await searchService.getTasksByQuery(userId, word);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else {
        next(taskNotFound())
    }
}));

module.exports = router;
