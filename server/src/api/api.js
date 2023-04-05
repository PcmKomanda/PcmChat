const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'PcmChat API v1.0',
    health: res.statusCode == 200 ? 'OK' : 'ERROR',
  });
});

router.use('/users', require('./users'));
router.use('/guilds', require('./guilds/guilds'));
router.use('/auth', require('./auth/auth'));

module.exports = router;
