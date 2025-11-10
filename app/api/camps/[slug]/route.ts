import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const supabase = await createClient()

    const { data: camp, error } = await supabase
      .from('camps')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching camp:', error)
      return NextResponse.json({ error: 'Camp not found' }, { status: 404 })
    }

    return NextResponse.json({ camp })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
