import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export type CampStatus = 'open' | 'upcoming' | 'closed' | 'sold_out'

export interface CampWithStatus {
  id: string
  name: string
  slug: string
  settings: {
    soldOut?: boolean
    programs: Array<{
      id: string
      name: string
      ageRange: string
      description: string
      pricing: {
        earlyBird: number
        regular: number
        earlyBirdDeadline: string
      }
    }>
    weeks: Array<{
      id: number
      name: string
      startDate: string
      endDate: string
    }>
  }
  registration_status: CampStatus
}

function getCampStatus(camp: { settings: { soldOut?: boolean; weeks: Array<{ startDate: string; endDate: string }> } }): CampStatus {
  // Sold-out check takes priority over all date logic
  if (camp.settings.soldOut === true) return 'sold_out'

  const now = new Date()
  const weeks = camp.settings.weeks
  if (!weeks || weeks.length === 0) return 'closed'

  const firstWeekStart = new Date(weeks[0].startDate)
  const lastWeekEnd = new Date(weeks[weeks.length - 1].endDate)

  if (now > lastWeekEnd) return 'closed'
  if (now < firstWeekStart) return 'open' // registration is open before camp starts
  return 'open' // during camp, still allow registration (for drop-in weeks)
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: camps, error } = await supabase
      .from('camps')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching camps:', error)
      return NextResponse.json({ error: 'Failed to fetch camps' }, { status: 500 })
    }

    const campsWithStatus: CampWithStatus[] = (camps || []).map(camp => ({
      ...camp,
      registration_status: getCampStatus(camp),
    }))

    // Sort: open first, then sold_out, then upcoming, then closed
    const statusOrder: Record<CampStatus, number> = { open: 0, sold_out: 1, upcoming: 2, closed: 3 }
    campsWithStatus.sort((a, b) => statusOrder[a.registration_status] - statusOrder[b.registration_status])

    return NextResponse.json({ camps: campsWithStatus })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
