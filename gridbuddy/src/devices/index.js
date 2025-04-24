const fs = require('fs');
const path = require('path');

// Built-in Plugins
const builtIn = fs.readdirSync(__dirname)
  .filter(f => f !== 'index.js')
  .map(f => require(path.join(__dirname, f)));

// Custom Plugins (from /data/devices)
let custom = [];
const loadCustom = () => {
  const dir = path.resolve('/data/devices');
  if (fs.existsSync(dir)) {
    custom = fs.readdirSync(dir)
      .filter(f => f.endsWith('.js'))
      .map(f => require(path.join(dir, f)));
  }
};
loadCustom();

module.exports = {
  getTypes: () => [...builtIn, ...custom].map(p => ({ type: p.type, label: p.label, configSchema: p.configSchema })),
  getPlugins: () => [...builtIn, ...custom]
};
