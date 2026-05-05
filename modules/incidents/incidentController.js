const incidentService = require('./incidentService');
const catchAsync = require('../../shared/utils/catchAsync');

const createFromSensor = catchAsync(async (req, res) => {
  const incident = await incidentService.createFromSensor(req.body);
  res.status(201).json({ success: true, message: 'Incident created from sensor', data: incident });
});

const createFromAI = catchAsync(async (req, res) => {
  const incident = await incidentService.createFromAI(req.body);
  res.status(201).json({ success: true, message: 'Incident created/correlated from AI', data: incident });
});

const createFromManual = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const incident = await incidentService.createFromManual(req.body, userId);
  res.status(201).json({ success: true, message: 'Manual incident created', data: incident });
});

const updateIncident = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await incidentService.updateIncident(id, req.body);
  res.json({ success: true, message: 'Incident updated successfully', data: updated });
});

const getAllIncidents = catchAsync(async (req, res) => {
  const incidents = await incidentService.getAllIncidents(req.query);
  res.status(200).json({
      status: 'success',
      length: incidents.length,
      data: incidents
  });
});

const getIncidentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const incident = await incidentService.getIncidentById(id);
  if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, message: 'Incident fetched successfully', data: incident });
});


module.exports = {
  createFromSensor,
  createFromAI,
  createFromManual,
  updateIncident,
  getAllIncidents,
  getIncidentById,
};
