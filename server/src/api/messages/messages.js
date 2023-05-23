const express = require('express');
const router = express.Router();
const Message = require('../../db/models/Message');
const { isAuthenticated } = require('../../middleware/authenticated');
const Guild = require('../../db/models/Guild');

router.put('/:message_id', isAuthenticated, async (req, res) => {
  const { message_id } = req.params;
  const { content } = req.body;

  const message = await Message.findOne({
    _id: message_id,
  });

  if (!message)
    return res.status(404).json({ error: 'Message not found', status: 404 });
  if (message.author.toString() != req.user._id)
    return res.status(403).json({
      error: 'You are not allowed to edit this message',
      status: 403,
      slack: {
        author: message.author,
        user: req.user._id,
      },
    });

  message.content = content;
  message.edited = true;
  message.editedAt = Date.now();

  await message.save();

  return res.json({ data: message, status: 200 }).status(200);
});

router.delete('/:message_id', isAuthenticated, async (req, res) => {
  const { message_id } = req.params;

  const message = await Message.findOne({
    _id: message_id,
  }).populate('channel');

  const guild = await Guild.findOne({
    _id: message.channel.guild,
  });

  const isAuthor = message.author.toString() === req.user._id.toString();
  const isMod = guild.moderators
    .map((m) => m.toString())
    .includes(req.user._id.toString());
  const isOwner = guild.owner.toString() === req.user._id.toString();

  if (!isAuthor && !isMod & !isOwner) {
    return res.status(403).json({
      error: 'You are not allowed to delete this message',
      status: 403,
      slack: {
        isAuthor,
        isMod,
        isOwner,
      },
    });
  }
  await message.delete();
  return res.json({ message: 'Message has been deleted.', status: 200 });
});
module.exports = router;
