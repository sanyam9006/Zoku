const { createClient } = require('@supabase/supabase-js');

const url = 'https://ivnfjdwtavfreibijwxf.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmZqZHd0YXZmcmVpYmlqd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzcyNTU1MiwiZXhwIjoyMDg5MzAxNTUyfQ.PDgdVgRU2AdepTZXYBj5gxO1oqCY6uzeledDm_80PIE';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmZqZHd0YXZmcmVpYmlqd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjU1NTIsImV4cCI6MjA4OTMwMTU1Mn0.xfEGgvnXbjVAlCw50re8TqHM8l4m2alOaML3GoZH_kU';

const adminClient = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const publicClient = createClient(url, anonKey);

async function createConfirmedAccounts() {
  const accounts = [
    { email: 'admin@zoku.app', password: 'Password123!', role: 'admin', full_name: 'Zoku Administrator', city: 'Bangalore' },
    { email: 'owner@zoku.app', password: 'Password123!', role: 'owner', full_name: 'Property Owner', city: 'Bangalore' },
    { email: 'demo@zoku.app', password: 'Password123!', role: 'user', full_name: 'Demo Traveler', city: 'Bangalore' },
  ];

  for (const acc of accounts) {
    console.log(`Creating/updating confirmed account: ${acc.email}...`);
    
    // Create user with email_confirm: true using admin client
    const { data, error } = await adminClient.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: {
        full_name: acc.full_name,
        city: acc.city,
        role: acc.role,
      },
    });

    if (error) {
      console.log(`Note on createUser (${acc.email}):`, error.message);
      // If user already exists, update user password & confirm email
      const { data: usersData } = await adminClient.auth.admin.listUsers();
      const existing = usersData?.users?.find(u => u.email === acc.email);
      if (existing) {
        await adminClient.auth.admin.updateUserById(existing.id, {
          password: acc.password,
          email_confirm: true,
          user_metadata: {
            full_name: acc.full_name,
            city: acc.city,
            role: acc.role,
          }
        });
        // Ensure profile table entry exists
        await adminClient.from('profiles').upsert({
          id: existing.id,
          full_name: acc.full_name,
          city: acc.city,
          role: acc.role,
        });
        console.log(`Updated existing user: ${acc.email}`);
      }
    } else if (data.user) {
      console.log(`Created new confirmed user: ${acc.email} (${data.user.id})`);
      // Ensure profile entry
      await adminClient.from('profiles').upsert({
        id: data.user.id,
        full_name: acc.full_name,
        city: acc.city,
        role: acc.role,
      });
    }

    // Test login immediately with public client
    const { data: loginData, error: loginError } = await publicClient.auth.signInWithPassword({
      email: acc.email,
      password: acc.password,
    });

    if (loginError) {
      console.error(`❌ Failed to log in as ${acc.email}:`, loginError.message);
    } else {
      console.log(`✅ SUCCESS: Logged in as ${acc.email}! User ID: ${loginData.user.id}`);
    }
  }
}

createConfirmedAccounts();
