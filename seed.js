const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// ===================== CONFIG =====================
const DB_URI = 'mongodb://127.0.0.1:27017/test';

const ZONES = [
    { name: 'zone_1', xMin: 0,  xMax: 12, yMin: 0,  yMax: 35 },
    { name: 'zone_2', xMin: 12, xMax: 25, yMin: 0,  yMax: 35 },
    { name: 'zone_3', xMin: 25, xMax: 37, yMin: 0,  yMax: 35 },
    { name: 'zone_4', xMin: 37, xMax: 50, yMin: 0,  yMax: 35 },
    { name: 'zone_5', xMin: 0,  xMax: 12, yMin: 35, yMax: 70 },
    { name: 'zone_6', xMin: 12, xMax: 25, yMin: 35, yMax: 70 },
    { name: 'zone_7', xMin: 25, xMax: 37, yMin: 35, yMax: 70 },
    { name: 'zone_8', xMin: 37, xMax: 50, yMin: 35, yMax: 70 },
];

const TYPES = [
    'MEDICAL_EMERGENCY', 'CROWD_MANAGEMENT', 'THEFT_DETECTION',
    'SMOKE_DETECTION', 'POOR_AIR_QUALITY', 'HIGH_HUMIDITY',
    'FIRE_DETECTION', 'LOW_PRESSURE', 'HIGH_PRESSURE',
    'WEAPON_DETECTION', 'BEHAVIOR_ANOMALY', 'ENERGY_ANOMALY',
    'CITIZEN_CALL', 'MANUAL_REPORT', 'HIGH_TEMPERATURE'
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const SOURCES = ['SENSOR', 'AI', 'MANUAL', 'CITIZEN'];

// ===================== HELPERS =====================
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const randItem = (arr) => arr[randInt(0, arr.length)];

const randZone = () => {
    const zone = randItem(ZONES);
    return {
        x: rand(zone.xMin, zone.xMax),
        y: rand(zone.yMin, zone.yMax),
        name: zone.name
    };
};

// تاريخ معين + ساعة عشوائية في نفس اليوم
const randDateInDay = (date) => {
    const d = new Date(date);
    d.setUTCHours(randInt(0, 24), randInt(0, 60), randInt(0, 60), 0);
    return d;
};

// ===================== SCHEMA =====================
const IncidentSchema = new mongoose.Schema({
    incidentId: { type: String, unique: true, index: true },
    type: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, default: 'ACTIVE' },
    source: {
        type: { type: String },
        deviceId: String,
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        name: String,
        zone: String,
    },
    aiData: { type: mongoose.Schema.Types.Mixed, default: {} },
    sensorData: { type: mongoose.Schema.Types.Mixed, default: {} },
    media: {
        images: { type: [String], default: [] },
        videos: { type: [String], default: [] },
        liveFeedUrl: { type: String, default: null },
    },
    actions: [{
        user: { type: String, default: 'SYSTEM' },
        action: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
    }],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }],
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: Date,
    notes: String,
}, { timestamps: true });

const Incident = mongoose.model('Incident', IncidentSchema);

// ===================== SEED =====================
const seed = async () => {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB');

    await Incident.deleteMany({});
    console.log('🗑️  Cleared existing incidents');

    const incidents = [];

    // آخر 7 أيام
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setUTCDate(today.getUTCDate() - i);

        // عدد عشوائي من 5 لـ 10 incidents في اليوم
        const count = randInt(5, 11);

        for (let j = 0; j < count; j++) {
            const zone = randZone();
            const createdAt = randDateInDay(day);
            const priority = randItem(PRIORITIES);
            const type = randItem(TYPES);
            const source = randItem(SOURCES);

            // 60% من الـ incidents تكون RESOLVED
            const isResolved = Math.random() < 0.6;
            const status = isResolved ? 'RESOLVED' : randItem(['ACTIVE', 'DISPATCHED', 'FALSE_ALARM']);

            // وقت الـ resolve بين 10 و 90 دقيقة بعد الـ createdAt
            const resolvedAt = isResolved
                ? new Date(createdAt.getTime() + randInt(10, 91) * 60 * 1000)
                : null;

            incidents.push({
                incidentId: `INC-${uuidv4().split('-')[0].toUpperCase()}`,
                type,
                priority,
                status,
                source: { type: source, deviceId: `DEV-${randInt(1, 20)}` },
                location: {
                    type: 'Point',
                    coordinates: [zone.x, zone.y],
                    name: `Location ${randInt(1, 50)}`,
                    zone: zone.name,
                },
                aiData: {},
                sensorData: {},
                media: { images: [], videos: [], liveFeedUrl: null },
                actions: [{
                    user: 'SYSTEM',
                    action: 'CREATE',
                    note: 'Seeded incident',
                    timestamp: createdAt,
                }],
                assignedTo: [],
                respondedBy: null,
                resolvedAt,
                notes: isResolved ? 'Resolved by seed' : null,
                createdAt,
                updatedAt: resolvedAt || createdAt,
            });
        }
    }

    // insertMany مع timestamps: false عشان نحافظ على الـ createdAt بتاعنا
    await Incident.insertMany(incidents, { timestamps: false });
    console.log(`✅ Seeded ${incidents.length} incidents across 7 days`);

    // summary
    const byDay = {};
    incidents.forEach(inc => {
        const day = inc.createdAt.toISOString().slice(0, 10);
        if (!byDay[day]) byDay[day] = { total: 0, resolved: 0 };
        byDay[day].total++;
        if (inc.status === 'RESOLVED') byDay[day].resolved++;
    });

    console.log('\n📊 Summary:');
    Object.entries(byDay).sort().forEach(([day, data]) => {
        console.log(`  ${day}: ${data.total} incidents, ${data.resolved} resolved`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
};

seed().catch(console.error);