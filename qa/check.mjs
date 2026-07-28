#!/usr/bin/env node
/**
 * Bamboo Valley production health check.
 *
 *   node qa/check.mjs              # gate (if a deploy is pending) + smoke + browser
 *   node qa/check.mjs --smoke      # HTTP only, ~15s, no browser
 *   node qa/check.mjs --gate       # only wait for Netlify deploys to go 'ready'
 *   node qa/check.mjs --weekly     # adds slow/low-churn checks (TLS, SEO redirects)
 *
 * Design rules learned the hard way — do not undo these:
 *  - Assert BEHAVIOUR, never exact copy. Titles, prices, camp slugs and blog names all
 *    change as a matter of business; tests pinned to them go red on healthy changes and
 *    get muted, which is worse than no tests.
 *  - The deploy gate is scoped to the site whose commit actually moved. Gating all three
 *    on every run makes 2 of 3 fail on every normal single-repo deploy.
 *  - No writes. Nothing here submits a registration, so nothing here can page the staff
 *    Telegram group or land a fake child in the roster. Write-path coverage is deliberately
 *    deferred until an is_test column exists — see qa/README.md.
 *
 * ponytail: one file, zero new dependencies. Playwright is already in this repo.
 */

import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '../../..')            // BambooValley/
const args = process.argv.slice(2)
const only = (f) => args.includes(f)
const runAll = !only('--smoke') && !only('--gate')

// ---------------------------------------------------------------- env
function env(key) {
  for (const p of [join(ROOT, '.env'), join(HERE, '../.env.local')]) {
    if (!existsSync(p)) continue
    const m = readFileSync(p, 'utf8').match(new RegExp(`^${key}=(.*)$`, 'm'))
    if (m) return m[1].trim().replace(/^"|"$/g, '')
  }
  return null
}

const SITES = {
  phuketcamp: { id: '0a76257f-4938-49a9-9739-cfb1fcb4cced', url: 'https://phuketcamp.com',        repo: HERE + '/..' },
  school:     { id: '73f877f0-cc8c-426a-8b5c-69a8a08ea7e4', url: 'https://bamboovalleyphuket.com', repo: join(ROOT, 'Apps/school') },
  summer:     { id: '9720022b-8cdc-44ac-a855-5ec15dd6746b', url: 'https://phuketsummercamp.com',   repo: join(ROOT, 'Apps/summer') },
}

// ---------------------------------------------------------------- harness
let pass = 0, fail = 0, skip = 0
const failures = []

async function check(name, fn) {
  try {
    const note = await fn()
    pass++; console.log(`  ✓ ${name}${note ? ` — ${note}` : ''}`)
  } catch (e) {
    fail++; failures.push([name, e.message])
    console.log(`  ✗ ${name}\n      ${e.message}`)
  }
}
const skipped = (name, why) => { skip++; console.log(`  – ${name} (${why})`) }
function assert(cond, msg) { if (!cond) throw new Error(msg) }

async function get(url, opts = {}) {
  const r = await fetch(url, { redirect: 'manual', headers: { 'cache-control': 'no-cache' }, ...opts })
  const body = r.status === 204 ? '' : await r.text()
  return { status: r.status, body, headers: r.headers, loc: r.headers.get('location') || '' }
}

