const XLSX = require('xlsx');
const fs = require('fs');

const filePath = '/Users/marcschwyn/Downloads/Winter camp 2025-Student List.xlsx';

console.log('📊 Reading Excel file...\n');

const workbook = XLSX.readFile(filePath);

console.log(`📑 Found ${workbook.SheetNames.length} sheets:`);
workbook.SheetNames.forEach((name, i) => {
  console.log(`  ${i + 1}. ${name}`);
});

console.log('\n' + '='.repeat(80) + '\n');

// Read each sheet
workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`\n📄 SHEET ${index + 1}: ${sheetName}`);
  console.log('─'.repeat(80));

  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Show first 20 rows
  console.log(`\nTotal rows: ${data.length}\n`);

  if (data.length > 0) {
    // Show headers
    console.log('HEADERS:');
    console.log(data[0]);
    console.log('');

    // Show first few data rows
    const previewRows = Math.min(5, data.length - 1);
    console.log(`SAMPLE DATA (first ${previewRows} rows):`);
    for (let i = 1; i <= previewRows; i++) {
      console.log(`Row ${i}:`, data[i]);
    }
  }

  console.log('\n' + '='.repeat(80));
});

// Save as JSON for easier analysis
const analysis = {};
workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  analysis[sheetName] = XLSX.utils.sheet_to_json(sheet);
});

fs.writeFileSync('winter-camp-data.json', JSON.stringify(analysis, null, 2));
console.log('\n✅ Data saved to winter-camp-data.json');
