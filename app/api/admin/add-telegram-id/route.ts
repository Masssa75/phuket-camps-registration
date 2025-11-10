import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { telegram_id, name } = await request.json()
    
    if (!telegram_id) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 })
    }

    // For now, just log the ID so we can add it manually
    // In a real system, this would add to a database
    console.log(`NEW ADMIN TELEGRAM ID: ${telegram_id} (${name})`)
    
    // TODO: Add to database
    // const supabase = createClient()
    // await supabase.from('admin_users').insert({
    //   telegram_id,
    //   name,
    //   is_active: true,
    //   receive_notifications: true
    // })

    return NextResponse.json({ 
      success: true,
      message: 'Telegram ID logged for admin setup',
      telegram_id
    })
  } catch (error) {
    console.error('Add Telegram ID error:', error)
    return NextResponse.json({ 
      error: 'Failed to add Telegram ID',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}