// ---------------------------------------------------------------- 1. deploy gate
async function deployGate() {
  const tok = env('NETLIFY_AUTH_TOKEN')
  if (!tok) return skipped('deploy gate', 'no NETLIFY_AUTH_TOKEN')
  console.log('\nDEPLOY GATE')

  for (const [name, site] of Object.entries(SITES)) {
    let head
    try {
      head = execSync('git rev-parse HEAD', { cwd: site.repo, encoding: 'utf8' }).trim()
    } catch { skipped(`${name} deploy`, 'not a git repo here'); continue }

    const api = `https://api.netlify.com/api/v1/sites/${site.id}/deploys?per_page=1`
    const first = await (await fetch(api, { headers: { Authorization: `Bearer ${tok}` } })).json()

    // Scope the gate: only wait when THIS site's HEAD is what's deploying. A push to one
    // repo must not make the other two fail.
    if (first[0]?.commit_ref !== head) {
      skipped(`${name} deploy`, `local HEAD not deployed here (${first[0]?.state})`)
      continue
    }

    await check(`${name} deploy is ready`, async () => {
      for (let i = 0; i < 36; i++) {
        const d = (await (await fetch(api, { headers: { Authorization: `Bearer ${tok}` } })).json())[0]
        if (d.state === 'ready') return `${d.commit_ref.slice(0, 7)}`
        if (d.state === 'error') throw new Error(`build FAILED: ${d.error_message} — https://app.netlify.com/sites/${d.name}/deploys/${d.id}`)
        await new Promise(r => setTimeout(r, 10_000))
      }
      throw new Error('still not ready after 6 min')
    })
  }
}

// ---------------------------------------------------------------- 2. smoke (HTTP)
async function smoke() {
  console.log('\nPHUKETCAMP.COM — revenue path')

  await check('/api/camps has a bookable camp with sane pricing', async () => {
    const { status, body, headers } = await get('https://phuketcamp.com/api/camps')
    assert(status === 200, `expected 200, got ${status}`)
    const { camps } = JSON.parse(body)
    const open = camps.filter(c => c.registration_status === 'open')
    assert(open.length >= 1, 'NO camp is open for registration — the funnel is closed')
    for (const c of open) {
      const weeks = c.settings?.weeks ?? []
      assert(weeks.length >= 1, `open camp ${c.slug} has no weeks`)
      for (const [k, p] of Object.entries(c.settings?.programs ?? {})) {
        if (p.earlyBird != null && p.regular != null) {
          assert(p.earlyBird > 0 && p.regular > 0, `${c.slug}/${k} has a zero/negative price`)
          assert(p.earlyBird <= p.regular, `${c.slug}/${k} earlyBird > regular`)
        }
      }
    }
    // parse directives; never byte-compare (the edge strips spaces inconsistently)
    const cc = headers.get('cache-control') || ''
    assert(/max-age=\d+/.test(cc), `no max-age directive: "${cc}"`)
    return `${open.length} open, ${open.map(c => c.slug).join(',')}`
  })

  await check('/api/toddler/sessions has a bookable session', async () => {
    const { status, body } = await get('https://phuketcamp.com/api/toddler/sessions')
    assert(status === 200, `expected 200, got ${status}`)
    const n = (JSON.parse(body).sessions || []).length
    assert(n >= 1, 'ZERO bookable toddler sessions — /register/toddler still advertises booking but nothing can be booked')
    return `${n} sessions`
  })

  await check('no public GET endpoint 5xxs', async () => {
    const paths = ['/', '/zh', '/camps', '/register', '/register/toddler', '/blog', '/contact',
                   '/api/camps', '/api/toddler/sessions', '/sitemap.xml', '/robots.txt']
    const bad = []
    for (const p of paths) {
      const { status } = await get('https://phuketcamp.com' + p)
      if (status >= 500) bad.push(`${p}→${status}`)
    }
    assert(!bad.length, `5xx on: ${bad.join(', ')}`)
    return `${paths.length} routes clean`
  })

  await check('deleted admin/test routes stay gone (no accidental reintroduction)', async () => {
    const gone = ['/api/admin/registrations', '/api/admin/camps', '/api/test-db', '/api/test-telegram']
    const live = []
    for (const p of gone) {
      const { status, body } = await get('https://phuketcamp.com' + p)
      if (status === 200 && body.length > 200) live.push(p)
    }
    assert(!live.length, `PII LEAK REOPENED on: ${live.join(', ')}`)
    return `${gone.length} confirmed removed`
  })

  console.log('\nBAMBOOVALLEYPHUKET.COM — school')

  await check('locale matrix serves the right language', async () => {
    const scripts = { th: /[฀-๿]/, ru: /[Ѐ-ӿ]/, zh: /[一-鿿]/ }
    const root = await get('https://bamboovalleyphuket.com/')
    assert([301, 302, 308].includes(root.status), `/ should redirect, got ${root.status}`)
    for (const l of ['en', 'th', 'ru', 'zh']) {
      const { status, body } = await get(`https://bamboovalleyphuket.com/${l}/`)
      assert(status === 200, `/${l}/ → ${status}`)
      assert(new RegExp(`<html[^>]+lang="${l}"`).test(body), `/${l}/ missing lang="${l}"`)
      if (scripts[l]) assert(scripts[l].test(body), `/${l}/ has no ${l} characters — untranslated?`)
    }
    return '4 locales'
  })

  await check('Meta/WhatsApp legal pages reachable (both slash forms)', async () => {
    for (const p of ['/en/privacy', '/en/terms']) {
      const bare = await get('https://bamboovalleyphuket.com' + p)
      assert([200, 301, 308].includes(bare.status), `${p} → ${bare.status}`)
      const slash = await get('https://bamboovalleyphuket.com' + p + '/')
      assert(slash.status === 200, `${p}/ → ${slash.status}`)
      assert(slash.body.length > 2000, `${p}/ suspiciously short — login wall?`)
    }
    return 'privacy + terms'
  })

  await check('school lead-capture functions are deployed', async () => {
    // 405 = function exists, wrong method. 404 = it did not bundle → every enrolment 500s.
    const fns = ['contact', 'enrollment-submit', 'enrollment-save', 'enrollment-upload', 'teacher-application']
    const missing = []
    for (const f of fns) {
      const { status } = await get(`https://bamboovalleyphuket.com/.netlify/functions/${f}`)
      if (status === 404) missing.push(f)
    }
    assert(!missing.length, `function(s) did not deploy: ${missing.join(', ')}`)
    return `${fns.length} live`
  })

  await check('/en/enroll/ loads', async () => {
    const { status } = await get('https://bamboovalleyphuket.com/en/enroll/')
    assert(status === 200, `→ ${status}`)
  })

  console.log('\nPHUKETSUMMERCAMP.COM — ops + parent payment slips')

  await check('root redirects to the admin login', async () => {
    const { status, loc } = await get('https://phuketsummercamp.com/')
    assert([301, 302, 307, 308].includes(status) && loc.includes('/admin'), `got ${status} → ${loc}`)
  })

  await check('/admin console still serves', async () => {
    const { status, body } = await get('https://phuketsummercamp.com/admin')
    assert(status === 200, `→ ${status}`)
    assert(body.length > 1000, 'admin shell suspiciously small')
  })

  await check('payment-slip route is alive for parents', async () => {
    // Shape check only. NOTE: a 404 here cannot distinguish "no such id" from "RLS broke and
    // every parent link is dead". Upgrade to a seeded QA registration id when one exists.
    const { status } = await get('https://phuketsummercamp.com/payment-slip/00000000-0000-0000-0000-000000000000')
    assert(status < 500, `route is erroring: ${status}`)
    return `responds ${status} (shape only — see README limitation)`
  })

  await check('telegram webhook endpoint is mounted', async () => {
    const { status } = await get('https://phuketsummercamp.com/api/telegram-webhook')
    assert(status !== 404, 'webhook route missing — registrations would stop notifying staff')
    return `${status} (405 expected for GET)`
  })
}

