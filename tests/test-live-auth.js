const { createClient } = require('@supabase/supabase-js');

const url = 'https://ivnfjdwtavfreibijwxf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmZqZHd0YXZmcmVpYmlqd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjU1NTIsImV4cCI6MjA4OTMwMTU1Mn0.xfEGgvnXbjVAlCw50re8TqHM8l4m2alOaML3GoZH_kU';

const supabase = createClient(url, key);

async function testAuth() {
  const testEmail = `testuser_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  console.log('Testing SignUp for:', testEmail);
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test User',
        city: 'Bangalore',
        role: 'user',
      },
    },
  });

  if (signupError) {
    console.error('SignUp Error:', signupError);
  } else {
    console.log('SignUp Success!');
    console.log('User ID:', signupData.user?.id);
    console.log('Session exists?:', Boolean(signupData.session));
    console.log('Identities:', signupData.user?.identities);
  }

  console.log('\nTesting SignIn...');
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signinError) {
    console.error('SignIn Error:', signinError);
  } else {
    console.log('SignIn Success! User logged in successfully:', signinData.user?.email);
  }
}

testAuth();
