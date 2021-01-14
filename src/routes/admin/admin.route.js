const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');


router.get('/', adminController.index);

router.get('/course',adminController.manageCourse)
router.get('/course/edit/:id',adminController.editCourse)
router.post('/course/edit/:id',adminController.updateCourse)
router.get('/course/delete/:id',adminController.deleteCourse)


router.get('/field',adminController.manageField)
router.get('/field/edit/:id',adminController.editField)
router.post('/field/edit/:id',adminController.updateField)
router.get('/field/delete/:id',adminController.deleteField)


router.get('/student',adminController.manageStudent)
router.get('/student/edit/:id',adminController.editStudent)
router.post('/student/edit/:id',adminController.updateStudent)
router.get('/student/delete/:id',adminController.deleteStudent)


router.get('/lecturer',adminController.manageLecturer)
router.get('/lecturer/edit/:id',adminController.editLecturer)
router.post('/lecturer/edit/:id',adminController.updateLecturer)
router.get('/lecturer/delete/:id',adminController.deleteLecturer)
router.get('/lecturer/add',adminController.addViewLecturer)
router.post('/lecturer/add',adminController.addLecturer)

//router.post('/', loginController.login);


module.exports = router;