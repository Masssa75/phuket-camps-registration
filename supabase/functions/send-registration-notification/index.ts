// Supabase Edge Function to send Telegram notifications for new registrations
// Triggered automatically by database INSERT on registrations table

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_ADMIN_GROUP_ID = Deno.env.get('TELEGRAM_ADMIN_GROUP_ID')

interface RegistrationPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    child_name: string
    email: string
    age_group: string
    weeks_selected: number[]
    parent_name_1: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    // Parse the webhook payload from Supabase
    const payload: RegistrationPayload = await req.json()

    console.log('Received registration webhook:', payload)

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_GROUP_ID) {
      console.error('Missing Telegram configuration')
      return new Response(
        JSON.stringify({ error: 'Missing Telegram configuration' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Skipping non-INSERT event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const registration = payload.record

    // Format the Telegram message
    const weeksList = registration.weeks_selected.join(', ')
    const campName = registration.camp_name || 'Camp'
    const campType = registration.age_group === 'mini'
      ? 'Mini Camp (3-6)'
      : 'Explorer/Maxi Camp (6+)'
    const isWhatsAppScan = registration.imported_from === 'whatsapp_scan'
    const heading = isWhatsAppScan
      ? `🤖 <b>Auto-detected from WhatsApp — ${campName}</b>\n<i>Created by AI scan — verify details before treating as confirmed</i>`
      : `🏕️ <b>New ${campName} Registration!</b>`

    const message = `
${heading}

👶 <b>Child:</b> ${registration.child_name}
👨‍👩‍👧‍👦 <b>Parent:</b> ${registration.parent_name_1}
📧 <b>Email:</b> ${registration.email}
🎯 <b>Camp:</b> ${campType}
📅 <b>Weeks:</b> ${weeksList}
🕐 <b>Registered:</b> ${new Date(registration.created_at).toLocaleString()}

🔗 <a href="https://phuketsummercamp.com/admin">View in Admin Dashboard</a>
    `.trim()

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_GROUP_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    )

    const telegramResult = await telegramResponse.json()

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult)
      return new Response(
        JSON.stringify({ error: 'Failed to send Telegram message', details: telegramResult }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Telegram notification sent successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-registration-notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
