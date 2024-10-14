const express = require("express");
const router = express.Router();
const Channel = require("../../db/models/Channel");
const { isAuthenticated } = require("../../middleware/authenticated");
const Message = require("../../db/models/Message");

router.get(`/:channel_id`, isAuthenticated, async (req, res) => {
  const { channel_id } = req.params;

  if (channel_id == "undefined") return;

  const channel = await Channel.findOne({ _id: channel_id });

  if (!channel) return res.status(404).json({ error: "Kanalas nerastas" });

  return res.status(200).json({ data: channel, status: 200 });
});

router.get("/:channel_id/messages", isAuthenticated, async (req, res) => {
  const { channel_id } = req.params;
  let { limit, page, date } = req.query;
  limit = parseInt(limit) || 500;
  page = parseInt(page) || 1;
  skip = limit * (page - 1);
  try {
    const messages = await Message.find({
      channel: channel_id,
      createdAt: { $lte: date },
    })
      .populate("author", "_id display_name avatar color")
      .limit(limit)
      .skip(skip * page)
      .sort({ createdAt: 1 });

    const count = await Message.find({ channel: channel_id }).countDocuments();
    res.status(200).json({
      pagination: {
        total_messages: count,
        limit,
        skip,
        page,
        total_pages: Math.ceil(count / limit),
      },
      data: messages,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:channel_id/messages", isAuthenticated, async (req, res) => {
  const { channel_id } = req.params;
  const { content } = req.body;

  const message = await Message.create({
    content: content,
    channel: channel_id,
    author: req.user._id,
  });

  return res.status(200).json({ data: message, status: 200 });
});

router.put("/:channel_id", isAuthenticated, async (req, res) => {
  const { channel_id } = req.params;
  const { title, privacy } = req.body;

  const channel = await Channel.findOneAndUpdate(
    {
      _id: channel_id,
    },
    {
      title: title || undefined,
      privacy: privacy || undefined,
    },
    {
      new: true,
    }
  );

  if (!channel) return res.status(404).json({ error: "Kanalas nerastas" });

  return res.status(200).json({ data: channel, status: 200 });
});

router.delete("/:channel_id", isAuthenticated, async (req, res) => {
  const { channel_id } = req.params;

  await Message.deleteMany({
    channel: channel_id,
  });

  const channel = await Channel.findOneAndDelete({
    _id: channel_id,
  });

  if (!channel) return res.status(404).json({ error: "Kanalas nerastas" });

  return res
    .status(200)
    .json({ message: "Kanalas sėkmingai ištrintas.", status: 200 });
});

module.exports = router;
