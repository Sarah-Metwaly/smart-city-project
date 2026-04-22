const aiDataModel = require('./aiDataModel');
const incidentService = require('../incidents/incidentService');

exports.saveAiData = async (data) => {
    const aiDataEntry = await aiDataModel.create(data);
    this.detectActiveIncidents(aiDataEntry);
    return aiDataEntry;
};

exports.detectActiveIncidents = async (aiDataEntry) => {
    // Implementation for detecting active incidents
    let aiPayload = {
        header: aiDataEntry.header,
        source:{
                type: 'AI',
                deviceId: aiDataEntry.header.device_id
        },
        location:{
            type: 'Point',
            coordinates: aiDataEntry.header.location.coordinates, // Placeholder, replace with actual coordinates if available
        },
    }
    if(aiDataEntry.detections.fire_analysis?.detected){
        aiPayload = {
            ...aiPayload,
            type: 'FIRE_DETECTION',
            aiData: {
                fire_analysis: aiDataEntry.detections.fire_analysis
            }
        };
        await incidentService.createFromAI(aiPayload);
    }
    if(aiDataEntry.detections.weapon_analysis?.detected){
        aiPayload = {
            ...aiPayload,
            type: 'WEAPON_DETECTION',
            aiData: {
                weapon_analysis: aiDataEntry.detections.weapon_analysis
            }
        };
        await incidentService.createFromAI(aiPayload);
    }
    if(aiDataEntry.detections.behavior_analysis?.theft_detection?.alert){
        aiPayload = {
            ...aiPayload,
            type: 'THEFT_DETECTION',
            aiData: {
                behavior_analysis: aiDataEntry.detections.behavior_analysis.theft_detection
            }
        }
        await incidentService.createFromAI(aiPayload);
    }
    if(aiDataEntry.detections.behavior_analysis?.crowd_management?.is_crowded){
        aiPayload = {
            ...aiPayload,
            type: 'CROWD_MANAGEMENT',
            aiData: {
                behavior_analysis: aiDataEntry.detections.behavior_analysis.crowd_management
            }
        }
        await incidentService.createFromAI(aiPayload);
    }
    if(aiDataEntry.detections.behavior_analysis?.wrong_way?.detected){
        aiPayload = {
            ...aiPayload,
            type: 'WRONG_WAY_DETECTION',
            aiData: {
                behavior_analysis: aiDataEntry.detections.behavior_analysis.wrong_way
            }   
        }
        await incidentService.createFromAI(aiPayload);
    }
    if(aiDataEntry.detections.behavior_analysis?.medical_emergency?.person_down){
        aiPayload = {
            ...aiPayload,
            type: 'MEDICAL_EMERGENCY',
            aiData: {
                behavior_analysis: aiDataEntry.detections.behavior_analysis.medical_emergency
            }
        }
        await incidentService.createFromAI(aiPayload);
    }

};
