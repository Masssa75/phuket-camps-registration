import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramMessage, getAdminTelegramIds } from '@/utils/telegram'

// Telegram messages use parse_mode HTML, so user input must be escaped
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, website, formLoadedAt } = await request.json()

    // Bot protection: honeypot field filled, or form submitted in under 3 seconds.
    // Respond with success so bots don't learn they were caught.
    const elapsed = Date.now() - (Number(formLoadedAt) || 0)
    if (website || elapsed < 3000) {
      return NextResponse.json({ success: true })
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message is too long (4000 characters max)' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Store first, notify second — the message survives even if Telegram is down
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        user_agent: request.headers.get('user-agent') || null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Send Telegram notification
    const telegramMessage = `
💬 <b>New message from phuketcamp.com</b>

👤 <b>Name:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}

${escapeHtml(message)}

🕐 ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' })} (Thai time)
    `.trim()

    const adminIds = await getAdminTelegramIds()
    for (const adminId of adminIds) {
      await sendTelegramMessage(adminId, telegramMessage)
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
