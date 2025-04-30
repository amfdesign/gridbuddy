// src/api/settings.js

const fs = require('fs');
const path = require('path');

// Hier liegt Home Assistant die persistente Optionen-Datei ab:
const OPTIONS_PATH = '/data/options.json';

// GET /api/settings
exports.get = (req, res) => {
  try {
    // Datei einlesen
    const raw = fs.readFileSync(OPTIONS_PATH, 'utf8');
    const cfg = JSON.parse(raw);
    return res.json(cfg);
  } catch (err) {
    // Falls noch keine Datei da ist: leeres Objekt zurückgeben
    return res.json({});
  }
};

// POST /api/settings
exports.update = (req, res) => {
  try {
    // Body (JSON) direkt in OPTIONS_PATH schreiben
    fs.writeFileSync(
      OPTIONS_PATH,
      JSON.stringify(req.body, null, 2),
      'utf8'
    );
    return res.status(204).end();
  } catch (err) {
    console.error('Fehler beim Speichern der Einstellungen:', err);
    return res.status(500).json({ error: err.message });
  }
};
