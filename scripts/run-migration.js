/**
 * Run SQL migration against Supabase
 * Usage: node scripts/run-migration.js
 */

const fs = require('fs');
const path = require('path');

// Load env vars
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251202_add_toddler_classes.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Running migration against:', SUPABASE_URL);
  console.log('SQL length:', sql.length, 'characters');

  // Split into statements (handle complex SQL with functions)
  // We'll send the whole thing as one transaction

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ sql })
  });

  if (!response.ok) {
    // Try alternate approach - use pg directly via database URL
    console.log('RPC not available, trying direct SQL execution...');

    // Use the Supabase SQL endpoint
    const sqlResponse = await fetch(`${SUPABASE_URL}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!sqlResponse.ok) {
      const text = await sqlResponse.text();
      console.error('Error:', text);
      console.log('\nPlease run the migration manually in Supabase Dashboard > SQL Editor');
      console.log('Migration file:', migrationPath);
      return;
    }

    const result = await sqlResponse.json();
    console.log('Migration result:', result);
    return;
  }

  const result = await response.json();
  console.log('Migration completed:', result);
}

runMigration().catch(console.error);
