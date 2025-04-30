// src/api/settings.js

const storage = require('../settings/storage');

// Default-Werte aus den ENV-Variablen (geladen durch entrypoint.sh)
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
  minBatteryLevelPercent: process.env.GRIDBUDDY_MIN_BATTERY_LEVEL_PERCENT
    ? parseInt(process.env.GRIDBUDDY_MIN_BATTERY_LEVEL_PERCENT, 10)
    : 10,
  maxBatteryLevelPercent: process.env.GRIDBUDDY_MAX_BATTERY_LEVEL_PERCENT
    ? parseInt(process.env.GRIDBUDDY_MAX_BATTERY_LEVEL_PERCENT, 10)
    : 90,
  fixedPriceThresholdCents: process.env.GRIDBUDDY_FIXED_PRICE_THRESHOLD_CENTS
    ? parseFloat(process.env.GRIDBUDDY_FIXED_PRICE_THRESHOLD_CENTS)
    : 25,
  priceThresholdFactor: process.env.GRIDBUDDY_PRICE_THRESHOLD_FACTOR
    ? parseFloat(process.env.GRIDBUDDY_PRICE_THRESHOLD_FACTOR)
    : 0.5,
  highLoadFactor: process.env.GRIDBUDDY_HIGH_LOAD_FACTOR
    ? parseFloat(process.env.GRIDBUDDY_HIGH_LOAD_FACTOR)
    : 1.5,
  dynamicThresholdMode: process.env.GRIDBUDDY_DYNAMIC_THRESHOLD_MODE
    ? parseInt(process.env.GRIDBUDDY_DYNAMIC_THRESHOLD_MODE, 10)
    : 2,
  enableCalibration: process.env.GRIDBUDDY_ENABLE_CALIBRATION === 'true',
  tibberToken: process.env.GRIDBUDDY_TIBBER_TOKEN || '',
  ollamaServer: process.env.GRIDBUDDY_OLLAMA_SERVER || ''
};

// GET global settings
exports.get = (req, res) => {
  let cfg = storage.getGlobalConfig();

  // Beim ersten Mal: Defaults speichern
  if (!cfg || Object.keys(cfg).length === 0) {
    storage.setGlobalConfig(defaultConfig);
    cfg = defaultConfig;
  }

  res.json(cfg);
};

// POST update settings
exports.update = (req, res) => {
  const newCfg = req.body;
  storage.setGlobalConfig(newCfg);
  res.status(204).end();
};
