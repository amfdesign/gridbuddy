// src/api/settings.js

const storage = require('../settings/storage');

// Default-Konfiguration, nur für den ersten GET
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

// GET /api/settings
exports.get = (req, res) => {
  console.log('⚙️  API SETTINGS GET aufgerufen');
  let cfg = storage.getGlobalConfig();

  if (!cfg || Object.keys(cfg).length === 0) {
    console.log('  – Noch keine Konfiguration, speichere Defaults:', defaultConfig);
    storage.setGlobalConfig(defaultConfig);
    cfg = defaultConfig;
  }
  console.log('  – Gibt zurück:', cfg);
  res.json(cfg);
};

// POST /api/settings
exports.update = (req, res) => {
  console.log('⚙️  API SETTINGS UPDATE aufgerufen mit Body:', req.body);
  try {
    // 1) Alte Config auslesen
    const current = storage.getGlobalConfig();
    // 2) Neue Felder drüber–mappen (nur die im Form gesendeten)
    const merged  = { ...current, ...req.body };
    // 3) Gemeinsame Config abspeichern
    storage.setGlobalConfig(merged);
    console.log('  – Gespeichert, aktueller Inhalt:', storage.getGlobalConfig());
    return res.status(204).end();
  } catch (err) {
    console.error('  – Fehler beim Speichern:', err);
    return res.status(500).json({ error: err.message });
  }
};
