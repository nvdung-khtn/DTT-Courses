const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');
const ManageStudentController = require('../../controllers/admin/ManageStudentController');
const ManageLecturerController = require('../../controllers/admin/ManageLecturerController.js');
const ManageProductController = require('../../controllers/admin/ManageProductController');
const ManageCategoryController = require('../../controllers/admin/ManageCategoryController');


router.get('/', adminController.index);
router.get('/student',ManageStudentController.index)
router.get('/lecturer',ManageLecturerController.index)
router.get('/product',ManageProductController.index)
router.get('/category',ManageCategoryController.index)

//router.post('/', loginController.login);


module.exports = router;