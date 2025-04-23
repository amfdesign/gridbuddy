const storage = require('../settings/storage');

exports.list = (req, res) => {
  res.json(storage.getDevices());
};

exports.create = (req, res) => {
  const instance = storage.addDevice(req.body);
  res.status(201).json(instance);
};

exports.remove = (req, res) => {
  storage.removeDevice(req.params.id);
  res.status(204).end();
};
