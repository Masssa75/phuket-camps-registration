import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTelegramMessage, getAdminTelegramIds } from '@/utils/telegram'

// Create Supabase client with service role for full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Child {
  name: string
  dateOfBirth: string
  gender: string
  nationality?: string
}

interface RegistrationData {
  parentName: string
  phone: string
  email: string
  isReturning: boolean
  howDidYouFind?: string
  packageType: 'single' | 'bundle'
  children: Child[]
  sessionIds: string[]
  photoPermission: boolean
  termsAcknowledged: boolean
}

/**
 * POST /api/toddler/register
 * Creates a new toddler class registration
 */
export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json()

    // Validate required fields
    if (!data.parentName || !data.phone || !data.email) {
      return NextResponse.json(
        { error: 'Missing required parent information' },
        { status: 400 }
      )
    }

    if (!data.children || data.children.length === 0) {
      return NextResponse.json(
        { error: 'At least one child is required' },
        { status: 400 }
      )
    }

    if (!data.sessionIds || data.sessionIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one session must be selected' },
        { status: 400 }
      )
    }

    if (!data.termsAcknowledged) {
      return NextResponse.json(
        { error: 'Terms must be acknowledged' },
        { status: 400 }
      )
    }

    // Calculate package details
    const sessionsPurchased = data.packageType === 'bundle' ? 12 : data.sessionIds.length
    const paymentAmount = data.packageType === 'bundle' ? 5000 : data.sessionIds.length * 500

    // 1. Create the registration
    const { data: registration, error: regError } = await supabase
      .from('toddler_registrations')
      .insert({
        parent_name: data.parentName,
        phone: data.phone,
        email: data.email,
        is_returning: data.isReturning,
        how_did_you_find: data.howDidYouFind || null,
        package_type: data.packageType,
        sessions_purchased: sessionsPurchased,
        sessions_remaining: sessionsPurchased,
        payment_status: 'pending',
        payment_amount: paymentAmount,
        photo_permission: data.photoPermission,
        terms_acknowledged: data.termsAcknowledged
      })
      .select()
      .single()

    if (regError) {
      console.error('Error creating registration:', regError)
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      )
    }

    // 2. Add children
    const childrenToInsert = data.children.map(child => ({
      registration_id: registration.id,
      child_name: child.name,
      date_of_birth: child.dateOfBirth,
      gender: child.gender,
      nationality: child.nationality || null
    }))

    const { error: childError } = await supabase
      .from('toddler_children')
      .insert(childrenToInsert)

    if (childError) {
      console.error('Error adding children:', childError)
      // Don't fail the whole registration, log the error
    }

    // 3. Create session bookings
    const bookingsToInsert = data.sessionIds.map(sessionId => ({
      registration_id: registration.id,
      session_id: sessionId
    }))

    const { error: bookingError } = await supabase
      .from('toddler_session_bookings')
      .insert(bookingsToInsert)

    if (bookingError) {
      console.error('Error creating bookings:', bookingError)
      // Don't fail the whole registration, log the error
    }

    // 4. Send Telegram notification (async, don't wait)
    sendToddlerNotification(registration, data.children, data.sessionIds.length)
      .catch(err => console.error('Telegram notification failed:', err))

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        email: registration.email,
        packageType: registration.package_type,
        paymentAmount: registration.payment_amount
      }
    })

  } catch (error) {
    console.error('Error in toddler registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Send Telegram notification to admins
 */
async function sendToddlerNotification(
  registration: { parent_name: string; email: string; package_type: string; payment_amount: number },
  children: Child[],
  sessionCount: number
) {
  const childrenList = children.map(c => `${c.name}`).join(', ')
  const packageDisplay = registration.package_type === 'bundle'
    ? '10+2 Bundle (฿5,000)'
    : `Single Session${sessionCount > 1 ? 's' : ''} (฿${registration.payment_amount})`

  const message = `
👶 <b>New Toddler Class Registration!</b>

👨‍👩‍👦 <b>Parent:</b> ${registration.parent_name}
📧 <b>Email:</b> ${registration.email}
👶 <b>Children:</b> ${childrenList}
📦 <b>Package:</b> ${packageDisplay}
📅 <b>Sessions:</b> ${sessionCount} selected

🔗 <a href="https://phuketcamp.com/admin">View in Admin</a>
  `.trim()

  const adminIds = await getAdminTelegramIds()

  for (const adminId of adminIds) {
    await sendTelegramMessage(adminId, message)
  }
}
