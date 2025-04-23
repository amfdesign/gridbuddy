const fs = require('fs');
const path = require('path');
const dataDir = path.resolve('/data/gridbuddy');
const devicesFile = path.join(dataDir, 'devices.json');
const resultsFile = path.join(dataDir, 'results.json');
const configFile = path.join(dataDir, 'config.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(devicesFile)) fs.writeFileSync(devicesFile, '[]');
  if (!fs.existsSync(resultsFile)) fs.writeFileSync(resultsFile, '[]');
  if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, JSON.stringify({}));
}

// Global Config
exports.getGlobalConfig = () => {
  ensureDir();
  return JSON.parse(fs.readFileSync(configFile));
};

// Set global options
exports.setGlobalConfig = (cfg) => {
  ensureDir();
  fs.writeFileSync(configFile, JSON.stringify(cfg, null, 2));
};

// Device Instances
exports.getDevices = () => {
  ensureDir();
  return JSON.parse(fs.readFileSync(devicesFile));
};

exports.addDevice = (device) => {
  const list = exports.getDevices();
  const id = Date.now().toString();
  const instance = { id, ...device };
  list.push(instance);
  fs.writeFileSync(devicesFile, JSON.stringify(list, null, 2));
  return instance;
};

exports.removeDevice = (id) => {
  let list = exports.getDevices();
  list = list.filter(d => d.id !== id);
  fs.writeFileSync(devicesFile, JSON.stringify(list, null, 2));
};

// Results
exports.saveResults = (results) => {
  ensureDir();
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
};

exports.getResults = () => {
  ensureDir();
  return JSON.parse(fs.readFileSync(resultsFile));
};
