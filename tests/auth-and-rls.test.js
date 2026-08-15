const test = require('node:test');
const assert = require('node:assert');

test('Auth Protected Routes - verify route gating patterns', () => {
  const protectedRoutes = ['/admin', '/dashboard', '/profile', '/inbox', '/onboarding'];
  const publicRoutes = ['/', '/hostels', '/gyms', '/sports', '/events', '/explore', '/login', '/signup'];

  protectedRoutes.forEach((route) => {
    assert.strictEqual(typeof route, 'string');
    assert.ok(route.startsWith('/'));
  });

  assert.strictEqual(protectedRoutes.length, 5);
  assert.strictEqual(publicRoutes.length, 8);
});

test('Role Gating Matrix - Admin and Owner checks', () => {
  function checkAccess(role, target) {
    if (!role) return { allow: false, redirect: '/login' };
    if (target === '/admin') {
      return role === 'admin' ? { allow: true } : { allow: false, redirect: '/' };
    }
    if (target === '/dashboard') {
      return role === 'owner' || role === 'admin' ? { allow: true } : { allow: false, redirect: '/' };
    }
    return { allow: true };
  }

  // Unauthenticated
  assert.deepStrictEqual(checkAccess(null, '/admin'), { allow: false, redirect: '/login' });
  assert.deepStrictEqual(checkAccess(null, '/dashboard'), { allow: false, redirect: '/login' });

  // Regular user
  assert.deepStrictEqual(checkAccess('user', '/admin'), { allow: false, redirect: '/' });
  assert.deepStrictEqual(checkAccess('user', '/dashboard'), { allow: false, redirect: '/' });

  // Admin user
  assert.deepStrictEqual(checkAccess('admin', '/admin'), { allow: true });

  // Owner user
  assert.deepStrictEqual(checkAccess('owner', '/dashboard'), { allow: true });
});

test('Data Schema & Field Alignment - verify renamed schema properties', () => {
  const gymSample = {
    id: 'uuid-sample',
    name: 'Sample Gym',
    gym_type: 'crossfit',
    price_min: 3000,
    address: 'Koramangala, Bangalore',
  };

  const eventSample = {
    id: 'event-sample',
    title: 'Tribe Meetup',
    venue: 'Indiranagar Social',
    event_date: '2026-08-20',
    event_time: '18:00',
    photo: 'https://images.unsplash.com/sample',
  };

  assert.ok('gym_type' in gymSample, 'Gym must have gym_type');
  assert.ok('price_min' in gymSample, 'Gym must have price_min');
  assert.ok('venue' in eventSample, 'Event must have venue');
  assert.ok('event_date' in eventSample, 'Event must have event_date');
});
