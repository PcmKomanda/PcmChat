const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DM = new Schema(
  {
    user_1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user_2: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

module.exports = mongoose.model('DM', DM);
