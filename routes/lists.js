var express = require('express');
var router = express.Router();

router.get('/:id', async(req,res) => {
    res.render('dashboard-task')
})

module.exports = router;
