import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/toddler/sessions
 * Returns upcoming open toddler class sessions
 */
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: sessions, error } = await supabase
      .from('toddler_sessions')
      .select('*')
      .gte('session_date', today)
      .eq('status', 'open')
      .order('session_date', { ascending: true })
      .limit(8)

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error in sessions API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
