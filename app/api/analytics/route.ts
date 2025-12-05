import { NextResponse } from 'next/server'
import { getPageViews, getTopPages, getTrafficSources, getConversionEvents, getOverallStats, getRetentionBySource } from '@/lib/analytics'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'overview'

  try {
    let data

    switch (type) {
      case 'pageviews':
        data = await getPageViews()
        break
      case 'toppages':
        data = await getTopPages()
        break
      case 'traffic':
        data = await getTrafficSources()
        break
      case 'conversions':
        data = await getConversionEvents()
        break
      case 'overview':
        data = await getOverallStats()
        break
      case 'retention':
        data = await getRetentionBySource()
        break
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
