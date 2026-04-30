const Incident = require('../../modules/incidents/IncidentModel');

const activeIncidents = {};
const aiCachedData ={};

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

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

const getIncidentKey = (deviceId, type) => `${deviceId}_${type}`;


const hasActiveIncident = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    return !!activeIncidents[key];
};

const addIncident = (deviceId, type, incidentId) => {
    const key = getIncidentKey(deviceId, type);
    activeIncidents[key] = incidentId;
};

const removeIncident = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    delete activeIncidents[key];
};

const getIncidentId = (deviceId, type) => {
    const key = getIncidentKey(deviceId, type);
    return activeIncidents[key];
};

const addAiCachedData = async (deviceId,type,aiData) =>{
    const key = getIncidentKey(deviceId, type);
    const incidentId = activeIncidents[key];
    aiCachedData[incidentId]=aiData;
}

const checkAiCachedData = (deviceId, type ,aiData) =>{
    const key = getIncidentKey(deviceId, type);
    const IncidentId=activeIncidents[key]
    if(isEqual(aiCachedData[IncidentId],aiData)){
        return ;
    }else{
        aiCachedData[IncidentId]=aiData;
    }
}

module.exports = {activeIncidents , hasActiveIncident,getIncidentKey , addIncident, removeIncident, getIncidentId , loadActiveIncidents, addAiCachedData ,checkAiCachedData};