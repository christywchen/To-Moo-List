const express = require('express');
const router = express.Router();

const listService = require('./services/list-service');
const { requireAuth } = require("../auth");

const { asyncHandler, csrfProtection, listNotFoundError, validateList, handleValidationErrors } = require('../utils')

router.use(requireAuth);

// Get all lists by userId
router.get('/', asyncHandler(async (req, res, next) => {
    const lists = await listService.getListsByUserId(res.locals.user.id);

    if (lists) {
        res.json({ lists });
        res.status(200);
    } else next(listNotFoundError());
}));

// Getting all tasks by listId
router.get('/:listId/tasks', asyncHandler(async (req, res, next) => {
    const listId = req.params.listId;

    const tasks = await listService.getTasksByListId(listId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}));

// Post a new list
router.post('/', validateList, handleValidationErrors, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const list = await listService.createList(name, res.locals.user.id);

    res.status(201);
    res.json({ list });
}));

// Put - update list name
router.put('/:id', validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await listService.getListByPk(listId);

    if (list) {
        const { name } = req.body;
        await listService.updateList(list, name);

        res.status(200);
        res.json({ list })
    } else {
        next(listNotFoundError(req.params.id));
    }
}));

// Patch - update list name
router.patch('/:id', validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await listService.getListByPk(listId);

    if (list) {
        const { name } = req.body;
        await listService.updateList(list, name);

        res.status(200);
        res.json({ list })
    } else {
        next(listNotFoundError(listId));
    }
}));

// Delete a task
router.delete('/:id', asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await listService.getListByPk(listId);

    if (list) {
        await listService.deleteList(list);
        res.status(204).end();
    } else {
        next(listNotFoundError(listId));
    }
}))


module.exports = router;
