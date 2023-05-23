const router = require('express').Router();
const Guild = require('../db/models/Guild');
const User = require('../db/models/User');

const { isAdmin, isAuthenticated } = require('../middleware/authenticated');

router.get('/online', async (req, res) => {
  const online = await User.find({
    'status.online': true,
    'statis.last_seen': { $gt: Date.now() - 1000 * 60 * 5 },
  }).count();
  return res.json({ online, status: 200 }).status(200);
});

router.get('/me', isAuthenticated, async (req, res) => {
  return res.json(req.user);
});

router.get('/me/guilds', isAuthenticated, async (req, res) => {
  const guilds = await Guild.where({ members: req.user._id });
  return res.json(guilds);
});

router.post('/me/ping', isAuthenticated, async (req, res) => {
  try {
    if (!req.user._id) return;
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        status: {
          type: req.user.status.type,
          online: true,
          last_seen: Date.now(),
        },
      }
    );
    if (!user._id) return;
    res.status(200).json({ message: 'Pavyko', status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error }).status(400);
  }
});

router.put('/me/status', isAuthenticated, async (req, res) => {
  const { status } = req.body;
  if (!status)
    return res
      .json({ message: 'Nenurodytas statusas', status: 400 })
      .status(400);
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      'status.type': status,
      'status.online': true,
      'status.last_seen': Date.now(),
    }
  );
  return res.json({ message: 'Pavyko', status: 200 }).status(200);
});

router.get('/:id', isAdmin, async (req, res) => {
  try {
    const user = (await User.findOne({ _id: req.params.id })) || {};
    return res.json(user);
  } catch (error) {
    return res.json({ message: error });
  }
});

module.exports = router;
