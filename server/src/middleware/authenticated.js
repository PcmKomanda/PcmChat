const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return UnauthorizedError(res);
  if (!jwt.verify(token, JWT_SECRET)) return UnauthorizedError(res);
  const { id } = jwt.decode(token);
  const user = await User.findOne({
    where: {
      _id: id,
    },
  });
  console.log(user);
  if (!user || user.role !== 'admin') return UnauthorizedError(res);
  next();
};

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return UnauthorizedError(res);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return UnauthorizedError(res);
    }
  });

  const { id } = jwt.decode(token);
  const user = await User.findOne({
    _id: id,
  }).select(['-password']);
  console.log(user);
  if (!user) return UnauthorizedError(res);
  req.user = user;
  next();
};

function UnauthorizedError(res) {
  return res.status(401).json({ message: 'Unauthorized', status: 401 });
}

module.exports = {
  isAdmin,
  isAuthenticated,
};
