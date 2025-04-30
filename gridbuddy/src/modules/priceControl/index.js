// src/modules/priceControl/index.js

let threshold;

exports.initialize = async (config, storage) => {
  threshold = config.fixedPriceThresholdCents;
  console.log(`  [priceControl] Schwelle gesetzt auf ${threshold} Cent`);
};

exports.run = async (devices, config, storage) => {
  // Beispiel: wir erwarten, dass storage.getResults() aktuellen Preis liefert
  const lastResults = storage.getResults();
  const currentPrice = lastResults.priceCents;
  console.log(`[priceControl] Aktueller Preis: ${currentPrice} Cent`);

  // Auf jedes Device anwenden
  devices.forEach(device => {
    if (currentPrice < threshold) {
      device.action = 'charge';
    } else if (currentPrice > threshold) {
      device.action = 'discharge';
    } else {
      device.action = 'idle';
    }
  });
};
