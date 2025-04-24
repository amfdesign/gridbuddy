#!/bin/sh
# GridBuddy Entrypoint

# Load HA-Add-on Options
export GRIDBUDDY_BATTERY_CAPACITY_W="$OPTIONS_BATTERYCAPACITYWH"
export GRIDBUDDY_CHARGE_POWER_W="$OPTIONS_CHARGEPOWERW"
export GRIDBUDDY_DISCHARGE_POWER_W="$OPTIONS_DISCHARGEPWERW"
export GRIDBUDDY_TIBBER_TOKEN="$OPTIONS_TIBBERTOKEN"
export GRIDBUDDY_HA_TOKEN="$OPTIONS_HATOKEN"
export GRIDBUDDY_OLLAMA_SERVER="$OPTIONS_OLLAMASERVER"

# Dotenv
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Start Express-Server
node src/api/index.js
