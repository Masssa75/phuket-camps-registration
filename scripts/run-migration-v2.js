/**
 * Run SQL migration using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('Running toddler classes migration...\n');

  // We'll run each statement separately
  const statements = [
    // 1. Create toddler_sessions table
    `CREATE TABLE IF NOT EXISTS toddler_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_date DATE NOT NULL,
      session_time TIME DEFAULT '10:00',
      capacity INTEGER DEFAULT 15,
      current_bookings INTEGER DEFAULT 0,
      status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled')),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 2. Create toddler_registrations table
    `CREATE TABLE IF NOT EXISTS toddler_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      parent_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      is_returning BOOLEAN DEFAULT false,
      how_did_you_find TEXT,
      package_type TEXT NOT NULL CHECK (package_type IN ('single', 'bundle')),
      sessions_purchased INTEGER NOT NULL,
      sessions_remaining INTEGER NOT NULL,
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
      payment_amount DECIMAL(10,2),
      payment_date TIMESTAMPTZ,
      payment_method TEXT,
      payment_reference TEXT,
      photo_permission BOOLEAN DEFAULT false,
      terms_acknowledged BOOLEAN DEFAULT false,
      admin_notes TEXT
    )`,

    // 3. Create toddler_children table
    `CREATE TABLE IF NOT EXISTS toddler_children (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id UUID NOT NULL REFERENCES toddler_registrations(id) ON DELETE CASCADE,
      child_name TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      gender TEXT CHECK (gender IN ('Boy', 'Girl')),
      nationality TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // 4. Create toddler_session_bookings table
    `CREATE TABLE IF NOT EXISTS toddler_session_bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      registration_id UUID NOT NULL REFERENCES toddler_registrations(id) ON DELETE CASCADE,
      session_id UUID NOT NULL REFERENCES toddler_sessions(id) ON DELETE CASCADE,
      attended BOOLEAN DEFAULT false,
      attended_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(registration_id, session_id)
    )`
  ];

  for (let i = 0; i < statements.length; i++) {
    console.log(`Running statement ${i + 1}/${statements.length}...`);
    const { error } = await supabase.rpc('exec_sql', { sql: statements[i] });
    if (error) {
      // Try direct insert if rpc doesn't exist
      console.log(`  RPC failed, this is expected. Error: ${error.message}`);
    } else {
      console.log(`  ✓ Statement ${i + 1} completed`);
    }
  }

  // Try creating tables via the REST API by inserting test data
  console.log('\nVerifying tables exist by checking for toddler_sessions...');

  const { data, error: selectError } = await supabase
    .from('toddler_sessions')
    .select('id')
    .limit(1);

  if (selectError) {
    console.log('Tables do not exist yet. Please run the migration SQL manually in Supabase Dashboard.');
    console.log('\nSQL file location:', path.join(__dirname, '../supabase/migrations/20251202_add_toddler_classes.sql'));
    console.log('\nOpen: https://supabase.com/dashboard/project/xunccqdrybxpwcvafvag/sql/new');
  } else {
    console.log('✓ Tables exist!');

    // Seed sessions if empty
    console.log('\nChecking if sessions need to be seeded...');
    const { count } = await supabase
      .from('toddler_sessions')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      console.log('Seeding sessions for next 3 months...');

      const sessions = [];
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday or Thursday
          sessions.push({
            session_date: d.toISOString().split('T')[0],
            session_time: '10:00',
            capacity: 15,
            current_bookings: 0,
            status: 'open'
          });
        }
      }

      const { error: insertError } = await supabase
        .from('toddler_sessions')
        .insert(sessions);

      if (insertError) {
        console.log('Failed to seed sessions:', insertError.message);
      } else {
        console.log(`✓ Seeded ${sessions.length} sessions`);
      }
    } else {
      console.log(`✓ ${count} sessions already exist`);
    }
  }

  console.log('\nDone!');
}

runMigration().catch(console.error);
