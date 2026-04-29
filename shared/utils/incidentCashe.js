const Incident = require('../../modules/incidents/IncidentModel');

const activeIncidents = {};

//load active incidents in case the server restarts
const loadActiveIncidents = async () => {
    const activeIncidentsFromDB = await Incident.find({ status: 'ACTIVE' });
    
    activeIncidentsFromDB.forEach(incident => {
        const sensorId = incident.source?.deviceId;
        const type = incident.type;
        if (sensorId && type) {
            addIncident(sensorId, type, incident._id);
        }
    });

    console.log(`✅ Loaded ${activeIncidentsFromDB.length} active incidents into cache`);
};

const getIncidentKey = (sensorId, type) => `${sensorId}_${type}`;

const hasActiveIncident = (sensorId, type) => {
    const key = getIncidentKey(sensorId, type);
    return !!activeIncidents[key];
};

const addIncident = (sensorId, type, incidentId) => {
    const key = getIncidentKey(sensorId, type);
    activeIncidents[key] = incidentId;
};

const removeIncident = (sensorId, type) => {
    const key = getIncidentKey(sensorId, type);
    delete activeIncidents[key];
};

const getIncidentId = (sensorId, type) => {
    const key = getIncidentKey(sensorId, type);
    return activeIncidents[key];
};

module.exports = { hasActiveIncident, addIncident, removeIncident, getIncidentId , loadActiveIncidents };