// ---------------------------------------------------------------- 3. browser
async function browser() {
  let chromium
  try { ({ chromium } = await import('playwright')) }
  catch { return skipped('browser tests', 'playwright not installed') }

  console.log('\nBROWSER — the two pages that must render')
  const b = await chromium.launch({ headless: true })
  try {
    await check('homepage hydrates with no page errors', async () => {
      const p = await b.newPage()
      const errs = [], bad = []
      p.on('pageerror', e => errs.push(e.message))
      p.on('response', r => {
        const u = new URL(r.url())
        if (r.status() >= 500) bad.push(`${r.status()} ${u.pathname}`)
        else if (r.status() >= 400 && u.host === 'phuketcamp.com') bad.push(`${r.status()} ${u.pathname}`)
      })
      // NOT networkidle: the hero video streams continuously so the network never goes idle
      // and this times out against a perfectly healthy page. Wait for real content instead.
      await p.goto('https://phuketcamp.com/', { waitUntil: 'domcontentloaded', timeout: 45_000 })
      // state:'attached' — a <script> tag is never "visible", the default wait never resolves
      await p.waitForSelector('script[type="application/ld+json"]', { state: 'attached', timeout: 20_000 })
      await p.waitForLoadState('load', { timeout: 30_000 }).catch(() => {})
      const ld = await p.$$eval('script[type="application/ld+json"]', ns => ns.map(n => n.textContent))
      for (const block of ld) JSON.parse(block)      // throws if malformed
      const zh = await p.$('link[hreflang="zh"], a[href*="/zh"]')
      await p.close()
      assert(!errs.length, `JS errors: ${errs.slice(0, 2).join(' | ')}`)
      assert(!bad.length, `bad responses: ${bad.slice(0, 3).join(', ')}`)
      assert(zh, 'no zh link — Chinese routing may have regressed')
      return `${ld.length} JSON-LD blocks valid`
    })

    await check('/register funnel is actually enterable', async () => {
      const p = await b.newPage()
      await p.goto('https://phuketcamp.com/register', { waitUntil: 'domcontentloaded', timeout: 45_000 })
      await p.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 20_000 })
        .catch(() => { throw new Error('page stuck on "Loading..." — /api/camps likely failing') })
      // wait for the controls to actually render; querying immediately after DOMContentLoaded
      // races the client-side camp fetch and reports a false "funnel is broken"
      const SEL = 'select option, [role="option"], input[type="radio"], button[data-camp], label'
      await p.waitForSelector(SEL, { state: 'attached', timeout: 20_000 })
        .catch(() => { throw new Error('no camp/week controls appeared within 20s') })
      const opts = await p.$$(SEL)
      const txt = await p.innerText('body')
      await p.close()
      assert(opts.length > 0, 'no selectable camp/week controls rendered')
      assert(!/sold out/i.test(txt) || /week/i.test(txt), 'page shows only a Sold Out state')
      return `${opts.length} controls`
    })
  } finally { await b.close() }
}

