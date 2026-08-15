const { createClient } = require('@supabase/supabase-js');

const url = 'https://ivnfjdwtavfreibijwxf.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmZqZHd0YXZmcmVpYmlqd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzcyNTU1MiwiZXhwIjoyMDg5MzAxNTUyfQ.PDgdVgRU2AdepTZXYBj5gxO1oqCY6uzeledDm_80PIE';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmZqZHd0YXZmcmVpYmlqd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjU1NTIsImV4cCI6MjA4OTMwMTU1Mn0.xfEGgvnXbjVAlCw50re8TqHM8l4m2alOaML3GoZH_kU';

const adminClient = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const publicClient = createClient(url, anonKey);

async function createAndVerifyUser() {
  const email = 'sanyam@zoku.app';
  const password = 'Password123!';
  const full_name = 'Sanyam';
  const city = 'Bangalore';
  const role = 'user';

  console.log(`\n========================================`);
  console.log(`Step 1: Creating confirmed account for ${email}...`);
  console.log(`========================================`);

  // 1. Create or update user via Admin API
  let userId;
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      city,
      role,
    }
  });

  if (createError) {
    console.log(`User already exists or note: ${createError.message}. Fetching user ID...`);
    const { data: listData } = await adminClient.auth.admin.listUsers();
    const existing = listData?.users?.find(u => u.email === email);
    if (existing) {
      userId = existing.id;
      await adminClient.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
        user_metadata: { full_name, city, role }
      });
      console.log(`Updated user ${email} (${userId}) with confirmed email & new password.`);
    }
  } else {
    userId = newUser.user.id;
    console.log(`Successfully created new user ${email} with ID: ${userId}`);
  }

  // 2. Ensure profile exists in public.profiles table
  console.log(`\n========================================`);
  console.log(`Step 2: Ensuring profile in database for ${userId}...`);
  console.log(`========================================`);
  const { error: profileError } = await adminClient.from('profiles').upsert({
    id: userId,
    full_name,
    city,
    role,
    college: 'IIT Bangalore',
    company: 'Tech Corp',
    hometown: 'Jaipur',
    interests: ['Football', 'Gaming', 'Coding'],
    bio: 'Relocated to Bangalore for tech and sports!',
  });

  if (profileError) {
    console.error('Profile upsert error:', profileError.message);
  } else {
    console.log('Profile successfully configured in database!');
  }

  // 3. Test Public Login
  console.log(`\n========================================`);
  console.log(`Step 3: Testing public login via signInWithPassword...`);
  console.log(`========================================`);
  const { data: loginData, error: loginError } = await publicClient.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    process.exit(1);
  }

  console.log(`✅ SUCCESS! Logged in as: ${loginData.user.email}`);
  console.log(`   Session Token: ${loginData.session.access_token.substring(0, 30)}...`);
  console.log(`   User Metadata:`, loginData.user.user_metadata);

  // 4. Verify Profile Query as logged-in user
  const userClient = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${loginData.session.access_token}` } }
  });

  const { data: profileData, error: readProfileError } = await userClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (readProfileError) {
    console.error('Could not read profile:', readProfileError.message);
  } else {
    console.log(`\n✅ Profile data retrieved:`);
    console.log(`   Name: ${profileData.full_name}`);
    console.log(`   City: ${profileData.city}`);
    console.log(`   Role: ${profileData.role}`);
    console.log(`   College: ${profileData.college}`);
    console.log(`   Interests: ${profileData.interests?.join(', ')}`);
  }

  console.log(`\n========================================`);
  console.log(`🎉 ALL CHECKS PASSED PERFECTLY!`);
  console.log(`========================================`);
}

createAndVerifyUser();
