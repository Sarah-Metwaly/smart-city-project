// Physical model: 50cm width × 70cm height
// Divided into 8 zones (4 columns × 2 rows)

// Layout:
// ┌────────┬────────┬────────┬────────┐
// │ zone_1 │ zone_2 │ zone_3 │ zone_4 │  (y: 0-35)
// ├────────┼────────┼────────┼────────┤
// │ zone_5 │ zone_6 │ zone_7 │ zone_8 │  (y: 35-70)
// └────────┴────────┴────────┴────────┘
//   x:0-12  x:12-25  x:25-37  x:37-50

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

const getZone = (x, y) => {
    const zone = ZONES.find(z => 
        x >= z.xMin && x < z.xMax && 
        y >= z.yMin && y < z.yMax
    );
    return zone ? zone.name : 'unknown';
};

module.exports = { getZone, ZONES };