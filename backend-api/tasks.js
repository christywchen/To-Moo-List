const express = require('express');
const router = express.Router();
const db = require('../db/models');

// get
router.get('/', async (req, res) => {
    const { taskId } = req.params
    const { userId } = req.session.auth;

    const task = await db.Task.findByPk(taskId, { where: { userId } })

    if (task) {
        res.json({ task });
    }
})
// post

// put

// delete


module.exports = router;
