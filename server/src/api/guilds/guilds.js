const router = require('express').Router();
const Guild = require('../../db/models/Guild');
const { isAuthenticated } = require('../../middleware/authenticated');
const isOwner = require('./middlewares/isOwner');
const loadGuild = require('./middlewares/loadGuild');

router.get('/', isAuthenticated, async (req, res) => {
  const guilds = await Guild.find();
  res.json(guilds);
});

router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const guild =
    (await Guild.findOne({ _id: id }).populate(
      'members',
      'display_name role avatar createdAt'
    )) || {};
  res.json(guild);
});

router.get('/:id/join', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const guild = await Guild.findOne({
    _id: id,
  });
  if (guild) {
    guild.members.push(req.user._id);
    await guild.save();
    res.json({ message: 'Successfuly joined!', guild }).status(200);
  } else {
    res.json({ error: 'Guild not found' }).status(404);
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  const { name, owner } = req.body;
  if (name === undefined || name == '')
    return res.json({ error: 'Name is invalid' }).status(400);
  if (owner === undefined || owner == '')
    return res.json({ error: 'Owner is invalid' }).status(400);

  const guild = await Guild.create({
    name: name,
    owner: owner,
  });

  res.json(guild).status(200);
});

// router.delete('/:id', loadGuild, isAuthenticated, isOwner, async (req, res) => {
//   const guild = await Guild.findOneAndDelete({
//     where: {
//       _id: req.guild._id,
//     },
//   });
//   console.log(guild);
//   if (guild) {
//     res.json({ guild }).status(200);
//   } else {
//     res.json({ error: 'Guild not found' }).status(404);
//   }
// });

module.exports = router;
