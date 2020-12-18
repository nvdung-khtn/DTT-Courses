const express = require('express');
const router = express.Router();

const courseController = require('../../controllers/course/CourseController')

router.get('/listcourse', (req, res)=>{
    res.render('vwCourse/listcourse', {layout: "course"});
})

router.get('/', courseController.index);

module.exports = router;