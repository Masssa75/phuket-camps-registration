import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Send Telegram notification
async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (err) {
    console.error('Telegram notification failed:', err)
  }
}

/**
 * POST /api/toddler/update-bookings
 * Update bookings for a returning family (add new, cancel existing)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrationId, newSessionIds, cancelSessionIds, childIds } = body

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      )
    }

    // Get registration details for notification
    const { data: registration } = await supabase
      .from('toddler_registrations')
      .select('parent_name, email')
      .eq('id', registrationId)
      .single()

    const results = {
      booked: 0,
      cancelled: 0
    }

    // Cancel sessions (delete from bookings)
    if (cancelSessionIds && cancelSessionIds.length > 0) {
      const { data: cancelled, error: cancelError } = await supabase
        .from('toddler_session_bookings')
        .delete()
        .eq('registration_id', registrationId)
        .in('session_id', cancelSessionIds)
        .select()

      if (cancelError) {
        console.error('Error cancelling sessions:', cancelError)
      } else {
        results.cancelled = cancelled?.length || 0

        // Increment sessions_remaining for each cancelled session
        if (results.cancelled > 0) {
          // Get current sessions_remaining
          const { data: reg } = await supabase
            .from('toddler_registrations')
            .select('sessions_remaining')
            .eq('id', registrationId)
            .single()

          await supabase
            .from('toddler_registrations')
            .update({ sessions_remaining: (reg?.sessions_remaining || 0) + results.cancelled })
            .eq('id', registrationId)

          // Decrement current_bookings for each cancelled session
          for (const sessionId of cancelSessionIds) {
            const { data: sess } = await supabase
              .from('toddler_sessions')
              .select('current_bookings')
              .eq('id', sessionId)
              .single()

            await supabase
              .from('toddler_sessions')
              .update({ current_bookings: Math.max(0, (sess?.current_bookings || 0) - 1) })
              .eq('id', sessionId)
          }
        }
      }
    }

    // Book new sessions
    if (newSessionIds && newSessionIds.length > 0) {
      // Get child IDs for this registration
      const childIdList = childIds || []

      // If no children specified, get all children for this registration
      let actualChildIds = childIdList
      if (actualChildIds.length === 0) {
        const { data: children } = await supabase
          .from('toddler_children')
          .select('id')
          .eq('registration_id', registrationId)

        actualChildIds = children?.map(c => c.id) || []
      }

      // Create bookings
      const bookings = newSessionIds.map((sessionId: string) => ({
        registration_id: registrationId,
        session_id: sessionId,
        child_id: actualChildIds[0] || null // Use first child if available
      }))

      const { data: booked, error: bookError } = await supabase
        .from('toddler_session_bookings')
        .insert(bookings)
        .select()

      if (bookError) {
        console.error('Error booking sessions:', bookError)
      } else {
        results.booked = booked?.length || 0
      }
    }

    // Get session dates for notification
    let sessionDates: string[] = []
    if (newSessionIds?.length > 0 || cancelSessionIds?.length > 0) {
      const allSessionIds = [...(newSessionIds || []), ...(cancelSessionIds || [])]
      const { data: sessions } = await supabase
        .from('toddler_sessions')
        .select('session_date')
        .in('id', allSessionIds)
        .order('session_date')

      sessionDates = sessions?.map(s => s.session_date) || []
    }

    // Send Telegram notification
    if (results.booked > 0 || results.cancelled > 0) {
      let message = `<b>Toddler Class Update</b>\n\n`
      message += `Parent: ${registration?.parent_name || 'Unknown'}\n`
      message += `Email: ${registration?.email || 'Unknown'}\n\n`

      if (results.booked > 0) {
        message += `<b>New bookings:</b> ${results.booked} session(s)\n`
      }
      if (results.cancelled > 0) {
        message += `<b>Cancelled:</b> ${results.cancelled} session(s)\n`
      }

      await sendTelegramNotification(message)
    }

    return NextResponse.json({
      success: true,
      ...results
    })

  } catch (error) {
    console.error('Error updating bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
