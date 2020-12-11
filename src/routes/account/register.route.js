const express = require('express');
const router = express.Router();

const registerController = require('../../controllers/account/registerController');

router.get('/', registerController.index);
//router.post('/', registerController.register);

router.get('/confirm', (req, res)=>{
    res.render('vwAccount/confirmregister', {
        layout: false,
    });
})

module.exports = router;