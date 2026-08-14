import { createClient } from '@/utils/supabase/server'

/**
 * The `camps` table is the single source of truth for camp names, dates and prices.
 *
 * Marketing pages read camps through here. Do NOT re-type a camp date or a price
 * into JSX or into messages/*.json — before this existed the same five camps were
 * written out longhand in four places (two homepages, /camps, and both message
 * files) and they drifted. Add a camp to the table and it appears everywhere.
 */

export type CampProgram = {
  id: string          // 'mini' | 'maxi' — matches the programs.<id> message keys
  ageRange: string
  regular: number
  earlyBird: number
}

export type Camp = {
  slug: string
  type: string        // 'summer' | 'winter' | … — from the slug, keys emoji + translated name
  name: string        // English name, straight from the table
  emoji: string
  color: string       // per-camp accent, /camps page
  gradient: string
  start: string       // ISO date, first week
  end: string         // ISO date, last week
  weeks: number
  programs: CampProgram[]
}

// Presentational only, keyed by camp type. Everything factual comes from the table.
const STYLE: Record<string, { emoji: string; color: string; gradient: string }> = {
  summer:    { emoji: '☀️', color: '#27ae60', gradient: 'linear-gradient(135deg, #e8fff0 0%, #d0ffe8 100%)' },
  october:   { emoji: '🍂', color: '#d35400', gradient: 'linear-gradient(135deg, #fff4e0 0%, #ffe4c0 100%)' },
  christmas: { emoji: '🎄', color: '#c0392b', gradient: 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)' },
  winter:    { emoji: '❄️', color: '#4a90d9', gradient: 'linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 100%)' },
  easter:    { emoji: '🐣', color: '#e67e22', gradient: 'linear-gradient(135deg, #fff5e8 0%, #ffe8d0 100%)' },
  songkran:  { emoji: '🐣', color: '#e67e22', gradient: 'linear-gradient(135deg, #fff5e8 0%, #ffe8d0 100%)' },
}
const FALLBACK = { emoji: '🌿', color: '#7a9a3b', gradient: 'linear-gradient(135deg, #f2f7e8 0%, #e4efd2 100%)' }

/**
 * Camps that have not finished yet, soonest first.
 *
 * Throws rather than returning [] — an empty camp list renders a homepage with no
 * way to register, which looks healthy and earns nothing. A failed build is better.
 */
export async function getUpcomingCamps(): Promise<Camp[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('camps').select('slug, name, settings')
  if (error) throw new Error(`camps table unreadable: ${error.message}`)

  const today = new Date().toISOString().slice(0, 10)

  const camps = (data ?? [])
    .map((row): Camp | null => {
      const weeks = row.settings?.weeks ?? []
      const programs = row.settings?.programs ?? []
      if (!weeks.length || !programs.length) return null
      const type = row.slug.split('-')[0]
      const style = STYLE[type] ?? FALLBACK
      return {
        slug: row.slug,
        type,
        name: row.name,
        ...style,
        start: weeks[0].startDate,
        end: weeks[weeks.length - 1].endDate,
        weeks: weeks.length,
        programs: programs.map((p: { id: string; ageRange: string; pricing?: { regular?: number; earlyBird?: number } }) => ({
          id: p.id,
          ageRange: p.ageRange,
          regular: p.pricing?.regular ?? 0,
          earlyBird: p.pricing?.earlyBird ?? 0,
        })),
      }
    })
    .filter((c): c is Camp => c !== null && c.end >= today)
    .sort((a, b) => a.start.localeCompare(b.start))

  if (!camps.length) throw new Error('no upcoming camps — refusing to build a homepage nobody can register from')
  return camps
}

/**
 * "Jun 29 – Aug 14, 2026" (en) / "2026/6/29 – 2026/8/14" (zh).
 * ICU collapses zh ranges to numeric whatever options you pass; that is legible
 * and correct, just plainer than the 年月日 copy this replaced.
 */
export function formatCampDates(camp: Camp, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).formatRange(new Date(camp.start), new Date(camp.end))
}

/** Cheapest regular price for a program across all upcoming camps — the "from" figure. */
export function priceFrom(camps: Camp[], programId: string): number {
  const prices = camps.flatMap(c => c.programs.filter(p => p.id === programId).map(p => p.regular))
  return prices.length ? Math.min(...prices) : 0
}
