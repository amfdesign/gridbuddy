// src/settings/storage.js

const fs = require('fs');
const path = require('path');

// Home Assistant persistiert hier die add-on-Optionen
const OPTIONS_PATH = '/data/options.json';

function getGlobalConfig() {
  try {
    const raw = fs.readFileSync(OPTIONS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // Datei existiert nicht oder ist ungültig → leeres Objekt
    return {};
  }
}

function setGlobalConfig(cfg) {
  // Schreibe sauber formatiert
  fs.writeFileSync(
    OPTIONS_PATH,
    JSON.stringify(cfg, null, 2),
    'utf8'
  );
}

module.exports = {
  getGlobalConfig,
  setGlobalConfig
};