// ---------------------------------------------------------------- 4. weekly
async function weekly() {
  console.log('\nWEEKLY — low-churn')
  await check('TLS certs have >14 days left', async () => {
    const tls = await import('node:tls')
    const days = h => new Promise((res, rej) => {
      const s = tls.connect({ host: h, port: 443, servername: h }, () => {
        const d = (new Date(s.getPeerCertificate().valid_to) - Date.now()) / 864e5
        s.end(); res(Math.round(d))
      }); s.on('error', rej)
    })
    const out = []
    for (const s of Object.values(SITES)) {
      const h = new URL(s.url).host, d = await days(h)
      assert(d > 14, `${h} expires in ${d}d`)
      out.push(`${h}:${d}d`)
    }
    return out.join(' ')
  })

  await check('Wix-migration SEO redirects still resolve', async () => {
    const map = { '/contact': '/en/contact', '/about': '/en/our-story', '/registration': '/en/enroll' }
    for (const [from, to] of Object.entries(map)) {
      const { status, loc } = await get('https://bamboovalleyphuket.com' + from)
      assert([301, 302, 308].includes(status), `${from} → ${status}, expected redirect`)
      assert(loc.includes(to), `${from} → ${loc}, expected ${to}`)
    }
    return `${Object.keys(map).length} redirects`
  })
}

// ---------------------------------------------------------------- main
console.log('Bamboo Valley production check —', new Date().toISOString())
if (only('--gate') || runAll) await deployGate()
if (only('--smoke') || runAll) await smoke()
if (runAll) await browser()
if (only('--weekly')) { await smoke(); await weekly() }

console.log(`\n${'─'.repeat(60)}\n${pass} passed · ${fail} failed · ${skip} skipped`)
if (fail) {
  console.log('\nFAILURES:')
  failures.forEach(([n, m]) => console.log(`  ✗ ${n}\n      ${m}`))
}
process.exit(fail ? 1 : 0)
