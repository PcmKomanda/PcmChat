const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const User = require('../../../../db/models/User');
const jwt = require('jsonwebtoken');
const {
  GITHUB_CLIENT_ID,
  GITHUB_REDIRECT_URL,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET,
} = process.env;

router.get('/', async (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URL}&response_type=code&scope=user:email,read:user`
  );
});

router.get('/callback', async (req, res, next) => {
  const { code } = req.query;
  if (code === undefined || code == '') {
    res.json({ error: 'Code is invalid' }).status(400);
    return;
  }

  const access_token = await GetAccessToken(code);
  if (access_token === undefined || access_token == '') return;

  const user_data = await GetUserData(access_token);

  const token = await LoginToUser(user_data);
  res.json(token).status(token.status);
});

async function GetAccessToken(code) {
  return await axios
    .post(
      `https://github.com/login/oauth/access_token`,
      qs.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: GITHUB_REDIRECT_URL,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/json',
        },
      }
    )
    .then((r) => qs.parse(r.data).access_token)
    .catch(() => {});
}

async function GetUserData(access_token) {
  return await axios
    .get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((r) => r.data);
}

async function LoginToUser(user) {
  // console.log(user);
  const userFromDB = await User.findOne({
    provider_id: String(user.id),
    provider: 'github',
  }).catch((err) => console.log(err));
  if (userFromDB) {
    console.log(userFromDB);
    const token = jwt.sign({ id: userFromDB._id }, JWT_SECRET, {
      expiresIn: '24h',
    });
    return { token, status: 200 };
  }
  const newUser = await User.create({
    provider_id: String(user.id),
    provider: 'github',
    email: user.email,
    display_name: user.login,
    avatar: user.avatar_url,
  }).catch((err) => console.log(err));
  if (!newUser) return { error: 'Register Failed.', status: 400 };
  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: '24h',
  });
  return { token, status: 200 };
}

module.exports = router;
