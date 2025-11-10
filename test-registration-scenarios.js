const { webkit } = require('playwright');

// Test scenarios based on Winter Camp 2025 real data patterns
const scenarios = [
  {
    name: 'Single child - Mini Camp - Multiple weeks (like Kaitlyn)',
    parent: {
      email: 'test-kaitlyn@example.com',
      name: 'Demi Parent',
      phone: '+66834467727'
    },
    emergency: {
      name: 'Leo Emergency',
      phone: '+66834467727'
    },
    children: [
      {
        name: 'Kaitlyn Test',
        nickname: 'Katie',
        gender: 'Girl',
        dob: '2019-01-15',
        program: 'mini',
        weeks: [1, 2], // Christmas has only 2 weeks
        school: 'International School',
        nationality: 'English',
        englishLevel: 'native',
        allergies: 'None'
      }
    ]
  },
  {
    name: 'Single child - Maxi Camp - Single week (like Roy)',
    parent: {
      email: 'test-roy@example.com',
      name: 'Ruoyi Parent',
      phone: '+66812345678'
    },
    emergency: {
      name: 'Emergency Contact',
      phone: '+66887654321'
    },
    children: [
      {
        name: 'Roy Test',
        nickname: 'Roy',
        gender: 'Boy',
        dob: '2016-05-20',
        program: 'maxi',
        weeks: [1],
        school: 'Phuket International',
        nationality: 'Chinese',
        englishLevel: 'fluent',
        allergies: 'None'
      }
    ]
  },
  {
    name: 'Multiple children - Same family - Different programs (Siblings)',
    parent: {
      email: 'test-siblings@example.com',
      name: 'Wang Parent',
      phone: '+66898765432'
    },
    emergency: {
      name: 'Emergency Wang',
      phone: '+66898765432'
    },
    children: [
      {
        name: 'Mia Wang',
        nickname: 'Mia',
        gender: 'Girl',
        dob: '2019-03-10',
        program: 'mini',
        weeks: [1, 2],
        school: 'Local School',
        nationality: 'Chinese',
        englishLevel: 'intermediate',
        allergies: 'None'
      },
      {
        name: 'Yoyo Wang',
        nickname: 'Yoyo',
        gender: 'Girl',
        dob: '2020-06-15',
        program: 'mini',
        weeks: [1],
        school: 'Kindergarten',
        nationality: 'Chinese',
        englishLevel: 'beginner',
        allergies: 'None'
      }
    ]
  },
  {
    name: 'Child with allergies (Edge case)',
    parent: {
      email: 'test-allergies@example.com',
      name: 'Cautious Parent',
      phone: '+66891111111'
    },
    emergency: {
      name: 'Emergency Allergy',
      phone: '+66892222222'
    },
    children: [
      {
        name: 'Allergic Child',
        nickname: 'Ally',
        gender: 'Boy',
        dob: '2018-09-25',
        program: 'mini',
        weeks: [1, 2],
        school: 'Test School',
        nationality: 'Thai',
        englishLevel: 'fluent',
        allergies: 'Peanuts, shellfish, dairy'
      }
    ]
  },
  {
    name: 'Young child - Mini Camp - All weeks',
    parent: {
      email: 'test-fullcamp@example.com',
      name: 'Committed Parent',
      phone: '+66893333333'
    },
    emergency: {
      name: 'Emergency Full',
      phone: '+66894444444'
    },
    children: [
      {
        name: 'Full Camp Kid',
        nickname: 'Camper',
        gender: 'Boy',
        dob: '2020-12-01',
        program: 'mini',
        weeks: [1, 2], // Both available weeks
        school: 'Preschool',
        nationality: 'English',
        englishLevel: 'native',
        allergies: 'None'
      }
    ]
  }
];

