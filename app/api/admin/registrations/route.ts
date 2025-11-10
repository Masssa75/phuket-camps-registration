import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campId = searchParams.get('campId')

    console.log('Admin registrations API called, campId:', campId)

    // Create server-side client with service role access
    const supabase = createClient()
    console.log('Supabase client created')

    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by camp if campId is provided
    if (campId) {
      query = query.eq('camp_id', campId)
    }

    const { data: registrations, error } = await query

    console.log('Query executed, rows:', registrations?.length, 'error:', error?.message)

    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}