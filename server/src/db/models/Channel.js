const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Channel = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['text'],
      default: 'text',
    },
    guild: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
      required: true,
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Channel', Channel);
