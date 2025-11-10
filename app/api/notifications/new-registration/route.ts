import { NextResponse } from 'next/server'
import { notifyAdminsOfNewRegistration } from '@/utils/telegram'

export async function POST(request: Request) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields
    if (!registrationData.child_name || !registrationData.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Sending notification for new registration:', registrationData.child_name)
    
    // Send Telegram notifications to admins (async, don't wait)
    notifyAdminsOfNewRegistration(registrationData).catch(error => {
      console.error('Failed to send Telegram notifications:', error)
    })

    return NextResponse.json({ success: true, message: 'Notifications sent' })
  } catch (error) {
    console.error('Notification API error:', error)
    return NextResponse.json({ 
      error: 'Failed to send notifications',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}