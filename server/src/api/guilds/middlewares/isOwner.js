function isOwner(req, res, next) {
  if (req.guild.owner == req.user.id || req.user.role == 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden', status: 403 });
  }
}

module.exports = isOwner;
