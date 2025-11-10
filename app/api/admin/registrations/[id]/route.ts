import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 })
    }

    // Create server-side client with service role access
    const supabase = createClient()
    
    // First check if registration exists
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    // Delete the registration
    const { error: deleteError } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Error deleting registration:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    
    // TODO: If there are uploaded documents, you might want to delete them from storage
    // This would require deleting files from Supabase Storage if they exist
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}