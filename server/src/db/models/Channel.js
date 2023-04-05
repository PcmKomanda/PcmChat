const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Channel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    guild: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Channel', Channel);
