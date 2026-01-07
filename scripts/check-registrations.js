#!/usr/bin/env node
/**
 * Registration Attribution Script for phuketcamp.com
 * Shows recent camp registrations with traffic source attribution
 *
 * Usage: node scripts/check-registrations.js [days]
 * Example: node scripts/check-registrations.js 7
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '../../.env', override: false })

const { createClient } = require('@supabase/supabase-js')

const days = parseInt(process.argv[2]) || 7

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function getSourceDisplay(reg) {
  // Priority: UTM params > inferred from referrer > self-reported
  if (reg.utm_source) {
    const parts = [reg.utm_source]
    if (reg.utm_medium) parts.push(reg.utm_medium)
    if (reg.utm_campaign) parts.push(`campaign:${reg.utm_campaign}`)
    return parts.join(' / ')
  }

  if (reg.referrer) {
    try {
      const url = new URL(reg.referrer)
      return `referrer: ${url.hostname}`
    } catch {
      return `referrer: ${reg.referrer.substring(0, 50)}`
    }
  }

  if (reg.how_did_you_find) {
    return `self-reported: ${reg.how_did_you_find}`
  }

  return 'direct (no referrer)'
}

function getCountryFromPhone(phone) {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('+86') || cleaned.startsWith('86')) return 'China'
  if (cleaned.startsWith('+7') || cleaned.startsWith('7')) return 'Russia'
  if (cleaned.startsWith('+66') || cleaned.startsWith('66')) return 'Thailand'
  if (cleaned.startsWith('+1')) return 'USA/Canada'
  if (cleaned.startsWith('+44')) return 'UK'
  if (cleaned.startsWith('+61')) return 'Australia'
  if (cleaned.startsWith('+33')) return 'France'
  if (cleaned.startsWith('+49')) return 'Germany'
  return null
}

function getCountryFromEmail(email) {
  const domain = email?.split('@')[1]?.toLowerCase()
  const countryDomains = {
    'qq.com': 'China', '163.com': 'China', '126.com': 'China', 'sina.com': 'China',
    'mail.ru': 'Russia', 'yandex.ru': 'Russia', 'yandex.com': 'Russia',
    'naver.com': 'South Korea', 'daum.net': 'South Korea',
    'yahoo.co.jp': 'Japan',
  }
  return countryDomains[domain] || null
}

async function main() {
  console.log(`\n🏕️  Camp Registrations (Last ${days} days)\n`)
  console.log('='.repeat(70))

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: registrations, error } = await supabase
    .from('registrations')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  if (!registrations?.length) {
    console.log('\n  No registrations in this period\n')
    return
  }

  // Group by email (family registrations)
  const byFamily = {}
  for (const reg of registrations) {
    if (!byFamily[reg.email]) {
      byFamily[reg.email] = []
    }
    byFamily[reg.email].push(reg)
  }

  // Summary stats
  const sourceCounts = {}
  for (const reg of registrations) {
    const source = reg.utm_source || (reg.referrer ? 'referrer' : 'direct')
    sourceCounts[source] = (sourceCounts[source] || 0) + 1
  }

  // Display each family
  for (const [email, regs] of Object.entries(byFamily)) {
    const first = regs[0]
    const country = getCountryFromPhone(first.mobile_phone_1) || getCountryFromEmail(email) || 'Unknown'
    const children = regs.map(r => r.child_name).join(', ')

    console.log(`\n👨‍👩‍👧 ${first.parent_name_1} <${email}>`)
    console.log(`   📍 Likely from: ${country}`)
    console.log(`   📅 Registered: ${formatDate(first.created_at)}`)
    console.log(`   👶 Children: ${children} (${regs.length})`)
    console.log(`   🏕️  Camp: ${first.camp_id}`)
    console.log(`   📱 Phone: ${first.mobile_phone_1 || 'N/A'}`)
    console.log(`   🔗 Source: ${getSourceDisplay(first)}`)

    if (first.landing_page && first.landing_page !== '/register') {
      console.log(`   📄 Landing: ${first.landing_page}`)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log(`\n📊 SUMMARY`)
  console.log(`   Total registrations: ${registrations.length}`)
  console.log(`   Unique families: ${Object.keys(byFamily).length}`)
  console.log(`\n📈 TRAFFIC SOURCES:`)
  for (const [source, count] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / registrations.length) * 100).toFixed(0)
    console.log(`   ${source}: ${count} (${pct}%)`)
  }

  console.log('')
}

main()
