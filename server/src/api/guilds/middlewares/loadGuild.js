const Guild = require('../../../db/models/Guild');
const loadGuild = async (req, res, next) => {
  console.log(req.params.id);
  const guild = await Guild.findById(req.params.id);
  if (!guild) return res.status(404).json({ message: 'Guild not found' });
  req.guild = guild;
  next();
};

module.exports = loadGuild;
