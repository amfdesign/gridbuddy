// src/modules/tibberPrice/index.js

/**
 * Dieses Modul holt den aktuellen Strompreis von Tibber
 * und speichert ihn über storage.saveResults({ priceCents })
 */

exports.initialize = async (config, storage) => {
  if (!config.tibberToken) {
    throw new Error('[tibberPrice] Kein Tibber-Token in der Config!');
  }
  console.log('[tibberPrice] Initialized with token…');
};

exports.run = async (devices, config, storage) => {
  console.log('[tibberPrice] Fetching current price from Tibber…');

  // GraphQL-Query
  const query = `
    {
      viewer {
        homes {
          currentSubscription {
            priceInfo {
              current {
                total
              }
            }
          }
        }
      }
    }
  `;

  // API-Aufruf
  const resp = await fetch('https://api.tibber.com/v1-beta/gql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.tibberToken}`
    },
    body: JSON.stringify({ query })
  });

  if (!resp.ok) {
    throw new Error(`[tibberPrice] HTTP ${resp.status}`);
  }

  const json = await resp.json();
  const total = json.data.viewer.homes[0]
    .currentSubscription.priceInfo.current.total;

  // total ist in Euro pro kWh, also in ct: *100
  const priceCents = Math.round(total * 100);
  console.log(`[tibberPrice] Aktueller Preis: ${priceCents} Cent`);

  // Schreibe in den Result-Storage
  storage.saveResults({ priceCents });
};
