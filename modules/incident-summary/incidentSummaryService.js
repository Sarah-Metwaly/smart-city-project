const IncidentSummary = require('./incidentSummaryModel');
const Incident = require('../incidents/IncidentModel');
const { getZone } = require('../../shared/utils/zoneDetector');
const { calculateDangerScore } = require('../../shared/utils/dangerScoreCalculator');

const formatDate = (d) => d.toLocaleDateString('en-CA');
//saves a document per zone per day with aggregated data for that zone and day
const generateSummary = async () => {   
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const date = now.toLocaleDateString('en-CA');

    // Get all incidents for today except FALSE_ALARM
    const incidents = await Incident.find({
        createdAt: { $gte: start, $lte: end },
        status: { $ne: 'FALSE_ALARM' }
    });

    // Group incidents by zone
    const zoneData = {};

    for (const inc of incidents) {
        // Get zone from coordinates
        const x = inc.location?.coordinates?.[0] || 0;
        const y = inc.location?.coordinates?.[1] || 0;
        const zone = getZone(x, y).toLowerCase().replace(' ', '_'); // e.g. "Zone 1" -> "zone_1"

        // Initialize zone if not exists
        if (!zoneData[zone]) {
            zoneData[zone] = {
                total: 0,
                highPriority: 0,
                mediumPriority: 0,
                lowPriority: 0,
                weaponIncidents: 0,
                behaviorIncidents: 0,
                fireIncidents: 0,
            };
        }

        // Count priorities
        if (inc.priority === 'CRITICAL' || inc.priority === 'HIGH') zoneData[zone].highPriority++;
        if (inc.priority === 'MEDIUM') zoneData[zone].mediumPriority++;
        if (inc.priority === 'LOW') zoneData[zone].lowPriority++;

        // Count types
        if (inc.type === 'WEAPON_DETECTION') zoneData[zone].weaponIncidents++;
        if (['THEFT_DETECTION', 'CROWD_MANAGEMENT',  'MEDICAL_EMERGENCY'].includes(inc.type)) zoneData[zone].behaviorIncidents++;
        if (inc.type === 'FIRE_DETECTION') zoneData[zone].fireIncidents++;

        zoneData[zone].total++;
    }

    // Save one summary per zone per day
    const savePromises = Object.entries(zoneData).map(([zone, data]) => {
        const dangerScore = calculateDangerScore(
            data.highPriority,
            data.mediumPriority,
            data.lowPriority
        );

        return IncidentSummary.findOneAndUpdate(
            { date, zone },
            {
                $set: {
                    date,
                    zone,
                    ...data,
                    dangerScore,
                    timestamp: new Date()
                }
            },
            { upsert: true, new: true }
        );
    });

    await Promise.all(savePromises);
    console.log(`✅ Incident summary generated for ${date}`);
};

//get counts for weapon, fire, behavior incidents for yesterday 
const getYesterdayCountsFromSummary = async (yesterdayStr) => {
  const summaries = await IncidentSummary.find({ date: yesterdayStr });

  let weapon = 0, fire = 0, behavior = 0;

  summaries.forEach(doc => {
    weapon += doc.weaponIncidents || 0;
    fire += doc.fireIncidents || 0;
    behavior += doc.behaviorIncidents || 0;
  });

  return { weapon, fire, behavior };
};

//get counts for weapon, fire, behavior incidents for today
const getTodayCounts = async (todayStart) => {
  const result = await Incident.aggregate([
    { $match: {
        createdAt: { $gte: todayStart },
        status: { $ne: 'FALSE_ALARM' }
    } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 }
      }
    }
  ]);

  let weapon = 0, fire = 0, behavior = 0;

  result.forEach(r => {
    if (r._id === 'WEAPON_DETECTION') weapon = r.count;
    else if (r._id === 'FIRE_DETECTION') fire = r.count;
    else if (
      ['THEFT_DETECTION', 'MEDICAL_EMERGENCY', 'CROWD_MANAGEMENT'].includes(r._id)
    ) {
      behavior += r.count;
    }
  });

  return { weapon, fire, behavior };
};

// Additional function to get comparative stats for today's incidents vs yesterday's incidents
const getDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  // Fetch data
  const todayCounts = await getTodayCounts(today);
  const yesterdayCounts = await getYesterdayCountsFromSummary(yesterdayStr);

  const totalToday =
    todayCounts.weapon +
    todayCounts.fire +
    todayCounts.behavior;

  const calcTodayPercentage = (count) =>
    totalToday ? (count / totalToday) * 100 : 0;

  const calcChange = (today, yesterday) => {
    if (yesterday === 0) {
      return today === 0 ? 0 : 100; // or null if you prefer
    }
    return ((today - yesterday) / yesterday) * 100;
  };

  return {
    weapon: {
      todayPercentage: calcTodayPercentage(todayCounts.weapon),
      changePercentage: calcChange(
        todayCounts.weapon,
        yesterdayCounts.weapon
      ),
    },
    fire: {
      todayPercentage: calcTodayPercentage(todayCounts.fire),
      changePercentage: calcChange(
        todayCounts.fire,
        yesterdayCounts.fire
      ),
    },
    behavior: {
      todayPercentage: calcTodayPercentage(todayCounts.behavior),
      changePercentage: calcChange(
        todayCounts.behavior,
        yesterdayCounts.behavior
      ),
    },
  };
};

