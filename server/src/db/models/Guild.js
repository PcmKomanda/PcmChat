const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: false,
};

const Guild = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: reqStr,
    icon: reqStr,
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
    default_channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    invites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Invite',
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

Guild.pre('save', async function (next) {
  try {
    if (!this.icon) {
      this.icon = `https://api.dicebear.com/6.x/initials/svg?seed=${this.title}`;
    }
    next();
  } catch (error) {
    next();
  }
});

Guild.pre('remove', async function (next) {
  const User = mongoose.model('User');
  const members = await User.find({ _id: { $in: this.members } });
  members.forEach(async (member) => {
    member.guilds.pull(this._id);
    await member.save();
  });
  next();
});

module.exports = mongoose.model('Guild', Guild);
