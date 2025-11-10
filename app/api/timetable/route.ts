import { createClient } from '@/utils/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'mini'
    
    const key = type === 'explorer' ? 'explorer_timetable' : 'mini_timetable'
    
    const { data, error } = await supabase
      .from('camp_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.error('Error fetching timetable:', error)
      return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 })
    }

    return NextResponse.json({ timetable: data?.value || null })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}