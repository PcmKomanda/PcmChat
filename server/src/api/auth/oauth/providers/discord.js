const { default: axios } = require('axios');
const express = require('express');
const qs = require('qs');
const router = express.Router();
const User = require('../../../../db/models/User');
const jwt = require('jsonwebtoken');
const {
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URL,
  DISCORD_CLIENT_SECRET,
  JWT_SECRET,
} = process.env;

router.get('/', (req, res) => {
  console.log('Discord login');
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URL}&response_type=code&scope=identify%20email`
  );
});

router.get('/callback', async (req, res, next) => {
  const { code } = req.query;
  if (code === undefined || code == '') {
    return res.json({ error: 'Code is invalid' }).status(400);
  }

  const access_token = await GetAccessToken(code);

  // if (access_token === undefined || access_token == '') return;
  // res.json({ error: 'Code is invalid' }).status(400);
  const user = await GetUserInfo(access_token);
  // if (!user?.id) return res.json({ error: 'Code is invalid' }).status(400);
  const token = await LoginToUser(user);

  res.json(token).status(token.status);
});

async function GetAccessToken(code) {
  return await axios
    .post(
      `https://discord.com/api/oauth2/token`,
      qs.stringify({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: DISCORD_REDIRECT_URL,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'gzip,deflate,compress',
        },
      }
    )
    .then((r) => r.data.access_token)
    .catch(() => {});
}

async function GetUserInfo(access_token) {
  return await axios
    .get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    })
    .then((r) => r.data)
    .catch(() => {});
}

async function LoginToUser(user) {
  const userFromDB = await User.findOne({
    provider_id: user.id,
    provider: 'discord',
  });

  if (userFromDB) {
    if (userFromDB.avatar !== user.avatar) {
      userFromDB.avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
        : 'https://animesub.lt/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg';
      await userFromDB.save();
    }
    const token = jwt.sign({ id: userFromDB._id }, JWT_SECRET, {
      expiresIn: '24h',
    });
    return { token, status: 200 };
  }
  const newUser = await User.create({
    provider_id: user.id,
    provider: 'discord',
    email: user.email,
    display_name: user.username,
    avatar: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : 'https://animesub.lt/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg',
  }).catch((err) => console.log(err));
  if (!newUser) return { error: 'Register Failed.', status: 400 };
  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: '24h',
  });
  return { token, status: 200 };
}

module.exports = router;
