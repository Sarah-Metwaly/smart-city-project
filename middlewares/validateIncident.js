const { z } = require('zod');

// 1. تعريف الـ Location Schema المشترك
const locationSchema = z.object({
  lat: z.number().optional(), // اختياري لأننا ممكن نبعت coordinates مصفوفة
  lng: z.number().optional(),
  name: z.string({ required_error: "Location name is required" }),
  zone: z.string().optional(),
  coordinates: z.array(z.number()).length(2).optional() // [lng, lat]
});

// 2. تعريف الـ Schema لكل نوع بلاغ
const incidentSchema = z.discriminatedUnion("type", [
  
  // بلاغ الحريق (IOT_FIRE / FIRE_DETECTION)
  z.object({
    type: z.literal("FIRE_DETECTION"),
    sensorId: z.string().optional(),
    location: locationSchema,
    readings: z.object({
      temp: z.number().optional(),
      humidity: z.number().optional(),
      gasLevel: z.number().optional(),
      flameDetected: z.boolean().optional()
    }).optional(),
    priority: z.string().optional(), // سمحنا بوجودها عشان Postman ميضربش
    frameUrl: z.string().url().optional()
  }),

  // بلاغ السلاح (AI_WEAPON / WEAPON_DETECTION)
  z.object({
    type: z.literal("WEAPON_DETECTION"),
    cameraId: z.string(),
    location: locationSchema,
    confidence: z.number().min(0).max(1),
    detections: z.array(z.any()).optional(),
    frameUrl: z.string().url().optional(),
    priority: z.string().optional()
  }),

  // بلاغ السلوك الغريب
  z.object({
    type: z.literal("BEHAVIOR_ANOMALY"),
    cameraId: z.string(),
    location: locationSchema,
    behaviorType: z.string().optional(),
    confidence: z.number().min(0).max(1),
    priority: z.string().optional()
  }),

  // بلاغ المواطن
  z.object({
    type: z.literal("CITIZEN_CALL"),
    location: locationSchema,
    transcript: z.string(),
    keywords: z.array(z.string()).optional(),
    urgency: z.number().min(0).max(1),
    priority: z.string().optional()
  })
]);

// 3. الـ Middleware الأساسي مع معالجة الـ Error اللي ظهرلك
exports.validateIncident = (req, res, next) => {
  // استخدام safeParse عشان السيرفر ميكراشش لو فيه غلطة
  const result = incidentSchema.safeParse(req.body);
  
  if (!result.success) {
    // حل مشكلة (reading 'map') بالتأكد من الوصول لـ result.error.issues
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    });
  }
  
  // لو تمام، بنمرر الداتا "النظيفة" للـ Request اللي بعده
  req.body = result.data;
  next();
};