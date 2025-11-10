const { webkit } = require('playwright');

(async () => {
  console.log('🧪 Testing Safari form submission...\n');

  const browser = await webkit.launch({
    headless: false,
    slowMo: 500
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
  });
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('🖥️  Browser:', msg.text()));

  // Listen for errors
  page.on('pageerror', error => console.error('❌ Page Error:', error.message));

  try {
    console.log('1️⃣  Navigating to registration page...');
    await page.goto('https://phuketcamp.com/register?camp=christmas-2025', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('2️⃣  Filling parent contact info...');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="parentName1"]', 'Test Parent');
    await page.fill('input[name="mobilePhone1"]', '+66123456789');

    console.log('3️⃣  Filling emergency contact...');
    await page.fill('input[name="emergencyContactName"]', 'Emergency Contact');
    await page.fill('input[name="emergencyContactPhone"]', '+66987654321');

    console.log('4️⃣  Adding a child...');
    await page.click('button:has-text("Add Child")');
    await page.waitForTimeout(1000);

    // Select Mini Camp program
    console.log('5️⃣  Selecting program...');
    await page.click('button:has-text("Mini Camp")');
    await page.waitForTimeout(1000);

    // Select Week 1
    console.log('6️⃣  Selecting week...');
    await page.click('button:has-text("Week 1")');
    await page.waitForTimeout(500);

    // Fill child info
    console.log('7️⃣  Filling child info...');
    await page.fill('input[name="childName"]', 'Test Child');
    await page.fill('input[name="nickName"]', 'Testy');
    await page.selectOption('select[name="gender"]', 'Boy');
    await page.fill('input[name="dateOfBirth"]', '2018-05-15');

    // Fill school info
    await page.fill('input[name="currentSchool"]', 'Test School');
    await page.fill('input[name="nationalityLanguage"]', 'English');
    await page.selectOption('select[name="englishLevel"]', 'fluent');

    // Fill health info
    await page.fill('textarea[name="allergies"]', 'None');

    // Check required checkboxes
    await page.check('input[name="hasInsurance"]');
    await page.check('input[name="behavioralDeclaration"]');

    console.log('8️⃣  Saving child...');
    await page.click('button:has-text("Save Child")');
    await page.waitForTimeout(1000);

    // Close the success modal
    console.log('8️⃣b  Closing success modal...');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Fill permissions
    console.log('9️⃣  Filling permissions...');
    await page.fill('input[name="howDidYouFind"]', 'Google');
    await page.check('input[name="photoPermission"]');
    await page.check('input[name="termsAcknowledged"]');
    await page.check('input[name="allStatementsTrue"]');

    console.log('🔟 Submitting form...');

    // Take screenshot before submit
    await page.screenshot({ path: 'before-submit.png', fullPage: true });
    console.log('📸 Screenshot saved: before-submit.png');

    await page.click('button[type="submit"]');

    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(5000);

    // Take screenshot after submit
    await page.screenshot({ path: 'after-submit.png', fullPage: true });
    console.log('📸 Screenshot saved: after-submit.png');

    // Check what's on the page
    const bodyText = await page.textContent('body');
    console.log('\n📄 Page content length:', bodyText.length);
    console.log('📄 First 200 chars:', bodyText.substring(0, 200));

    // Check for success indicators
    const hasSuccessText = await page.locator('text=Registration Successful').count();
    console.log('✅ Success text found:', hasSuccessText > 0);

    const hasGreenHeader = await page.locator('.bg-green-600').count();
    console.log('🟢 Green header found:', hasGreenHeader > 0);

    // Get computed background color
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log('🎨 Body background color:', bgColor);

    console.log('\n✅ Test complete! Check screenshots for visual confirmation.');
    console.log('Browser will stay open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('📸 Error screenshot saved');
  } finally {
    await browser.close();
  }
})();
