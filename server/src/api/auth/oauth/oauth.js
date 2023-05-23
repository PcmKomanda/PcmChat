const express = require('express');
const router = express.Router();

router.use('/discord', require('./providers/discord'));
router.use('/github', require('./providers/github'));
router.use('/google', require('./providers/google'));

module.exports = router;
