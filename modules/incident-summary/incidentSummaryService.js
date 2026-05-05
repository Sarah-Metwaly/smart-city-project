const IncidentSummary = require('./incidentSummaryModel');
const Incident = require('../incidents/IncidentModel');

const generateSummary = async (dateStr) => {
  const date = dateStr || new Date().toISOString().split('T')[0];

  const start = new Date(`${date}T00:00:00.000Z`);
  const end   = new Date(`${date}T23:59:59.999Z`);

  const incidents = await Incident.find({
    createdAt: { $gte: start, $lte: end }
  });

  if (incidents.length === 0) return null;

  let highPriority = 0, mediumPriority = 0, lowPriority = 0;
  let weaponIncidents = 0, behaviorIncidents = 0, fireIncidents = 0;

  for (const inc of incidents) {
    if (inc.priority === 'CRITICAL' || inc.priority === 'HIGH') highPriority++;
    if (inc.priority === 'MEDIUM') mediumPriority++;
    if (inc.priority === 'LOW')    lowPriority++;

    if (inc.type === 'WEAPON_DETECTION')  weaponIncidents++;
    if (inc.type === 'BEHAVIOR_ANOMALY')  behaviorIncidents++;
    if (inc.type === 'FIRE_DETECTION')    fireIncidents++;
  }

  return IncidentSummary.findOneAndUpdate(
    { date },
    {
      date,
      total: incidents.length,
      highPriority,
      mediumPriority,
      lowPriority,
      weaponIncidents,
      behaviorIncidents,
      fireIncidents,
      timestamp: new Date()
    },
    { upsert: true, new: true }
  );
};
module.exports = { generateSummary };