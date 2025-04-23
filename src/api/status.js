const scheduler = require('../core/scheduler');

module.exports = async (req, res) => {
  const status = await scheduler.getStatus();
  res.json(status);
};