// get incident counts for the past 7 days grouped by day and priority
const getWeeklyTrend = async () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const summaries = await IncidentSummary.aggregate([
    { $match: { date: { $in: days } } },
    { $group: {
        _id: '$date',
        total:          { $sum: '$total' },
        highPriority:   { $sum: '$highPriority' },
        mediumPriority: { $sum: '$mediumPriority' },
        lowPriority:    { $sum: '$lowPriority' },
    }},
    { $sort: { _id: 1 } }
  ]);

  return days.map(day => {
    const found = summaries.find(s => s._id === day);
    return found || {
      _id: day, total: 0,
      highPriority: 0, mediumPriority: 0, lowPriority: 0
    };
  });
};

const getAvgResponseTime = async (mode = 'weekly') => {
    mode = mode?.trim() || 'weekly';

    const now = new Date();

    const todayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));

    if (mode === 'daily') {
        const hours = Array.from({ length: 24 }, (_, i) => {
            const start = new Date(todayUTC);
            start.setUTCHours(i, 0, 0, 0);
            const end = new Date(todayUTC);
            end.setUTCHours(i, 59, 59, 999);
            return { start, end, label: `${String(i).padStart(2, '0')}:00` };
        });

        const results = await Promise.all(
            hours.map(async ({ start, end, label }) => {
                const resolved = await Incident.find({
                    createdAt: { $gte: start, $lte: end },
                    status: 'RESOLVED',
                    resolvedAt: { $ne: null }
                }).select('createdAt resolvedAt');

                const avgMinutes =
                    resolved.length === 0
                        ? 0
                        : resolved.reduce((sum, inc) => {
                              const diffMs = new Date(inc.resolvedAt) - new Date(inc.createdAt);
                              return sum + diffMs / 1000 / 60;
                          }, 0) / resolved.length;

                return {
                    hour: label,
                    avgResponseTime: Math.round(avgMinutes * 10) / 10
                };
            })
        );

        return results;
    }

    // weekly (default)
    const days = Array.from({ length: 7 }, (_, i) => {
        const start = new Date(todayUTC);
        start.setUTCDate(todayUTC.getUTCDate() - i);
        const end = new Date(start);
        end.setUTCHours(23, 59, 59, 999);
        return { start, end, label: start.toISOString().slice(0, 10) };
    }).reverse();

    const results = await Promise.all(
        days.map(async ({ start, end, label }) => {
            const resolved = await Incident.find({
                createdAt: { $gte: start, $lte: end },
                status: 'RESOLVED',
                resolvedAt: { $ne: null }
            }).select('createdAt resolvedAt');

            const avgMinutes =
                resolved.length === 0
                    ? 0
                    : resolved.reduce((sum, inc) => {
                          const diffMs = new Date(inc.resolvedAt) - new Date(inc.createdAt);
                          return sum + diffMs / 1000 / 60;
                      }, 0) / resolved.length;

            return {
                date: label,
                avgResponseTime: Math.round(avgMinutes * 10) / 10
            };
        })
    );

    return results;
};

// get active incidents for live map with optional filters (type, limit)
const getActiveIncidentsForMap = async (filters = {}) => {
  const { 
    type = null,    
    limit = 20
  } = filters;

  const matchFilter = {
    status: { 
      $in: ['ACTIVE', 'DISPATCHED', 'AI CLEARED-AWAITING CONFIRMATION'] 
    }
  };

  // type filter is optional, if provided and not 'ALL', we filter by that type
  if (type && type !== 'ALL' && type !== 'all') {
    matchFilter.type = type;
  }

return await Incident.aggregate([
    { $match: matchFilter },
    {
        $project: {
            _id: 1,
            incidentId: 1,
            type: 1,
            priority: 1,
            status: 1,
            createdAt: 1,
            coordinates: '$location.coordinates',
            locationName: '$location.name',
            zone: '$location.zone',
            
        }
    },
    { $sort: { createdAt: -1 } },
    { $limit: Number(limit) }
]);
};

module.exports = { generateSummary, getDailyStats , getWeeklyTrend, getAvgResponseTime, getActiveIncidentsForMap };