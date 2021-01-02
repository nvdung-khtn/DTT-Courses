const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');


router.get('/', adminController.index);

router.get('/product',adminController.manageProduct)
router.get('/product/edit/:id',adminController.editCourse)
router.get('/category',adminController.manageCategory)

router.get('/student',adminController.manageStudent)
router.get('/student/edit/:id',adminController.editStudent)
router.post('/student/edit/:id',adminController.updateStudent)
router.get('/student/delete/:id',adminController.deleteStudent)


router.get('/lecturer',adminController.manageLecturer)
router.get('/lecturer/edit/:id',adminController.editLecturer)
router.post('/lecturer/edit/:id',adminController.updateLecturer)
router.get('/lecturer/add',adminController.addViewLecturer)
router.post('/lecturer/add',adminController.addLecturer)

//router.post('/', loginController.login);


module.exports = router;