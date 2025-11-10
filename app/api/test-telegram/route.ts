import { NextResponse } from 'next/server'
import { sendTelegramMessage } from '@/utils/telegram'

export async function GET() {
  try {
    console.log('Testing Telegram bot...')
    
    // Test with the hardcoded admin ID
    const testChatId = 123456789
    const testMessage = `
🧪 <b>Telegram Bot Test</b>

This is a test message from the Summer Camp registration system.

✅ If you receive this, notifications are working!
🕐 Sent at: ${new Date().toLocaleString()}
    `.trim()

    const success = await sendTelegramMessage(testChatId, testMessage)
    
    return NextResponse.json({ 
      success,
      message: success ? 'Test message sent!' : 'Failed to send test message',
      chatId: testChatId
    })
  } catch (error) {
    console.error('Test Telegram error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}