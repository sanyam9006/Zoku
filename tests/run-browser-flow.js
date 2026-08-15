const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runBrowserTests() {
  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('\n--- 1. Testing Login Page & 1-Click Admin Login ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '1-login-initial.png') });
  console.log('📸 Saved screenshot: 1-login-initial.png');

  // Click [🛡️ Admin] button
  console.log('Clicking [🛡️ Admin] 1-Click button...');
  await page.click('button:has-text("Admin")');
  await page.waitForURL('**/admin', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '2-admin-dashboard.png') });
  console.log(`📸 Admin URL: ${page.url()}`);
  console.log('📸 Saved screenshot: 2-admin-dashboard.png');

  console.log('\n--- 2. Testing Owner Dashboard Login ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Owner")');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '3-owner-dashboard.png') });
  console.log(`📸 Owner URL: ${page.url()}`);
  console.log('📸 Saved screenshot: 3-owner-dashboard.png');

  console.log('\n--- 3. Testing User Login with Credentials (sanyam@zoku.app) ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'sanyam@zoku.app');
  await page.fill('input[type="password"]', 'Password123!');
  await page.screenshot({ path: path.join(screenshotDir, '4-login-filled.png') });
  
  await page.click('button[type="submit"]:has-text("Sign In")');
  await page.waitForURL('**/profile', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '5-profile-page.png') });
  console.log(`📸 Profile URL: ${page.url()}`);
  console.log('📸 Saved screenshot: 5-profile-page.png');

  console.log('\n--- 4. Testing Signup Page Flow ---');
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
  const uniqueEmail = `traveler_${Date.now()}@gmail.com`;
  await page.fill('input[placeholder="Your name"]', 'Test Traveler');
  await page.fill('input[placeholder="you@example.com"]', uniqueEmail);
  await page.fill('input[placeholder="••••••••"]', 'Password123!');
  await page.screenshot({ path: path.join(screenshotDir, '6-signup-filled.png') });

  await page.click('button[type="submit"]:has-text("Create Account")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotDir, '7-signup-result.png') });
  console.log(`📸 Signup Result URL: ${page.url()}`);
  console.log('📸 Saved screenshot: 7-signup-result.png');

  await browser.close();
  console.log('\n🎉 ALL BROWSER E2E TESTS COMPLETED PERFECTLY!');
}

runBrowserTests().catch(err => {
  console.error('❌ Browser test failed:', err);
  process.exit(1);
});
