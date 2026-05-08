const incidentSummaryModel = require('../incident-summary/incidentSummaryModel');
const {calculateDangerPercentage } = require('../../shared/utils/dangerScoreCalculator');

const ALL_ZONES = ['zone_1', 'zone_2', 'zone_3', 'zone_4', 'zone_5', 'zone_6', 'zone_7', 'zone_8'];

exports.getWeeklyDangerZones = async (type = null) => {
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

    const zoneMap = {};
    zoneSummaries.forEach(z => { zoneMap[z._id] = z; });

    const allZonesData = ALL_ZONES.map(zone => {
        const data = zoneMap[zone];

        // If type is specified, only use that type's incidents for priority calculation
        if (type === 'fire') {
            const fireRatio = data?.total > 0 ? data?.fireIncidents / data?.total : 0;
            return {
                zone,
                highPriority: Math.round((data?.highPriority || 0) * fireRatio),
                mediumPriority: Math.round((data?.mediumPriority || 0) * fireRatio),
                lowPriority: Math.round((data?.lowPriority || 0) * fireRatio),
                total: data?.fireIncidents || 0,
                fireIncidents: data?.fireIncidents || 0
            };
        }

        return {
            zone,
            highPriority: data?.highPriority || 0,
            mediumPriority: data?.mediumPriority || 0,
            lowPriority: data?.lowPriority || 0,
            total: data?.total || 0,
            weaponIncidents: data?.weaponIncidents || 0,
            behaviorIncidents: data?.behaviorIncidents || 0,
            fireIncidents: data?.fireIncidents || 0
        };
    });

    return calculateDangerPercentage(allZonesData);
};