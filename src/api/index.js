const express = require('express');
const bodyParser = require('body-parser');
const deviceTypes = require('./deviceTypes');
const devicesApi = require('./devices');
const pluginsApi = require('./plugins');
const statusApi = require('./status');
const settingsApi = require('./settings');

const app = express();
app.use(bodyParser.json());

// Device-Type Definition
app.get('/api/device-types', deviceTypes);

// Device Instances CRUD
app.get('/api/devices', devicesApi.list);
app.post('/api/devices', devicesApi.create);
app.delete('/api/devices/:id', devicesApi.remove);

// Plugin Upload (Custom Device Modules)
app.post('/api/plugins', pluginsApi.upload);

// Aggregated Status Endpoint
app.get('/api/status', statusApi);

// Global Settings Endpoints
app.get('/api/settings', settingsApi.get);
app.post('/api/settings', settingsApi.update);

// Start Server
const port = 3000;
app.listen(port, () => console.log(`GridBuddy API listening on port ${port}`));
