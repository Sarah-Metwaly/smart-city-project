const incidentService = require('./incidentService');
const catchAsync = require('../../shared/utils/catchAsync');


const createFromManual = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const incident = await incidentService.createFromManual(req.body, userId);
    res.status(201).json({
        success: true,
        message: 'Manual incident created',
        data: incident
    });
});

const getAllIncidents = catchAsync(async (req, res) => {
  const incidents = await incidentService.getAllIncidents(req.query);
  res.status(200).json({
      status: 'success',
      length: incidents.length,
      data: incidents
  });
});

const getAllIncidentsForAdmin = catchAsync(async (req, res) => {
  const incidents = await incidentService.getAllIncidentsForAdmin(req.query);
  res.status(200).json({
      status: 'success',
      length: incidents.length,
      data: incidents
  });
});

const updateIncident = catchAsync(async (req, res) => {
  const { incidentId } = req.params;
  const updated = await incidentService.updateIncident(incidentId, req.body);
  res.json({ success: true, message: 'Incident updated successfully', data: updated });
});

// const getIncidentById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const incident = await incidentService.getIncidentById(id);
//   if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
//   res.json({ success: true, message: 'Incident fetched successfully', data: incident });
// });


module.exports = {
  createFromManual,
  updateIncident,
  getAllIncidents,
  getAllIncidentsForAdmin,
};
