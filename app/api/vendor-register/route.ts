import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramMessage, getAdminTelegramIds } from '@/utils/telegram'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, products, markets } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !products) {
      return NextResponse.json(
        { error: 'Name, email, phone, and products are required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Insert into database
    const { data, error } = await supabase
      .from('vendor_registrations')
      .insert({
        name,
        email,
        phone,
        products,
        markets: markets || []
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save registration' },
        { status: 500 }
      )
    }

    // Send Telegram notification
    const marketsList = markets && markets.length > 0
      ? markets.map((m: string) => m === 'christmas-2025' ? 'Christmas 2025' : 'Easter 2026').join(', ')
      : 'Not specified'

    const message = `
🛍️ <b>New Market Vendor Registration!</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🛒 <b>Products:</b> ${products}
🎯 <b>Markets:</b> ${marketsList}
🕐 <b>Registered:</b> ${new Date().toLocaleString()}
    `.trim()

    const adminIds = await getAdminTelegramIds()
    for (const adminId of adminIds) {
      await sendTelegramMessage(adminId, message)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Vendor registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
