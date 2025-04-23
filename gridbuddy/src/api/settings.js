const storage = require('../settings/storage');

// GET global settings
exports.get = (req, res) => {
  const cfg = storage.getGlobalConfig();
  res.json(cfg);
};

// POST update settings
exports.update = (req, res) => {
  const newCfg = req.body;
  storage.setGlobalConfig(newCfg);
  res.status(204).end();
};
