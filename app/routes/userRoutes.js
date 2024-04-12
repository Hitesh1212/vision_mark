const express = require('express');

const {userProtect} = require('../middleware/auth');

const {
    Registration,
    Login,
    uploadImage,
} = require('../controller/user');

const router = express.Router();

router.post('/register', Registration);
router.post('/login', Login);
router.post('/upload-image', userProtect, uploadImage);


module.exports = router;