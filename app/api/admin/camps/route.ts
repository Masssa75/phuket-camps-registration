import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: camps, error } = await supabase
      .from('camps')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching camps:', error)
      return NextResponse.json({ error: 'Failed to fetch camps' }, { status: 500 })
    }

    return NextResponse.json({ camps: camps || [] })
  } catch (error) {
    console.error('Error in camps API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
