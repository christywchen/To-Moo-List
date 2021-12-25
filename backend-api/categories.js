const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, validateCategory, categoryNotFound } = require('../utils');

router.get('/', asyncHandler(async(req,res) =>{
    const categories = await db.Category.findAll();
    res.json({ categories });
}));

router.get('/:categoryId', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const categoryId = req.params.categoryId

    const tasks = await db.Task.findAll({
        where: {
            categoryId,
            userId
        },
        include: [db.List, db.Category]
    })

    if (tasks) {
        res.status(200);
        res.json({ tasks })
    } else next(categoryNotFound());
}));

router.post('/', validateCategory, asyncHandler(async(req,res) => {
    const { name } = req.body;
    const category = await db.Category.create({
        name
    })

    res.status(201);
    res.json({ category });
}))

module.exports = router;
