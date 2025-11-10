import { NextResponse } from 'next/server'
import { notifyAdminsOfNewRegistration } from '@/utils/telegram'

export async function POST() {
  try {
    console.log('Test notification endpoint called')
    console.log('Environment check:')
    console.log('- TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set')
    console.log('- TELEGRAM_ADMIN_GROUP_ID:', process.env.TELEGRAM_ADMIN_GROUP_ID || 'Not set')
    console.log('- TELEGRAM_ADMIN_IDS:', process.env.TELEGRAM_ADMIN_IDS || 'Not set')

    const testRegistration = {
      child_name: 'Test Child - ' + new Date().toLocaleTimeString(),
      parent_name_1: 'Test Parent',
      email: 'test@example.com',
      age_group: 'mini',
      weeks_selected: [1, 2],
      created_at: new Date().toISOString()
    }

    await notifyAdminsOfNewRegistration(testRegistration)

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification sent',
      env: {
        botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
        groupId: process.env.TELEGRAM_ADMIN_GROUP_ID || 'Not set',
        adminIds: process.env.TELEGRAM_ADMIN_IDS || 'Not set'
      }
    })
  } catch (error) {
    console.error('Test notification error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}