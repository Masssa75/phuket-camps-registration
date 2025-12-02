import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/toddler/lookup?email=xxx
 * Look up a returning family by email
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the most recent registration for this email
    const { data: registration, error: regError } = await supabase
      .from('toddler_registrations')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (regError || !registration) {
      return NextResponse.json(
        { found: false, message: 'No registration found for this email' },
        { status: 200 }
      )
    }

    // Get children for this registration
    const { data: children } = await supabase
      .from('toddler_children')
      .select('*')
      .eq('registration_id', registration.id)

    // Get their session balance
    const sessionsRemaining = registration.sessions_remaining || 0

    return NextResponse.json({
      found: true,
      registration: {
        parentName: registration.parent_name,
        phone: registration.phone,
        email: registration.email,
        sessionsRemaining,
        packageType: registration.package_type
      },
      children: children?.map(c => ({
        name: c.child_name,
        dateOfBirth: c.date_of_birth,
        gender: c.gender,
        nationality: c.nationality
      })) || []
    })

  } catch (error) {
    console.error('Error in lookup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
