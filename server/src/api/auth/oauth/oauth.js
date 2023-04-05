const express = require('express');
const router = express.Router();
// const User = require('../../db/models/User');
const jwt = require('jsonwebtoken');

router.use('/discord', require('./providers/discord'));
router.use('/github', require('./providers/github'));

module.exports = router;
