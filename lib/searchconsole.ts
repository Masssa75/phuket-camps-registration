import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})

const searchconsole = google.searchconsole({ version: 'v1', auth })

const siteUrl = 'https://phuketcamp.com/' // URL prefix property

export async function getSearchQueries(days: number = 7, limit: number = 20) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dimensions: ['query'],
      rowLimit: limit,
    },
  })

  return response.data.rows || []
}

export async function getSearchQueriesByPage(days: number = 7, limit: number = 20) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dimensions: ['query', 'page'],
      rowLimit: limit,
    },
  })

  return response.data.rows || []
}

export async function getTopPages(days: number = 7, limit: number = 20) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dimensions: ['page'],
      rowLimit: limit,
    },
  })

  return response.data.rows || []
}
