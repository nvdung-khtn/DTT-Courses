const express = require('express');
const router = express.Router();

const lecturerController = require('../../controllers/lecturer/LecturerController');



router.get('/', lecturerController.index);



module.exports = router;