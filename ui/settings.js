// Einfaches Tab-System & Fetch-Logik
const sections = ['status','devices','forecast','settings'];
sections.forEach(id => {
  document.getElementById(`tab-${id}`).onclick = () => {
    sections.forEach(s => document.getElementById(s).style.display = s===id? 'block':'none');
    loadSection(id);
  };
});

async function loadSection(id) {
  const el = document.getElementById(id);
  if (id === 'status') {
    const res = await fetch('/api/status');
    el.textContent = JSON.stringify(await res.json(), null, 2);
  } else if (id === 'devices') {
    const res = await fetch('/api/devices');
    el.textContent = JSON.stringify(await res.json(), null, 2);
  } else if (id === 'forecast') {
    const res = await fetch('/api/device-types');
    el.textContent = JSON.stringify(await res.json(), null, 2);
  } else if (id === 'settings') {
    // Lade aktuelle Optionen
    const opts = await fetch('/api/settings').then(r => r.json()).catch(() => ({}));
    el.innerHTML = `
      <form id="settings-form">
        <label>Battery Capacity (Wh): <input name="batteryCapacityWh" type="number" value="${opts.batteryCapacityWh||10000}"/></label><br/>
        <label>Charge Power (W): <input name="chargePowerW" type="number" value="${opts.chargePowerW||3000}"/></label><br/>
        <label>Discharge Power (W): <input name="dischargePowerW" type="number" value="${opts.dischargePowerW||3000}"/></label><br/>
        <label>Tibber API Token: <input name="tibberToken" type="text" value="${opts.tibberToken||''}"/></label><br/>
        <label>HA Long-Lived Token: <input name="haToken" type="text" value="${opts.haToken||''}"/></label><br/>
        <label>Ollama Server (IP:Port): <input name="ollamaServer" type="text" value="${opts.ollamaServer||''}"/></label><br/>
        <button type="submit">Speichern</button>
      </form>
    `;
    document.getElementById('settings-form').onsubmit = async e => {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form));
      await fetch('/api/settings', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      alert('Einstellungen gespeichert. Add-on neu starten, falls nötig.');
    };
  }
}

// Initial
loadSection('status');
