import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Environment check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set')
    
    // Try to import and use Supabase client
    const { createClient } = await import('@/utils/supabase/server')
    const supabase = createClient()
    
    console.log('Supabase client created successfully')
    
    // Try a simple query
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      envVars: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
        key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set'
      },
      sampleData: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}