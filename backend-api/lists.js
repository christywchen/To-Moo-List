const express = require('express');
const { noExtendLeft } = require('sequelize/types/lib/operators');
const router = express.Router();
const db = require('../db/models');

const { asyncHandler, csrfProtection, listNotFoundError, validateList, handleValidationErrors } = require('../utils')

router.get('/', asyncHandler(async(req,res) => {
    console.log(res.locals.user.id)
    const lists = await db.List.findAll({
        where: {userId: res.locals.user.id}
    })
    res.json({ lists });
}));

router.post('/', validateList, handleValidationErrors, asyncHandler(async(req,res) => {
    const { name } = req.body;
    const list = await db.List.create({
        name, 
        userId: res.locals.user.id
    })
    res.json({list});
}));

router.put('/:id', validateList, handleValidationErrors, asyncHandler(async(req,res,next) => {
    const list = await db.List.findByPk(req.params.id);

    if (list){
        await list.update({ name: req.body.name });
        res.json({ list })
    } else {
        next(listNotFoundError(req.params.id));
    }
}));

router.delete('/:id', asyncHandler(async(req,res,next) => {
    const list = await db.List.findByPk(req.params.id)
    if (list) {
        await list.destroy();
        res.status(204).end;
    } else {
        next(listNotFoundError(req.params.id));
    }
}))


module.exports = router;
