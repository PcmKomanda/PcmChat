const express = require('express');
const router = express.Router();
const User = require('../../../../db/models/User');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const JWT_SECRET = process.env.JWT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

router.get('/', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });
  return res.redirect(url);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (code === undefined || code == '') {
    res.json({ error: 'Code is invalid' }).status(400);
    return;
  }

  const access_token = await GetAccessToken(code);
  if (access_token === undefined || access_token == '') return;

  const user_data = await GetUserData(access_token);

  const token = await LoginToUser(user_data);
  return res.json(token).status(token.status);
});

async function GetAccessToken(code) {
  const access_token = await oauth2Client.getToken(code).then((r) => {
    return r.tokens.access_token;
  });

  await oauth2Client.setCredentials({
    access_token: access_token,
  });

  return access_token;
}

async function GetUserData() {
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });
  return await oauth2.userinfo.get().then((r) => {
    return r.data;
  });
}

async function LoginToUser(user) {
  // console.log(user);
  const userFromDB = await User.findOne({
    provider_id: String(user.id),
    provider: 'google',
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
    provider: 'google',
    email: user.email,
    display_name: user.name,
    avatar: user.picture,
  }).catch((err) => console.log(err));
  if (!newUser) return { error: 'Register Failed.', status: 400 };
  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: '24h',
  });
  return { token, status: 200 };
}

module.exports = router;

module.exports = router;
