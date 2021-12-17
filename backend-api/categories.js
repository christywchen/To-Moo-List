const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('../utils');

router.get('/', asyncHandler(async(req,res) =>{
    const categories = await db.Category.findAll();
    res.json({ categories });
}));

router.post('/', asyncHandler(async(req,res) => {
    const { name } = req.body;
    const category = await db.Category.create({
        name
    })
    res.status(201);
    res.json({ category });
}))

module.exports = router;
