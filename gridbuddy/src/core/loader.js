// src/core/loader.js

const fs = require('fs');
const path = require('path');

/**
 * Lädt alle Module aus src/modules und sorgt dafür,
 * dass tibberPrice als Erstes ausgeführt wird.
 */
function loadModules() {
  const modulesDir = path.join(__dirname, '..', 'modules');
  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  const loaded = [];

  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;
    const modPath = path.join(modulesDir, dirent.name);
    const manifestPath = path.join(modPath, 'manifest.json');
    const indexPath = path.join(modPath, 'index.js');

    if (fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const mod = require(indexPath);
      loaded.push({ id: manifest.id || dirent.name, manifest, module: mod });
      console.log(`✅ Modul geladen: ${manifest.id || dirent.name}`);
    }
  }

  // tibberPrice immer zuerst ausführen
  loaded.sort((a, b) => {
    if (a.id === 'tibberPrice' && b.id !== 'tibberPrice') return -1;
    if (b.id === 'tibberPrice' && a.id !== 'tibberPrice') return 1;
    return 0;
  });

  return loaded;
}

module.exports = { loadModules };
