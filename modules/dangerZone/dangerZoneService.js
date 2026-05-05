//const incidentSummaryModel = require('../incident-summary/incidentSummaryModel');
const {calculateDangerPercentage } = require('../../shared/utils/dangerScoreCalculator');

const ALL_ZONES = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5' , 'Zone 6', 'Zone 7', 'Zone 8'];

const getWeeklyDangerZones = async() =>{
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const zoneSummaries = await incidentSummaryModel.aggregate([
        {
            $match: {
                timestamp: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: '$zone',
                highPriority: { $sum: '$highPriority' },
                mediumPriority: { $sum: '$mediumPriority' },
                lowPriority: { $sum: '$lowPriority' },
                total: { $sum: '$total' },
                weaponIncidents: { $sum: '$weaponIncidents' },
                behaviorIncidents: { $sum: '$behaviorIncidents' },
                fireIncidents: { $sum: '$fireIncidents' }
            }
        }
    ]);

    //convert to map for easier access
    const zoneMap = {};
    zoneSummaries.forEach(z => {
        zoneMap[z._id] = z;
    });

    // Ensure all zones are represented, even if they have no incidents
    const allZonesData = ALL_ZONES.map(zone => ({
        zone,
        highPriority: zoneMap[zone]?.highPriority || 0, 
        mediumPriority: zoneMap[zone]?.mediumPriority || 0,
        lowPriority: zoneMap[zone]?.lowPriority || 0,
        total: zoneMap[zone]?.total || 0,
        weaponIncidents: zoneMap[zone]?.weaponIncidents || 0,
        behaviorIncidents: zoneMap[zone]?.behaviorIncidents || 0,
        fireIncidents: zoneMap[zone]?.fireIncidents || 0
    }));

    // Calculate danger percentage for each zone
    return calculateDangerPercentage(allZonesData);
}