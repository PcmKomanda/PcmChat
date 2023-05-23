const express = require('express');
const router = express.Router();
const Message = require('../../db/models/Message');
const { isAuthenticated } = require('../../middleware/authenticated');

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
  });

  if (!message)
    return res.status(404).json({ error: 'Message not found', status: 404 });
  if (message.author.toString() != req.user._id.toString())
    return res.status(403).json({
      error: 'You are not allowed to delete this message',
      status: 403,
      slack: {
        author: message.author,
        user: req.user._id,
        boolean: message.author.toString() != req.user._id.toString(),
      },
    });
  await message.delete();
  return res.json({ message: 'Message has been deleted.', status: 200 });
});
module.exports = router;
