const http = require('http');

const paths = [
  '/',
  '/hostels',
  '/gyms',
  '/sports',
  '/events',
  '/community',
  '/login',
  '/signup',
  '/admin',
  '/dashboard',
  '/explore',
  '/inbox',
  '/profile'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      resolve({ path, statusCode: res.statusCode, location: res.headers.location || null });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('--- Testing Localhost:3000 Routes ---');
  for (const p of paths) {
    const res = await checkRoute(p);
    if (res.error) {
      console.log(`❌ ${p} -> Error: ${res.error}`);
    } else {
      const extra = res.location ? `(redirects to ${res.location})` : '';
      console.log(`✅ ${p.padEnd(15)} -> HTTP ${res.statusCode} ${extra}`);
    }
  }
}

run();
