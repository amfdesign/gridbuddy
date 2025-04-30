// src/api/settings.js

const storage = require('../settings/storage');

// Default-Werte aus ENV (geladen von entrypoint.sh) oder harte Fallback-Literale
const defaultConfig = {
  batteryCapacityWh: process.env.GRIDBUDDY_BATTERY_CAPACITY_W
    ? parseFloat(process.env.GRIDBUDDY_BATTERY_CAPACITY_W)
    : 4000,
  chargePowerW: process.env.GRIDBUDDY_CHARGE_POWER_W
    ? parseFloat(process.env.GRIDBUDDY_CHARGE_POWER_W)
    : 800,
  dischargePowerW: process.env.GRIDBUDDY_DISCHARGE_POWER_W
    ? parseFloat(process.env.GRIDBUDDY_DISCHARGE_POWER_W)
    : 1000,
  minBatteryLevelPercent: 10,
  maxBatteryLevelPercent: 90,
  fixedPriceThresholdCents: 25,
  priceThresholdFactor: 0.5,
  highLoadFactor: 1.5,
  dynamicThresholdMode: 2,
  enableCalibration: false,
  tibberToken: process.env.GRIDBUDDY_TIBBER_TOKEN || '',
  ollamaServer: process.env.GRIDBUDDY_OLLAMA_SERVER || ''
};

exports.get = (req, res) => {
  let cfg = storage.getGlobalConfig();

  // Beim ersten Mal: Default-Werte persistieren und zurückgeben
  if (!cfg || Object.keys(cfg).length === 0) {
    storage.setGlobalConfig(defaultConfig);
    cfg = defaultConfig;
  }

  res.json(cfg);
};

exports.update = (req, res) => {
  const newCfg = req.body;
  storage.setGlobalConfig(newCfg);
  res.status(204).end();
};
