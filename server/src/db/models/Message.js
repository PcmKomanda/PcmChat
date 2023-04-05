const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema(
  {
    content: {
      type: String,
      required: true,
      min: 1,
      max: 1000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // channel: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Channel',
    //   required: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Message', Message);
