const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Guild = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// On save hook, add guild to new member's guilds array
// Guild.post('save', async function (doc, next) {
//   const User = mongoose.model('User');
//   const members = await User.find({ _id: { $in: doc.members } });
//   members.forEach(async (member) => {
//     member.guilds.push(doc._id);
//     await member.save();
//   });
//   next();
// });

module.exports = mongoose.model('Guild', Guild);
