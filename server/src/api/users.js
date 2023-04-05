const router = require('express').Router();
const Guild = require('../db/models/Guild');
const User = require('../db/models/User');

const { isAdmin, isAuthenticated } = require('../middleware/authenticated');

// TODO: Make that you need to be admin to see all users
router.get('/', isAdmin, async (req, res) => {
  const users = await User.find().select(['-password']);
  res.json(users);
});

router.get('/me', isAuthenticated, async (req, res) => {
  res.json(req.user);
});
router.get('/me/guilds', isAuthenticated, async (req, res) => {
  const guilds = await Guild.where({ members: req.user._id });
  res.json(guilds);
});

router.get('/:id', isAdmin, async (req, res) => {
  try {
    const user = (await User.findOne({ _id: req.params.id })) || {};
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});
module.exports = router;
