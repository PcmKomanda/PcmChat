const router = require('express').Router();
const Guild = require('../../db/models/Guild');
const { isAuthenticated } = require('../../middleware/authenticated');

const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const multer = require('multer');
const Channel = require('../../db/models/Channel');
const Invite = require('../../db/models/Invite');
const User = require('../../db/models/User');
const crypto = require('crypto');
const Message = require('../../db/models/Message');

const upload = multer({
  storage: multer.memoryStorage(),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/', isAuthenticated, async (req, res) => {
  const guilds = await Guild.find();
  res.json({ data: guilds, status: 200 }).status(200);
});

router.get('/:guild_id', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;
  try {
    let guild =
      (await Guild.findOne({ _id: guild_id })
        .populate('members', 'display_name role avatar createdAt status.type')
        .populate('channels')
        .populate('moderators', '_id display_name')) || {};

    return res.json({ data: guild, status: 200 }).status(200);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      message: 'Įvyko klaida',
      data: {
        _id: null,
        title: null,
        icon: null,
        owner: null,
        created_at: null,
      },
      status: 500,
    });
  }
});

router.get('/:guild_id/members', async (req, res) => {
  try {
    const { guild_id } = req.params;

    let { members } = await Guild.findOne({ _id: guild_id }).populate(
      'members'
    );

    members = await members.map((member) => {
      return {
        _id: member._id,
        display_name: member.display_name,
        avatar: member.avatar,
        role: member.role,
        createdAt: member.createdAt,
        status: {
          type:
            new Date(member.status.last_seen) - Date.now() > -30000
              ? member.status.type
              : 'offline',
          last_seen: member.status.last_seen,
          diff: new Date(member.status.last_seen) - Date.now(),
        },
      };
    });

    return res.json({ data: members, status: 200 }).status(200);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:guild_id/channels', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;

  const channels = await Channel.find({ guild: guild_id });

  return res.json({ data: channels, status: 200 }).status(200);
});

router.post('/:guild_id/channels', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;
  const { title, type, privacy } = req.body;

  const channel = await Channel.create({
    title,
    guild: guild_id,
    type,
    privacy,
  });

  await Guild.findOneAndUpdate(
    { _id: guild_id },
    { $push: { channels: channel._id } }
  );

  return res.json({ data: channel, status: 200 }).status(200);
});

// router.post('/:guild_id', isAuthenticated, async (req, res) => {
//   const { guild_id } = req.params;
//   const { name } = req.body;

//   const channel = await Channel.create({
//     name: name,
//     guild: guild_id,
//   });

//   return res.json({ data: channel, status: 200 }).status(200);
// });

router.put('/:guild_id', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;
  const { title, icon, owner, privacy } = req.body;
  const guild = await Guild.findOne({ _id: guild_id });
  if (!guild) return res.json({ error: 'Gildija nerasta' }).status(404);
  if (!guild.owner.toString() == req.user._id || !req.user.role == 'admin')
    return res.status(403).json({ message: 'Neturite teisių', status: 403 });

  guild.title = title || guild.title;
  guild.icon = icon || guild.icon;
  guild.owner = owner || guild.owner;
  guild.privacy = privacy || guild.privacy;
  await guild.save();
  return res.json({ data: guild, status: 200 }).status(200);
});

router.put('/:guild_id/icon', upload.single('icon'), async (req, res) => {
  const { guild_id } = req.params;
  const file = req.file;
  try {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'guilds',
        filename_override: guild_id,
        public_id: guild_id,
        format: 'webp',
        width: 256,
        height: 256,
        crop: 'fill',
      },
      async (err, result) => {
        if (err) return res.json({ message: err, status: 500 }).status(500);

        await Guild.findOneAndUpdate(
          { _id: guild_id },
          { icon: result.url },
          { new: true }
        );
        return res.send(result);
      }
    );

    const str = Readable.from(file.buffer);
    str.pipe(cld_upload_stream);
  } catch (error) {
    return res.json({ message: error.message, status: 500 }).status(500);
  }
});

router.put('/:guild_id/join', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;
  const guild = await Guild.findOne({
    _id: guild_id,
  });
  if (guild) {
    guild.members.push(req.user._id);
    await guild.save();
    res
      .json({ message: 'Sėkmingai prisijungta!', guild, status: 200 })
      .status(200);
  } else {
    res.json({ error: 'Gildija nerasta', status: 404 }).status(404);
  }
});

router.post('/join', isAuthenticated, async (req, res) => {
  const { code } = req.body;
  const invite = await Invite.findOne({ code });
  if (!invite)
    return res.status(404).json({ error: 'Pakvietimas nerastas', status: 404 });

  const isMember = (
    await Guild.findOne({
      _id: invite.guild,
    }).populate('members')
  ).members.find((member) => member._id.toString() == req.user._id.toString());

  if (isMember)
    return res.status(403).json({
      error: 'Jau esate prisijungęs prie šios gildijos.',
      status: 403,
    });

  const guild = await Guild.findOneAndUpdate(
    { _id: invite.guild },
    { $push: { members: req.user._id } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { guilds: guild._id } }
  );

  return res.json({ message: 'Sėkmingai prisijungta!', guild, status: 200 });
});

router.post('/:guild_id/invite', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;

  // gen random unique code for invite and push to guild invites list
  const code = crypto.randomBytes(4).toString('hex');

  // create new invite, but if code is duplicate, try again until code is unique
  const invite = await Invite.create({
    guild: guild_id,
    code,
    created_by: req.user._id,
  });

  let guild = await Guild.findOneAndUpdate(
    { _id: guild_id },
    {
      $push: {
        invites: invite,
      },
    },
    { new: true }
  ).populate('invites');

  guild.invites = guild.invites.reverse();

  return res.json({ data: guild.invites[0], status: 200 }).status(200);
});

router.put('/:guild_id/leave', isAuthenticated, async (req, res) => {
  const { guild_id } = req.params;
  const guild = await Guild.findOne({
    _id: guild_id,
  });
  if (guild) {
    guild.members.pull(req.user._id);
    await guild.save();
    res.json({ message: 'Successfuly left!', guild, status: 200 }).status(200);
  } else {
    res.json({ error: 'Guild not found', status: 404 }).status(404);
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, privacy } = req.body;
    if (title === undefined || title == '')
      return res.json({ error: 'Nėra pavadinimo' }).status(400);

    const guild = await Guild.create({
      title,
      owner: req.user._id,
      privacy,
    });

    const channel = await Channel.create({
      title: 'Pagrindinis',
      guild: guild._id,
      type: 'text',
    });

    guild.channels.push(channel._id);
    guild.members.push(req.user._id);
    guild.moderators.push(req.user._id);
    guild.default_channel = channel._id;

    await guild.save();

    return res.json({ data: guild, status: 200 }).status(200);
  } catch (error) {
    return res.status(500).json({ error: error.message, status: 500 });
  }
});

router.delete('/:guild_id', isAuthenticated, async (req, res) => {
  const guild = await Guild.findOne({
    _id: req.params.guild_id,
  });
  if (!guild) return res.json({ error: 'Guild not found' }).status(404);
  if (!guild.owner.toString() == req.user._id || !req.user.role == 'admin')
    return res.status(403).json({ message: 'Forbidden', status: 403 });

  await Channel.deleteMany({ guild: guild._id });
  await Message.deleteMany({ guild: guild._id });
  await Invite.deleteMany({ guild: guild._id });

  await User.updateMany(
    { guilds: guild._id },
    { $pull: { guilds: guild._id } }
  );

  await guild.deleteOne();

  return res.json({ guild }).status(200);
});

module.exports = router;