async function runScenarioTest(scenario, browser) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TESTING: ${scenario.name}`);
  console.log('='.repeat(80));

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    if (text.includes('🚀') || text.includes('✅') || text.includes('❌') ||
        text.includes('🎉') || text.includes('🔄')) {
      console.log('  ', text);
    }
  });

  try {
    console.log(`\n1️⃣  Navigating to registration...`);
    await page.goto('https://phuketcamp.com/register?camp=christmas-2025', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log(`2️⃣  Filling parent info...`);
    await page.fill('input[name="email"]', scenario.parent.email);
    await page.fill('input[name="parentName1"]', scenario.parent.name);
    await page.fill('input[name="mobilePhone1"]', scenario.parent.phone);
    await page.fill('input[name="emergencyContactName"]', scenario.emergency.name);
    await page.fill('input[name="emergencyContactPhone"]', scenario.emergency.phone);

    console.log(`3️⃣  Adding ${scenario.children.length} child(ren)...`);

    for (let i = 0; i < scenario.children.length; i++) {
      const child = scenario.children[i];
      console.log(`    Adding child ${i + 1}: ${child.name}`);

      await page.click('button:has-text("Add Child")');
      await page.waitForTimeout(1000);

      // Select program
      const programName = child.program === 'mini' ? 'Mini Camp' : 'Maxi Camp';
      await page.click(`button:has-text("${programName}")`);
      await page.waitForTimeout(500);

      // Select weeks
      for (const week of child.weeks) {
        await page.click(`button:has-text("Week ${week}")`);
        await page.waitForTimeout(300);
      }

      // Fill child info
      await page.fill('input[name="childName"]', child.name);
      await page.fill('input[name="nickName"]', child.nickname);
      await page.selectOption('select[name="gender"]', child.gender);
      await page.fill('input[name="dateOfBirth"]', child.dob);
      await page.fill('input[name="currentSchool"]', child.school);
      await page.fill('input[name="nationalityLanguage"]', child.nationality);
      await page.selectOption('select[name="englishLevel"]', child.englishLevel);
      await page.fill('textarea[name="allergies"]', child.allergies);
      await page.check('input[name="hasInsurance"]');
      await page.check('input[name="behavioralDeclaration"]');

      await page.click('button:has-text("Save Child")');
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(1000);
    }

    console.log(`4️⃣  Filling permissions...`);
    await page.fill('input[name="howDidYouFind"]', 'Test scenario');
    await page.check('input[name="photoPermission"]');
    await page.check('input[name="termsAcknowledged"]');
    await page.check('input[name="allStatementsTrue"]');

    console.log(`5️⃣  Submitting form...`);
    await page.click('button[type="submit"]');

    // Wait for success
    await page.waitForTimeout(3000);

    const hasSuccess = await page.locator('text=Registration Successful').count();

    if (hasSuccess > 0) {
      console.log(`\n✅ SUCCESS: ${scenario.name}`);
      console.log(`   Registered ${scenario.children.length} child(ren)`);
      return { success: true, scenario: scenario.name };
    } else {
      console.log(`\n❌ FAILED: ${scenario.name}`);
      await page.screenshot({ path: `test-fail-${Date.now()}.png` });
      return { success: false, scenario: scenario.name, error: 'Success message not found' };
    }

  } catch (error) {
    console.log(`\n❌ ERROR: ${scenario.name}`);
    console.log(`   ${error.message}`);
    await page.screenshot({ path: `test-error-${Date.now()}.png` });
    return { success: false, scenario: scenario.name, error: error.message };
  } finally {
    await context.close();
  }
}

(async () => {
  console.log('🚀 WINTER CAMP REGISTRATION TEST SUITE');
  console.log('Based on real Winter Camp 2025 attendance data\n');

  const browser = await webkit.launch({
    headless: true
  });

  const results = [];

  for (const scenario of scenarios) {
    const result = await runScenarioTest(scenario, browser);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause between tests
  }

  await browser.close();

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\nTotal scenarios: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  console.log('\nDetailed results:');
  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    console.log(`  ${i + 1}. ${status} ${r.scenario}`);
    if (r.error) console.log(`      Error: ${r.error}`);
  });

  console.log('\n' + '='.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
})();
