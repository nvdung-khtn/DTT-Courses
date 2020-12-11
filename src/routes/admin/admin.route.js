const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/AdminController');
const ManageUserController = require('../../controllers/admin/ManageUserController');
const ManageProductController = require('../../controllers/admin/ManageProductController');
const ManageCategoryController = require('../../controllers/admin/ManageCategoryController');
const LecturerController = require('../../controllers/admin/LecturerController');


router.get('/', adminController.index);
router.get('/users',ManageUserController.index)
router.get('/product',ManageProductController.index)
router.get('/category',ManageCategoryController.index)
router.get('/lecturer',LecturerController.index)

//router.post('/', loginController.login);


module.exports = router;