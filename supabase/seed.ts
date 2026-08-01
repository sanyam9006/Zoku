/**
 * Seed script — inserts hardcoded data from lib/data.ts into Supabase.
 *
 * Usage:
 *   npx tsx supabase/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (uses service role to bypass RLS).
 */

import { createClient } from '@supabase/supabase-js';
import {
  HOSTELS,
  GYMS,
  SPORTS_CLUBS,
  EVENTS,
} from '../lib/data';

// ── Load env ──────────────────────────────────────────────────────
// dotenv isn't installed, so we read .env.local manually
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env.local');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ── Seed helpers ──────────────────────────────────────────────────

async function seedHostels() {
  const rows = HOSTELS.map((h) => ({
    name: h.name,
    description: h.description || null,
    city: h.city,
    address: h.address,
    lat: h.lat,
    lng: h.lng,
    price_min: h.price_min,
    price_max: h.price_max,
    gender: h.gender,
    amenities: h.amenities,
    photos: h.photos,
    verified: h.verified,
    rating: h.rating,
    reviews_count: h.reviews_count,
    phone: h.contact || null,
    distance: h.distance || null,
  }));

  const { data, error } = await supabase.from('hostels').upsert(rows, {
    onConflict: 'name',
    ignoreDuplicates: true,
  }).select('id, name');

  if (error) {
    console.error('❌ Hostels seed error:', error.message);
  } else {
    console.log(`✅ Seeded ${data?.length ?? 0} hostels`);
    if (data) data.forEach((r) => console.log(`   ${r.name} → ${r.id}`));
  }

  return data;
}

async function seedGyms() {
  const rows = GYMS.map((g) => ({
    name: g.name,
    description: g.description || null,
    city: g.city,
    address: g.address,
    lat: g.lat,
    lng: g.lng,
    price_min: g.price_min,
    gym_type: g.gym_type,
    timing: g.timing,
    photos: g.photos,
    rating: g.rating,
    distance: g.distance || null,
  }));

  const { data, error } = await supabase.from('gyms').upsert(rows, {
    onConflict: 'name',
    ignoreDuplicates: true,
  }).select('id, name');

  if (error) {
    console.error('❌ Gyms seed error:', error.message);
  } else {
    console.log(`✅ Seeded ${data?.length ?? 0} gyms`);
    if (data) data.forEach((r) => console.log(`   ${r.name} → ${r.id}`));
  }

  return data;
}

async function seedSportsClubs() {
  const rows = SPORTS_CLUBS.map((s) => ({
    name: s.name,
    city: s.city,
    address: s.address,
    lat: s.lat,
    lng: s.lng,
    sport: s.sport,
    skill_level: s.skill_level,
    schedule: s.schedule,
    members_count: s.members_count,
    phone: s.phone || null,
  }));

  const { data, error } = await supabase.from('sports_clubs').upsert(rows, {
    onConflict: 'name',
    ignoreDuplicates: true,
  }).select('id, name');

  if (error) {
    console.error('❌ Sports clubs seed error:', error.message);
  } else {
    console.log(`✅ Seeded ${data?.length ?? 0} sports clubs`);
    if (data) data.forEach((r) => console.log(`   ${r.name} → ${r.id}`));
  }

  return data;
}

async function seedEvents() {
  const rows = EVENTS.map((e) => ({
    title: e.title,
    description: e.description || null,
    city: e.city,
    venue: e.venue,
    lat: e.lat,
    lng: e.lng,
    event_date: e.event_date,
    event_time: e.event_time || null,
    category: e.category,
    price: e.price,
    is_free: e.is_free,
    photo: e.photo || null,
    rsvp_count: e.rsvp_count,
  }));

  const { data, error } = await supabase.from('events').upsert(rows, {
    onConflict: 'title',
    ignoreDuplicates: true,
  }).select('id, title');

  if (error) {
    console.error('❌ Events seed error:', error.message);
  } else {
    console.log(`✅ Seeded ${data?.length ?? 0} events`);
    if (data) data.forEach((r) => console.log(`   ${r.title} → ${r.id}`));
  }

  return data;
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding Zoku database...\n');
  console.log(`   URL: ${supabaseUrl}\n`);

  await seedHostels();
  console.log('');
  await seedGyms();
  console.log('');
  await seedSportsClubs();
  console.log('');
  await seedEvents();

  console.log('\n🎉 Seeding complete!\n');
}

main().catch((err) => {
  console.error('💥 Seed failed:', err);
  process.exit(1);
});
