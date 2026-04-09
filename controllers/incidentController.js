const incidentService = require('../services/incidentService');
const  catchAsync  = require('../utils/catchAsync');

class IncidentController {

  createFromSensor = catchAsync(async (req, res) => {
    const incident = await incidentService.createFromSensor(req.body);
    res.status(201).json({
      success: true,
      message: 'Incident created from sensor',
      data: incident
    });
  });


  createFromAI = catchAsync(async (req, res) => {
    const incident = await incidentService.createFromAI(req.body);
    res.status(201).json({
      success: true,
      message: 'Incident created/correlated from AI',
      data: incident
    });
  });


  createFromManual = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null; 
    const incident = await incidentService.createFromManual(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Manual incident created',
      data: incident
    });
  });


  updateIncident = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await incidentService.updateIncident(id, req.body);

    res.json({
      success: true,
      message: 'Incident updated successfully',
      data: updated
    });
  });

 
  getAllIncidents = catchAsync(async (req, res) => {
    const incidents = await incidentService.getAllIncidents(req.query);
    res.json({
      success: true,
      message: 'Incidents fetched successfully',
      data: incidents
    });
  });

 
  getIncidentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const incident = await incidentService.getIncidentById(id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    res.json({
      success: true,
      message: 'Incident fetched successfully',
      data: incident
    });
  });
}

module.exports = new IncidentController();
