const pluginLoader = require('../devices');

module.exports = (req, res) => {
  const types = pluginLoader.getTypes();
  res.json(types);
};
