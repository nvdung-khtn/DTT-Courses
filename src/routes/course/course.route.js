const express = require('express');
const router = express.Router();

router.get('/listcourse', (req, res)=>{
    res.render('vwCourse/listcourse', {layout: "course"});
})

module.exports = router;