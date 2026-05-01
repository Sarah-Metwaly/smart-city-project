const aiDataModel = require('./aiDataModel');
const incidentService = require('../incidents/incidentService');
const {activeIncidents , hasActiveIncident, addIncident, removeIncident, getIncidentId , loadActiveIncidents, addAiCachedData ,checkAiCachedData} = require('../../shared/utils/incidentCashe');


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
    if(aiDataEntry.detections.fire_analysis?.detected !== undefined){
        if(aiDataEntry.detections.fire_analysis?.detected){
            aiPayload = {
            ...aiPayload,
            type: 'FIRE_DETECTION',
            aiData: {
                fire_analysis: aiDataEntry.detections.fire_analysis
            }
            };
            await incidentService.upsertFromAi(aiPayload);
        }
        else { //No Incident but check if it was resolved.
            if(hasActiveIncident(aiPayload.source.deviceId , 'FIRE_DETECTION')){
                await incidentService.aiClearedAwaitingConfirmation(aiPayload.source.deviceId , 'FIRE_DETECTION')
            }
        }  
    }
    if(aiDataEntry.detections.weapon_analysis?.detected !== undefined){
        if(aiDataEntry.detections.weapon_analysis?.detected){
            aiPayload = {
                ...aiPayload,
                type: 'WEAPON_DETECTION',
                aiData: {
                    weapon_analysis: aiDataEntry.detections.weapon_analysis
                }
            };
            await incidentService.upsertFromAi(aiPayload);
        }
        else { //No Incident but check if it was resolved.
            if(hasActiveIncident(aiPayload.source.deviceId , 'WEAPON_DETECTION')){
                await incidentService.aiClearedAwaitingConfirmation(aiPayload.source.deviceId , 'WEAPON_DETECTION')
            }
        } 
    }
    if(aiDataEntry.detections.behavior_analysis?.theft_detection?.alert !== undefined){
        if(aiDataEntry.detections.behavior_analysis?.theft_detection?.alert){
            aiPayload = {
                ...aiPayload,
                type: 'THEFT_DETECTION',
                aiData: {
                    behavior_analysis: aiDataEntry.detections.behavior_analysis.theft_detection
                }
            }
            await incidentService.upsertFromAi(aiPayload);
        }
        else { //No Incident but check if it was resolved.
            if(hasActiveIncident(aiPayload.source.deviceId , 'THEFT_DETECTION')){
                await incidentService.aiClearedAwaitingConfirmation(aiPayload.source.deviceId , 'THEFT_DETECTION')
            }
        } 
    }
    if(aiDataEntry.detections.behavior_analysis?.crowd_management?.is_crowded !== undefined){
        if(aiDataEntry.detections.behavior_analysis?.crowd_management?.is_crowded){
            aiPayload = {
                ...aiPayload,
                type: 'CROWD_MANAGEMENT',
                aiData: {
                    behavior_analysis: aiDataEntry.detections.behavior_analysis.crowd_management
                }
            }
            await incidentService.upsertFromAi(aiPayload);
        }
        else { //No Incident but check if it was resolved.
            if(hasActiveIncident(aiPayload.source.deviceId , 'CROWD_MANAGEMENT')){
                await incidentService.aiClearedAwaitingConfirmation(aiPayload.source.deviceId , 'CROWD_MANAGEMENT')
            }
        } 
    }
    if(aiDataEntry.detections.behavior_analysis?.medical_emergency?.person_down !== undefined){
        if(aiDataEntry.detections.behavior_analysis?.medical_emergency?.person_down){
            aiPayload = {
                ...aiPayload,
                type: 'MEDICAL_EMERGENCY',
                aiData: {
                    behavior_analysis: aiDataEntry.detections.behavior_analysis.medical_emergency
                }
            }
            await incidentService.upsertFromAi(aiPayload);
        }
        else { //No Incident but check if it was resolved.
            if(hasActiveIncident(aiPayload.source.deviceId , 'MEDICAL_EMERGENCY')){
                await incidentService.aiClearedAwaitingConfirmation(aiPayload.source.deviceId , 'MEDICAL_EMERGENCY')
            }
        } 
    }

};
