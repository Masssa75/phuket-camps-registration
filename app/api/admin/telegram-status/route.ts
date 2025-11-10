import { NextResponse } from 'next/server'
import { getAdminTelegramIds } from '@/utils/telegram'

export async function POST(request: Request) {
  try {
    const { telegram_id } = await request.json()
    
    if (!telegram_id) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 })
    }

    // Get list of configured admin IDs
    const adminIds = await getAdminTelegramIds()
    const connected = adminIds.includes(telegram_id)

    return NextResponse.json({ 
      connected,
      telegram_id,
      message: connected 
        ? 'Your Telegram ID is configured for notifications' 
        : 'Your Telegram ID is not yet configured for notifications'
    })
  } catch (error) {
    console.error('Telegram status check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}