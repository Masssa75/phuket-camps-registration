const { webkit } = require('playwright');

(async () => {
  console.log('🧪 Testing Safari unmount/remount behavior...\n');

  const browser = await webkit.launch({
    headless: false,
    slowMo: 100
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Track all lifecycle events
  const events = [];

  page.on('console', msg => {
    const text = msg.text();
    console.log('🖥️  Browser:', text);
    events.push({ time: Date.now(), type: 'log', text });

    // Look for unmount
    if (text.includes('💀') || text.includes('unmounting')) {
      console.log('⚠️  ⚠️  ⚠️  UNMOUNT DETECTED! ⚠️  ⚠️  ⚠️');
    }

    // Look for mount
    if (text.includes('🚀') && text.includes('mounted')) {
      console.log('✨ Component mounted');
    }
  });

  // Track page navigations
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      const url = frame.url();
      console.log('🔀 Navigation:', url);
      events.push({ time: Date.now(), type: 'navigate', url });
    }
  });

  try {
    console.log('1️⃣  Navigating to registration page...');
    await page.goto('https://phuketcamp.com/register?camp=christmas-2025', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('2️⃣  Filling form...');
    await page.fill('input[name="email"]', 'unmount-test@example.com');
    await page.fill('input[name="parentName1"]', 'Unmount Test');
    await page.fill('input[name="mobilePhone1"]', '+66999999999');
    await page.fill('input[name="emergencyContactName"]', 'Emergency');
    await page.fill('input[name="emergencyContactPhone"]', '+66888888888');

    console.log('3️⃣  Adding child...');
    await page.click('button:has-text("Add Child")');
    await page.waitForTimeout(1000);

    await page.click('button:has-text("Mini Camp")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Week 1")');
    await page.waitForTimeout(500);

    await page.fill('input[name="childName"]', 'Test Child');
    await page.fill('input[name="nickName"]', 'Testy');
    await page.selectOption('select[name="gender"]', 'Boy');
    await page.fill('input[name="dateOfBirth"]', '2018-05-15');
    await page.fill('input[name="currentSchool"]', 'Test School');
    await page.fill('input[name="nationalityLanguage"]', 'English');
    await page.selectOption('select[name="englishLevel"]', 'fluent');
    await page.fill('textarea[name="allergies"]', 'None');
    await page.check('input[name="hasInsurance"]');
    await page.check('input[name="behavioralDeclaration"]');

    console.log('4️⃣  Saving child...');
    await page.click('button:has-text("Save Child")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    console.log('5️⃣  Filling permissions...');
    await page.fill('input[name="howDidYouFind"]', 'Google');
    await page.check('input[name="photoPermission"]');
    await page.check('input[name="termsAcknowledged"]');
    await page.check('input[name="allStatementsTrue"]');

    console.log('6️⃣  Taking before screenshot...');
    await page.screenshot({ path: 'unmount-before.png', fullPage: true });

    console.log('7️⃣  Submitting form...');
    console.log('\n⏱️  Watching for unmount/remount events for 10 seconds...\n');

    await page.click('button[type="submit"]');

    // Wait and watch for 10 seconds
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000);
      console.log(`⏰ ${i + 1}s elapsed...`);

      // Take screenshots at key moments
      if (i === 0) await page.screenshot({ path: 'unmount-1s.png', fullPage: true });
      if (i === 2) await page.screenshot({ path: 'unmount-3s.png', fullPage: true });
      if (i === 5) await page.screenshot({ path: 'unmount-6s.png', fullPage: true });
    }

    console.log('\n📸 Taking final screenshot...');
    await page.screenshot({ path: 'unmount-final.png', fullPage: true });

    // Check what's visible
    const hasSuccess = await page.locator('text=Registration Successful').count();
    console.log('\n✅ Success text visible:', hasSuccess > 0);

    // Analyze events
    console.log('\n📊 Event Timeline:');
    const startTime = events[0]?.time || Date.now();
    events.forEach(event => {
      const elapsed = event.time - startTime;
      if (event.type === 'navigate') {
        console.log(`  ${elapsed}ms: 🔀 ${event.url}`);
      } else if (event.text.includes('unmounting') || event.text.includes('💀')) {
        console.log(`  ${elapsed}ms: 💀 UNMOUNT`);
      } else if (event.text.includes('mounted') || event.text.includes('🚀')) {
        console.log(`  ${elapsed}ms: 🚀 MOUNT`);
      } else if (event.text.includes('SUCCESS') || event.text.includes('🎉')) {
        console.log(`  ${elapsed}ms: 🎉 SUCCESS STATE SET`);
      } else if (event.text.includes('RENDER') || event.text.includes('🎨')) {
        console.log(`  ${elapsed}ms: 🎨 RENDER`);
      }
    });

    console.log('\n✅ Test complete! Browser staying open for inspection...');
    console.log('Press Ctrl+C to exit\n');

    // Keep browser open
    await page.waitForTimeout(300000); // 5 minutes

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'unmount-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
