var express = require('express');
var router = express.Router();

router.get('/:id', async(req,res) => {
    res.render('dashboard-list')
})

module.exports = router;
