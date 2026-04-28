const { z } = require('zod');

// Shared location schema — GeoJSON Point format
const locationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.array(z.number()).length(2), // [longitude, latitude]
  name: z.string(),
  zone: z.string().optional()
});

// Discriminated union — type field determines which schema to apply
const incidentSchema = z.discriminatedUnion("type", [

  // AI vision contracts
  z.object({
    type: z.literal("WEAPON_DETECTION"),
    cameraId: z.string(),
    location: locationSchema,
    confidence: z.number().min(0).max(1),
    weaponType: z.enum(["Knife", "Gun", "Rifle", "Other"]),
    frameUrl: z.string().url(),
    boundingBox: z.array(z.number()).length(4).optional(),
  }),

  z.object({
    type: z.literal("BEHAVIOR_ANOMALY"),
    cameraId: z.string(),
    location: locationSchema,
    confidence: z.number().min(0).max(1),
    behaviorType: z.enum(["LURKING", "FIGHT", "THEFT", "CROWD_ANOMALY"]),
    clipUrl: z.string().url(),
    personCount: z.number().int().optional(),
    liveFeedUrl: z.string().url().optional(),
  }),

  z.object({
    type: z.literal("FIRE_DETECTION"),
    cameraId: z.string(),
    location: locationSchema,
    confidence: z.number().min(0).max(1),
    frameUrl: z.string().url(),
  }),

  // NLP / STT pipeline contract
  z.object({
    type: z.literal("CITIZEN_CALL"),
    transcript: z.string(),
    urgency: z.number().min(0).max(1),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    location: locationSchema.optional(), // extracted from transcript if possible
    keywords: z.array(z.string()).optional(),
    audioUrl: z.string().url().optional(),
  }),

  // Sensor service contracts
  z.object({
    type: z.literal("LOW_PRESSURE"),
    sensorId: z.string(),
    location: locationSchema,
    readings: z.object({ pressure: z.number() }),
  }),

  z.object({
    type: z.literal("HIGH_TEMPERATURE"),
    sensorId: z.string(),
    location: locationSchema,
    readings: z.object({ temperature: z.number() }),
  }),

  z.object({
    type: z.literal("GAS_LEAK"),
    sensorId: z.string(),
    location: locationSchema,
    readings: z.object({ gasLevel: z.number() }).optional(),
  }),

  z.object({
    type: z.literal("SMOKE_DETECTION"),
    sensorId: z.string(),
    location: locationSchema,
  }),

  z.object({
    type: z.literal("ENERGY_ANOMALY"),
    sensorId: z.string(),
    location: locationSchema,
  }),

  // Manual officer report
  z.object({
    type: z.literal("MANUAL_REPORT"),
    location: locationSchema,
    notes: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  }),
]);

// Core validation — used inside services for programmatic validation
// const validateIncident = (data) => {
//   const result = incidentSchema.safeParse(data);
//   if (!result.success) {
//     const error = new Error('Validation failed');
//     error.statusCode = 400;
//     error.errors = result.error.issues.map(err => ({
//       field: err.path.join('.'),
//       message: err.message
//     }));
//     throw error;
//   }
//   return result.data;
// };

// // Express middleware — used in routes
// const validateIncidentMiddleware = (req, res, next) => {
//   try {
//     req.body = validateIncident(req.body);
//     next();
//   } catch (err) {
//     return res.status(400).json({
//       status: 'fail',
//       message: err.message,
//       errors: err.errors
//     });
//   }
// };

module.exports= {
  incidentSchema,
  // validateIncident,
  // validateIncidentMiddleware
};