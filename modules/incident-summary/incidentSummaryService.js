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
const getCountsByDate = async (dateStr) => {
  const todayStr = new Date().toLocaleDateString('en-CA'); 

  // if it's today bypass the stored summary and calculate directly from live incidents
  if (dateStr === todayStr) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const liveIncidents = await Incident.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: 'FALSE_ALARM' }
    });

    let weapon = 0, fire = 0, behavior = 0;
    liveIncidents.forEach(inc => {
      if (inc.type === 'WEAPON_DETECTION') {
        weapon++;
      } else if (['THEFT_DETECTION', 'CROWD_MANAGEMENT', 'MEDICAL_EMERGENCY'].includes(inc.type)) {
        behavior++;
      } else if (['FIRE_DETECTION', 'SMOKE_DETECTION'].includes(inc.type)) {
        fire++;
      }
    });

    return { weapon, fire, behavior };
  }

  // if it's yesterday (or past dates), read from the fast summary collection as usual
  const result = await IncidentSummary.aggregate([
    { $match: { date: dateStr } },
    {
      $group: {
        _id: null,
        weapon:   { $sum: { $ifNull: ['$weaponIncidents',   0] } },
        fire:     { $sum: { $ifNull: ['$fireIncidents',     0] } },
        behavior: { $sum: { $ifNull: ['$behaviorIncidents', 0] } },
      }
    }
  ]);

  if (result.length > 0) {
    return {
      weapon:   result[0].weapon    || 0,    
      fire:     result[0].fire   ||   0,
      behavior: result[0].behavior || 0,
    };
  }

  return { weapon: 0, fire: 0, behavior: 0 };
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
  const todayCounts = await getCountsByDate(todayStr);
  const yesterdayCounts = await getCountsByDate(yesterdayStr);

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

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const summaries = await Incident.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfWeek }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Africa/Cairo" }
        },
        total: { $sum: 1 },
        highPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "HIGH"] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "MEDIUM"] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "LOW"] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]) || [];

  return days.map(day => {
    const found = summaries.find(s => s && s._id === day);
    return found ? {
      _id: found._id,
      total: found.total || 0,
      highPriority: found.highPriority || 0,
      mediumPriority: found.mediumPriority || 0,
      lowPriority: found.lowPriority || 0
    } : {
      _id: day, 
      total: 0,
      highPriority: 0, 
      mediumPriority: 0, 
      lowPriority: 0
    };
  });
};

module.exports = {
  getWeeklyTrend
};

// get average response time for incidents created on a given date (default to today)
const getAvgResponseTime = async (dateStr) => {
  const date = dateStr || new Date().toISOString().split('T')[0];
  const start = new Date(`${date}T00:00:00.000Z`);
  const end   = new Date(`${date}T23:59:59.999Z`);

  return Incident.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        resolvedAt: { $ne: null } 
      }
    },
   {
  $group: {
    _id: { $hour: '$createdAt' },
    avgMinutes: {
      $avg: {
        $divide: [
          { $subtract: ['$resolvedAt', '$createdAt'] },
          60000 
        ]
      }
    }
  }
},
    {
      $project: {
        _id: 0,
        crimeHour: '$_id', 
        avgMinutes: { $round: ['$avgMinutes', 1] }
      }
    },
    { $sort: { crimeHour: 1 } } 
  ]);
};

/**
  * Get active incidents for map view with optional type filter and limit
 */
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