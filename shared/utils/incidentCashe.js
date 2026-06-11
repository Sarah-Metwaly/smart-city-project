const Incident = require('../../modules/incidents/IncidentModel');

const activeIncidents = {};
const aiCachedData = {};

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Load active incidents in case the server restarts
const loadActiveIncidents = async () => {
    const activeIncidentsFromDB = await Incident.find({ status: 'ACTIVE' });
    
    activeIncidentsFromDB.forEach(incident => {
        // FIX #1: Check both deviceId and sensorId for compatibility with both AI and sensor sources
        const deviceId = incident.source?.deviceId || incident.source?.sensorId;
        const type = incident.type;
        if (deviceId && type) {
            addIncident(deviceId, type, incident._id.toString());
        }
    });

    console.log(`✅ Loaded ${activeIncidentsFromDB.length} active incidents into cache`);
};

const getIncidentKey = (deviceId, type) => `${deviceId}_${type}`;

const hasActiveIncident = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    return !!activeIncidents[key];
};

const addIncident = (deviceId, type, incidentId) => {
    const key = getIncidentKey(deviceId, type);
    activeIncidents[key] = incidentId.toString();
};

const removeIncident = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    const incidentId = activeIncidents[key];
    delete activeIncidents[key];
    // FIX #7: Clean up aiCachedData to prevent memory leaks
    if (incidentId) {
        delete aiCachedData[incidentId];
    }
};

const getIncidentId = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    return activeIncidents[key];
};

// FIX #3: Removed unnecessary async
const addAiCachedData = (deviceId, type, aiData) => {
    const key = getIncidentKey(deviceId, type);
    const incidentId = activeIncidents[key];
    if (incidentId) {
        aiCachedData[incidentId] = aiData;
    }
};

// FIX #2: Returns true if data changed, false otherwise
const checkAiCachedData = (deviceId, type, aiData) => {
    const key = getIncidentKey(deviceId, type);
    const incidentId = activeIncidents[key];
    if (!incidentId) return false;
    
    if (isEqual(aiCachedData[incidentId], aiData)) {
        return false; // No change
    } else {
        aiCachedData[incidentId] = aiData;
        return true; // Data changed
    }
};

// FIX #4: Added pending incidents tracking to prevent duplicate processing -Race condition-
const pendingIncidents = new Set();

const isPending = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    return pendingIncidents.has(key);
};

const addPending = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    pendingIncidents.add(key);
};

const removePending = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    pendingIncidents.delete(key);
};

module.exports = {
    activeIncidents,
    hasActiveIncident,
    getIncidentKey,
    addIncident,
    removeIncident,
    getIncidentId,
    loadActiveIncidents,
    addAiCachedData,
    checkAiCachedData,
    isPending,
    addPending,
    removePending
};