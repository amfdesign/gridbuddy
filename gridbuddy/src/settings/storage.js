// src/settings/storage.js

const fs = require('fs');
const path = require('path');

// Home Assistant persistiert hier die Add-on-Optionen
const OPTIONS_PATH = '/data/options.json';

// Persistent Storage für Device-Instanzen
const DEVICES_PATH = '/data/devices.json';

// Persistent Storage für Scheduler-Ergebnisse
const RESULTS_PATH = '/data/results.json';

function getGlobalConfig() {
  try {
    const raw = fs.readFileSync(OPTIONS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // Datei existiert nicht oder ungültig → leeres Objekt
    return {};
  }
}

function setGlobalConfig(cfg) {
  fs.writeFileSync(
    OPTIONS_PATH,
    JSON.stringify(cfg, null, 2),
    'utf8'
  );
}

function getDevices() {
  try {
    const raw = fs.readFileSync(DEVICES_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function addDevice(device) {
  const devices = getDevices();
  const id = Date.now().toString();
  const instance = { id, ...device };
  devices.push(instance);
  fs.writeFileSync(
    DEVICES_PATH,
    JSON.stringify(devices, null, 2),
    'utf8'
  );
  return instance;
}

function removeDevice(id) {
  const devices = getDevices();
  const filtered = devices.filter(d => d.id !== id);
  fs.writeFileSync(
    DEVICES_PATH,
    JSON.stringify(filtered, null, 2),
    'utf8'
  );
}

function saveResults(results) {
  fs.writeFileSync(
    RESULTS_PATH,
    JSON.stringify(results, null, 2),
    'utf8'
  );
}

function getResults() {
  try {
    const raw = fs.readFileSync(RESULTS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

module.exports = {
  getGlobalConfig,
  setGlobalConfig,
  getDevices,
  addDevice,
  removeDevice,
  saveResults,
  getResults
};
