import { NextResponse } from 'next/server'
import { getSearchQueries, getSearchQueriesByPage, getTopPages } from '@/lib/searchconsole'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'queries'
  const days = parseInt(searchParams.get('days') || '7')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let data

    switch (type) {
      case 'queries':
        data = await getSearchQueries(days, limit)
        break
      case 'queries-by-page':
        data = await getSearchQueriesByPage(days, limit)
        break
      case 'pages':
        data = await getTopPages(days, limit)
        break
      default:
        return NextResponse.json({ error: 'Invalid type. Use: queries, queries-by-page, or pages' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      meta: {
        type,
        days,
        limit,
        count: data.length
      }
    })
  } catch (error) {
    console.error('Search Console API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Search Console data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
