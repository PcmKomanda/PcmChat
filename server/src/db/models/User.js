const mongoose = require('mongoose');

const StrReq = {
  type: String,
  required: true,
};

const User = new mongoose.Schema(
  {
    provider_id: StrReq,
    display_name: {
      ...StrReq,
    },
    discriminator: String,
    password: String,
    email: {
      type: String,
    },
    avatar: String,
    role: {
      ...StrReq,
      default: 'user',
      enum: ['user', 'admin'],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    provider: {
      ...StrReq,
      enum: ['local', 'google', 'discord', 'github'],
    },
    // when user is in guild, it will be added to guilds array
    guilds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// User schema generate unique random discriminator to display_name between 0001 and 9999
// User.pre('save', async function (next) {
//   if (this.discriminator) return next();
//   const tries = 1000;
//   while (tries > 0) {
//     const discriminator = getDiscriminator();
//     const user = await this.model('User').findOne({
//       tag: `${this.display_name}#${discriminator}`,
//     });
//     if (!user) {
//       this.discriminator = discriminator;
//       this.tag = `${this.display_name}#${discriminator}`;
//       break;
//     }
//     tries--;
//   }

//   next();
// });

// const getDiscriminator = () => {
//   return Math.floor(Math.random() * 9999)
//     .toString()
//     .padStart(4, '0');
// };

module.exports = mongoose.model('User', User);
