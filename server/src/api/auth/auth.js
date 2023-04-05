const express = require('express');
const router = express.Router();
const User = require('../../db/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use('/', require('./oauth/oauth'));

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (name === undefined || name == '')
    return res.json({ error: 'Name is invalid' }).status(400);
  if (email === undefined || email == '')
    return res.json({ error: 'Email is invalid' }).status(400);
  if (password === undefined || password == '')
    return res.json({ error: 'Password is invalid' }).status(400);

  const emailExists = await User.findOne({
    where: {
      email: email,
    },
  });
  if (emailExists !== null)
    return res.json({ error: 'User already exists' }).status(400);
  const nameExists = await User.findOne({
    where: {
      login_name: name,
    },
  });
  if (nameExists !== null)
    return res.json({ error: 'User already exists' }).status(400);

  const hash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name,
    email: email,
    password: hash,
    avatar: `https://avatars.dicebear.com/api/croodles-neutral/${name}.png`,
  });

  const token = jwt.sign(
    {
      id: newUser.id,
    },
    process.env.JWT_SECRET
  );

  res.json({ token: token }).status(200);
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  if (name === undefined || name == '')
    return res.json({ error: 'Name is invalid' }).status(400);
  if (password === undefined || password == '')
    return res.json({ error: 'Password is invalid' }).status(400);

  const user = await User.findOne({
    where: {
      login_name: name,
    },
  });

  if (user === null)
    return res
      .json({ error: 'Login name or password is incorrect' })
      .status(400);

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .json({ error: 'Login name or password is incorrect' })
      .status(400);

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  res.json({ token: token }).status(200);
});

// TODO: /auth/remember
router.post('/remember', async (req, res) => {});

module.exports = router;
