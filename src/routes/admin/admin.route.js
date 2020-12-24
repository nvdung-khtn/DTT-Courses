const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');


router.get('/', adminController.index);
router.get('/student',adminController.manageStudent)
router.get('/lecturer',adminController.manageLecturer)
router.get('/lecturer/edit/:id',adminController.editLecturer)
router.get('/product',adminController.manageProduct)
router.get('/product/edit/:id',adminController.editCourse)
router.get('/category',adminController.manageCategory)
router.get('/student/edit',adminController.editStudent)
router.get('/student/edit/:id',adminController.editStudent)

//router.post('/', loginController.login);


module.exports = router;