// measure_latency.js
// Usage: BASE_URL=https://your-app.onrender.com node measure_latency.js

const BASE_URL = 'https://smart-city-project-0ld1.onrender.com';
const RUNS = 20;

const ENDPOINTS = [
  { name: 'GET /incidents/DailyIncidents', method: 'GET', path: '/api/v1/incidents/DailyIncidents' },
  { name: 'GET /summary/today', method: 'GET', path: '/api/v1/summary/today' },
  {
    name: 'POST /auth/login',
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'admin@example.com', password: 'changedPassword123' },
  },
];

async function timeRequest(url, method, body) {
  const start = performance.now();
  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // still record the time even if the request errors (e.g. bad test credentials)
  }
  return performance.now() - start;
}

function stats(times) {
  const sorted = [...times].sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  return {
    avg: avg.toFixed(1),
    min: sorted[0].toFixed(1),
    max: sorted[sorted.length - 1].toFixed(1),
    median: median.toFixed(1),
  };
}

async function main() {
  console.log(`\nMeasuring against: ${BASE_URL}`);
  console.log(`Runs per endpoint: ${RUNS}\n`);

  const results = [];

  for (const ep of ENDPOINTS) {
    const times = [];
    for (let i = 0; i < RUNS; i++) {
      const t = await timeRequest(BASE_URL + ep.path, ep.method, ep.body);
      times.push(t);
    }
    results.push({ name: ep.name, ...stats(times) });
  }

  console.log('| Endpoint | Avg (ms) | Median (ms) | Min (ms) | Max (ms) |');
  console.log('|---|---|---|---|---|');
  for (const r of results) {
    console.log(`| ${r.name} | ${r.avg} | ${r.median} | ${r.min} | ${r.max} |`);
  }
}

main();