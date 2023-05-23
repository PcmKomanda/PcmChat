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
router.use('/messages', require('./messages/messages'));
router.use('/channels', require('./channels/channels'));

module.exports = router;
