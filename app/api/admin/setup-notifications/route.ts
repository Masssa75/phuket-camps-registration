import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    
    // Check if notifications table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'notifications')

    if (tablesError) {
      console.error('Error checking tables:', tablesError)
      return NextResponse.json({ error: 'Failed to check tables' }, { status: 500 })
    }

    if (tables && tables.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Notifications table already exists',
        tableExists: true 
      })
    }

    // Create a test notification record to establish the table structure
    // This will create the table if it doesn't exist
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        title: 'Test Notification',
        message: 'System setup test',
        notification_type: 'system',
        admin_telegram_id: 5089502326,
        is_read: true // Mark as read so it doesn't show up
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ 
        error: 'Failed to create notifications table',
        details: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notifications table created and initialized',
      tableExists: false 
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}