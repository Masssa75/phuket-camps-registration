/**
 * Remove toddler sessions during the holiday break (Dec 13 - Jan 12)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removeHolidaySessions() {
  console.log('Removing toddler sessions during holiday break...\n');

  // Delete sessions between Dec 13, 2025 and Jan 12, 2026
  const { data: deleted, error } = await supabase
    .from('toddler_sessions')
    .delete()
    .gte('session_date', '2025-12-13')
    .lte('session_date', '2026-01-12')
    .select();

  if (error) {
    console.error('Error deleting sessions:', error);
    return;
  }

  console.log(`Deleted ${deleted.length} sessions:`);
  deleted.forEach(s => {
    console.log(`  - ${s.session_date}`);
  });

  // Show remaining sessions
  const { data: remaining } = await supabase
    .from('toddler_sessions')
    .select('session_date')
    .order('session_date', { ascending: true });

  console.log(`\nRemaining ${remaining.length} sessions:`);
  remaining.forEach(s => {
    console.log(`  - ${s.session_date}`);
  });
}

removeHolidaySessions().catch(console.error);
