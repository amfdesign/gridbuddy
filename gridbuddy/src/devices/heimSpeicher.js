module.exports = {
  type: 'heimSpeicher',
  label: 'Heimspeicher',
  configSchema: [
    { key: 'batteryCapacityWh', label: 'Batteriekapazität (Wh)', type: 'number', default: 10000 },
    { key: 'chargePowerW',      label: 'Ladeleistung (W)',      type: 'number', default: 3000 },
    { key: 'dischargePowerW',   label: 'Entladeleistung (W)',   type: 'number', default: 3000 },
    { key: 'minLevelPercent',   label: 'Min. Ladezustand (%)',   type: 'number', default: 10 },
    { key: 'maxLevelPercent',   label: 'Max. Ladezustand (%)',   type: 'number', default: 90 }
  ],
  async run(cfg, globalCfg, { ha, tibber }) {
    // 1. Lade aktuellen Batteriezustand
    const state = await ha.fetchState(globalCfg.batteryEntity);
    const level = parseFloat(state.state);

    // 2. Hol Tibber-Preise
    const prices = await tibber.getPriceForecast(); // [{time, price}]
    const now = Date.now();
    // Finde günstigste Stunde
    const nextCheap = prices
      .filter(p => new Date(p.time).getTime() > now)
      .sort((a,b) => a.price - b.price)[0];
    
    // 3. Entscheidung
    let action;
    if (level < cfg.minLevelPercent) {
      action = { service: 'switch.turn_on', data: { entity_id: globalCfg.chargeSwitch } };
    } else if (level > cfg.maxLevelPercent) {
      action = { service: 'switch.turn_on', data: { entity_id: globalCfg.dischargeSwitch } };
    } else {
      // Ladeslot
      const start = new Date(nextCheap.time);
      action = { schedule: start };
    }

    return { level, action, nextCheap };
  }
};
