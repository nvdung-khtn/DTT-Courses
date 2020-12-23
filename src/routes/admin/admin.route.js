const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');


router.get('/', adminController.index);
router.get('/student',adminController.manageStudent)
router.get('/lecturer',adminController.manageLecturer)
router.get('/product',adminController.manageProduct)
router.get('/category',adminController.manageCategory)
router.get('/student/edit',adminController.editStudent)
router.get('/lecturer/edit',adminController.editLecturer)
router.get('/product/edit',adminController.editCourse)

//router.post('/', loginController.login);


module.exports = router;