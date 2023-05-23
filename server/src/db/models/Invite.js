const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Invite = new Schema(
  {
    guild: {
      type: Schema.Types.ObjectId,
      ref: 'Guild',
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    uses: {
      type: Number,
      default: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Invite', Invite);
