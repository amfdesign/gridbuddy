const cron = require('node-cron');
const storage = require('../settings/storage');
const devices = require('../devices');

// Placeholder für HA/Tibber-Clients
const apiClients = require('./apiClients');

async function runAll() {
  const globalConfig = storage.getGlobalConfig();
  const instances = storage.getDevices();
  const plugins = devices.getPlugins();
  const results = [];

  for (const inst of instances) {
    const plugin = plugins.find(p => p.type === inst.type);
    if (!plugin) continue;
    try {
      const result = await plugin.run(inst.config, globalConfig, apiClients);
      results.push({ id: inst.id, type: inst.type, result });
    } catch (err) {
      console.error(`Error running plugin ${inst.type}:`, err);
    }
  }

  storage.saveResults(results);
}

// Cron-Job alle 5 Minuten
cron.schedule('*/5 * * * *', () => {
  console.log('Running GridBuddy scheduler...');
  runAll();
});

exports.getStatus = async () => storage.getResults();
