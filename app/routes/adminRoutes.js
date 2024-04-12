const express = require('express');

const {adminProtect} = require('../middleware/auth');

const {
    Registration,
    Login,
    updateStatus,
} = require('../controller/admin');

const router = express.Router();

router.post('/register', Registration);
router.post('/login', Login);
router.post('update-user-status', adminProtect, updateStatus);

module.exports = router;