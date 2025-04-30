// src/core/scheduler.js

const cron = require('node-cron');
const { loadModules } = require('./loader');
const storage = require('../settings/storage');

// Lade alle Module aus src/modules
const modules = loadModules();

// Cron-Job: alle 5 Minuten (oder passe den Zeitplan nach Bedarf an)
cron.schedule('*/5 * * * *', async () => {
  console.log('🕒 Running GridBuddy scheduler...');
  await runAll();
});

// Die Run-Funktion, die alle Module ausführt
async function runAll() {
  const config = storage.getGlobalConfig();
  const devices = storage.getDevices();

  for (const { id, module } of modules) {
    console.log(`▶️  Starte Modul ${id}`);
    try {
      // Initialisierung nur beim ersten Lauf
      if (!module._initialized) {
        await module.initialize(config, storage);
        module._initialized = true;
      }
      // Lauf-Logik
      await module.run(devices, config, storage);
    } catch (e) {
      console.error(`❌ Fehler in Modul ${id}:`, e);
    }
  }

  // Ergebnisse (z.B. geänderte device.action) persistent speichern
  storage.saveResults(devices);
}

module.exports = { runAll };
