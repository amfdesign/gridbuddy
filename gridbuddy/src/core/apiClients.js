// Home Assistant, Tibber und Ollama Client

const fetch = require('node-fetch');

// ——————————————————————————————
// Home Assistant REST-API
// ——————————————————————————————
const HA_BASE  = 'http://supervisor/core/api';
const HA_TOKEN = process.env.GRIDBUDDY_HA_TOKEN;

async function callService(domain, service, data) {
  const url = `${HA_BASE}/services/${domain}/${service}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HA_TOKEN}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify(data),
  });
}

async function fetchState(entity_id) {
  const url = `${HA_BASE}/states/${entity_id}`;
  const resp = await fetch(url, {
    headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
  });
  return resp.json();
}

// ——————————————————————————————
// Tibber GraphQL-API
// ——————————————————————————————
const TIBBER_API   = 'https://api.tibber.com/v1-beta/gql';
const TIBBER_TOKEN = process.env.GRIDBUDDY_TIBBER_TOKEN;

async function getPriceForecast() {
  const query = `
    query PriceInfo {
      viewer {
        homes {
          currentSubscription {
            priceInfo {
              today   { startsAt total }
              tomorrow{ startsAt total }
            }
          }
        }
      }
    }`;

  const resp = await fetch(TIBBER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TIBBER_TOKEN}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!resp.ok) throw new Error(`Tibber Error: ${resp.statusText}`);
  const { data } = await resp.json();
  const pi = data.viewer.homes[0].currentSubscription.priceInfo;
  // Kombiniere heute + morgen
  return [
    ...pi.today.map(p => ({ time: p.startsAt, price: p.total })),
    ...pi.tomorrow.map(p => ({ time: p.startsAt, price: p.total }))
  ];
}

// ——————————————————————————————
// Ollama-API (lokaler LLM-Server)
// ——————————————————————————————
const OLLAMA_SERVER = process.env.GRIDBUDDY_OLLAMA_SERVER; // z.B. "192.168.1.50:11434"

async function callOllama(model, prompt, options = {}) {
  if (!OLLAMA_SERVER) throw new Error('Ollama server not configured');
  const url = `http://${OLLAMA_SERVER}/v1/models/${model}/completions`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ...options }),
  });
  if (!resp.ok) throw new Error(`Ollama Error: ${resp.statusText}`);
  return resp.json();
}

// ——————————————————————————————
// Export
// ——————————————————————————————
module.exports = {
  ha: {
    callService,
    fetchState,
  },
  tibber: {
    getPriceForecast
  },
  ollama: {
    callOllama
  }
};
