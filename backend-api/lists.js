const express = require('express');
const router = express.Router();

const { requireAuth } = require("../auth");
const db = require('../db/models');

const { asyncHandler, csrfProtection, listNotFoundError, validateList, handleValidationErrors } = require('../utils')

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
    // const lists = await db.List.findAll({
    //     where: {userId: res.locals.user.id}
    // })
    const lists = await db.List.findAll({
        where: { userId: res.locals.user.id }
    })
    res.json({ lists });
    // res.render("list");
}));

router.post('/', validateList, handleValidationErrors, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const list = await db.List.create({
        name,
        userId: res.locals.user.id
    })
    res.json({ list });
}));

router.put('/:id', validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    // TO DO change listId method. Check path
    const list = await db.List.findByPk(req.params.id);

    if (list) {
        await list.update({ name: req.body.name });
        res.json({ list })
    } else {
        next(listNotFoundError(req.params.id));
    }
}));

router.patch('/:id', validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await db.List.findByPk(listId);

    console.log(list)
    if (list) {
        const { name } = req.body;
        await list.update({ name });
        res.status(200);
        res.json({ list })
    } else {
        next(listNotFoundError(listId));
    }
}));

router.delete('/:id', asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await db.List.findByPk(listId)

    if (list) {
        await list.destroy();
        res.status(204).end();
        console.log('WORKED')
    } else {
        console.log('FAILED')
        next(listNotFoundError(listId));
    }
}))


module.exports = router;
