# Google Analytics Guide - Phuket Camps

Complete reference for tracking and analyzing website traffic on phuketcamp.com.

## Quick Start (30 seconds)

**Test API Access:**
```bash
curl https://phuketcamp.com/api/analytics?type=overview | jq
```

**Track Custom Event:**
```typescript
import { event } from '@/lib/gtag'

event({
  action: 'button_click',
  category: 'Engagement',
  label: 'Mini Camp Register'
})
```

**Query Analytics Data:**
```typescript
import { getOverallStats } from '@/lib/analytics'

const stats = await getOverallStats()
// Returns: activeUsers, pageViews, sessions, avgDuration
```

---

## Credentials & Configuration

### Google Analytics 4 Property
- **Measurement ID**: `G-JFVHXB4LPX`
- **Property ID**: `512906986`
- **Property Name**: Phuket Camps
- **Time Zone**: Asia/Bangkok (GMT+7)
- **Currency**: Thai Baht (THB)

### Service Account (for API Access)
- **Email**: `phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com`
- **Project**: `phuketcamp-analytics` (personal Google Cloud project)
- **Role**: Viewer (read-only access to GA4 data)
- **JSON Key Location**: `/Users/marcschwyn/Downloads/phuketcamp-analytics-bd6932867cc9.json`

### Environment Variables

**Location**: `/phuket-camps/.env.local`
```bash
# Client-side tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-JFVHXB4LPX

# Server-side API access
GA_PROPERTY_ID=512906986
GOOGLE_SERVICE_ACCOUNT_EMAIL=phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Netlify Environment Variables** (same as above):
Set these in Netlify dashboard under Site Settings → Environment Variables

⚠️ **IMPORTANT**: The `GOOGLE_PRIVATE_KEY` must use literal `\n` characters (not actual line breaks). See Troubleshooting section below.

---

## Client-Side Tracking (Website Events)

### Available Functions

**File**: `/lib/gtag.ts`

```typescript
import {
  trackRegistrationClick,
  trackWhatsAppClick,
  trackVideoComplete,
  pageview,
  event
} from '@/lib/gtag'
```

### Pre-Built Event Trackers

**1. Registration Click:**
```typescript
trackRegistrationClick('christmas-mini')
// Tracks: registration_click, Conversion category
```

**2. WhatsApp Click:**
```typescript
trackWhatsAppClick()
// Tracks: whatsapp_click, Contact category
```

**3. Video Complete:**
```typescript
trackVideoComplete()
// Tracks: video_complete, Engagement category
```

**4. Page View:**
```typescript
pageview('/register?camp=christmas-2025')
// Automatically tracked by Next.js router
```

### Custom Event Tracking

**Generic Event Function:**
```typescript
event({
  action: 'click',           // What happened
  category: 'CTA',           // Event category
  label: 'Early Bird CTA',   // Event label
  value: 13000               // Optional numeric value
})
```

**Example: Track Form Field Interactions:**
```typescript
// In your component
import { event } from '@/lib/gtag'

const handleNameFocus = () => {
  event({
    action: 'field_focus',
    category: 'Registration Form',
    label: 'Child Name Field'
  })
}

<input onFocus={handleNameFocus} ... />
```

**Example: Track Camp Selection:**
```typescript
const handleCampSelect = (campType: string) => {
  event({
    action: 'camp_selected',
    category: 'Registration',
    label: campType,
    value: campType === 'maxi' ? 13000 : 11000
  })
}
```

### Where to Add Tracking

**Current Implementation:**
- `/app/page.tsx` - WhatsApp buttons (TODO: needs implementation)
- `/components/HeroVideo.tsx` - Video completion (implemented)
- `/app/register/page.tsx` - Registration form (TODO)

---

## Server-Side API (Query Analytics Data)

### Available Functions

**File**: `/lib/analytics.ts`

```typescript
import {
  getOverallStats,
  getPageViews,
  getTopPages,
  getTrafficSources,
  getConversionEvents
} from '@/lib/analytics'
```

### Function Reference

**1. Overall Statistics:**
```typescript
const stats = await getOverallStats()
// Returns last 7 days by default
// Data: activeUsers, screenPageViews, sessions, averageSessionDuration
```

**2. Page Views Over Time:**
```typescript
const pageviews = await getPageViews('30daysAgo', 'today')
// Date format: 'YYYY-MM-DD' or 'NdaysAgo'
// Returns: daily breakdown of pageviews
```

**3. Top Pages:**
```typescript
const topPages = await getTopPages(10)
// Returns top 10 pages by traffic
// Data: pageTitle, pagePath, screenPageViews
```

**4. Traffic Sources:**
```typescript
const sources = await getTrafficSources(10)
// Returns top 10 traffic sources
// Data: sessionSource (e.g., google, direct, facebook), sessions
```

**5. Conversion Events:**
```typescript
const conversions = await getConversionEvents()
// Returns last 30 days
// Tracks: registration_click, whatsapp_click, video_complete
```

### Response Format

All functions return Google Analytics Data API response objects:

```typescript
{
  dimensionHeaders: [...],
  metricHeaders: [...],
  rows: [
    {
      dimensionValues: [...],
      metricValues: [
        { value: "8" },  // activeUsers
        { value: "9" }   // pageViews
      ]
    }
  ],
  metadata: {
    currencyCode: "THB",
    timeZone: "Asia/Bangkok"
  }
}
```

---

## API Endpoints

### REST API

**Base URL**: `https://phuketcamp.com/api/analytics`

**File**: `/app/api/analytics/route.ts`

### Available Endpoints

**1. Overview Stats:**
```bash
GET /api/analytics?type=overview

# Response:
{
  "success": true,
  "data": {
    "rows": [{
      "metricValues": [
        { "value": "8" },   # activeUsers
        { "value": "9" },   # screenPageViews
        { "value": "10" },  # sessions
        { "value": "12.95" } # avgSessionDuration (seconds)
      ]
    }]
  }
}
```

**2. Top Pages:**
```bash
GET /api/analytics?type=toppages

# Returns: Most visited pages with titles and paths
```

**3. Traffic Sources:**
```bash
GET /api/analytics?type=traffic

# Returns: Where visitors came from (google, direct, social, etc.)
```

**4. Conversion Events:**
```bash
GET /api/analytics?type=conversions

# Returns: registration_click, whatsapp_click, video_complete counts
```

**5. Page Views:**
```bash
GET /api/analytics?type=pageviews

# Returns: Daily pageview breakdown for last 7 days
```

### Testing Endpoints

**Using curl:**
```bash
# Test overview
curl https://phuketcamp.com/api/analytics?type=overview | jq

# Test conversions
curl https://phuketcamp.com/api/analytics?type=conversions | jq '.data.rows'

# Test traffic sources
curl https://phuketcamp.com/api/analytics?type=traffic | jq '.data.rows[].dimensionValues'
```

**Using fetch in Next.js:**
```typescript
const response = await fetch('/api/analytics?type=overview')
const { success, data } = await response.json()

if (success) {
  const users = data.rows[0].metricValues[0].value
  console.log('Active users:', users)
}
```

---

## Adding New Events

### Step 1: Define Event Function

**Edit**: `/lib/gtag.ts`

```typescript
export const trackDownloadBrochure = () => {
  event({
    action: 'download_brochure',
    category: 'Lead Generation',
    label: 'Camp Brochure PDF'
  })
}
```

### Step 2: Add to Component

**Example**: Add to brochure download button

```typescript
import { trackDownloadBrochure } from '@/lib/gtag'

<a
  href="/brochure.pdf"
  onClick={() => trackDownloadBrochure()}
>
  Download Brochure
</a>
```

### Step 3: Verify in GA4

1. Go to https://analytics.google.com
2. Navigate to Reports → Realtime
3. Trigger the event on your site
4. Check "Event count by Event name" card
5. Should see your event appear within 30 seconds

### Step 4: Add to Conversion Tracking (Optional)

**Edit**: `/lib/analytics.ts`

Add to `getConversionEvents()`:

```typescript
dimensionFilter: {
  filter: {
    fieldName: 'eventName',
    inListFilter: {
      values: [
        'registration_click',
        'whatsapp_click',
        'video_complete',
        'download_brochure'  // Add new event
      ],
    },
  },
}
```

---

## Common Queries

### Get Weekly Performance Summary

```typescript
import { getOverallStats, getTrafficSources, getConversionEvents } from '@/lib/analytics'

async function getWeeklySummary() {
  const [stats, traffic, conversions] = await Promise.all([
    getOverallStats(),
    getTrafficSources(5),
    getConversionEvents()
  ])

  return {
    users: stats.rows[0].metricValues[0].value,
    pageviews: stats.rows[0].metricValues[1].value,
    topTrafficSource: traffic.rows[0].dimensionValues[0].value,
    whatsappClicks: conversions.rows.find(
      r => r.dimensionValues[0].value === 'whatsapp_click'
    )?.metricValues[0].value || '0'
  }
}
```

### Compare Time Periods

```typescript
import { getPageViews } from '@/lib/analytics'

async function compareWeeks() {
  const thisWeek = await getPageViews('7daysAgo', 'today')
  const lastWeek = await getPageViews('14daysAgo', '7daysAgo')

  const thisWeekTotal = thisWeek.rows.reduce(
    (sum, row) => sum + parseInt(row.metricValues[0].value),
    0
  )
  const lastWeekTotal = lastWeek.rows.reduce(
    (sum, row) => sum + parseInt(row.metricValues[0].value),
    0
  )

  const percentChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100

  return {
    thisWeek: thisWeekTotal,
    lastWeek: lastWeekTotal,
    change: percentChange.toFixed(1) + '%'
  }
}
```

### Get Conversion Rate

```typescript
async function getConversionRate() {
  const [stats, conversions] = await Promise.all([
    getOverallStats(),
    getConversionEvents()
  ])

  const sessions = parseInt(stats.rows[0].metricValues[2].value)
  const registrationClicks = parseInt(
    conversions.rows.find(
      r => r.dimensionValues[0].value === 'registration_click'
    )?.metricValues[0].value || '0'
  )

  const conversionRate = (registrationClicks / sessions) * 100

  return {
    sessions,
    registrationClicks,
    conversionRate: conversionRate.toFixed(2) + '%'
  }
}
```

### Track Daily Trends

```typescript
import { getPageViews } from '@/lib/analytics'

async function getDailyTrends() {
  const data = await getPageViews('30daysAgo', 'today')

  return data.rows.map(row => ({
    date: row.dimensionValues[0].value, // YYYYMMDD format
    pageviews: parseInt(row.metricValues[0].value)
  }))
}
```

---

## Troubleshooting

### Issue: "Failed to fetch analytics data"

**Cause**: Service account credentials not set correctly in Netlify

**Fix**:
1. Go to Netlify dashboard → Site Settings → Environment Variables
2. Verify all 3 variables are set:
   - `GA_PROPERTY_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
3. Redeploy site after adding/updating variables

### Issue: "Invalid private key format"

**Cause**: The `GOOGLE_PRIVATE_KEY` has actual line breaks instead of `\n` literals

**Fix**: The private key must contain literal `\n` characters, not actual newlines:

```bash
# WRONG (actual line breaks):
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhki...
nCct226I21EbU1AP/Px...
-----END PRIVATE KEY-----

# CORRECT (literal \n):
-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhki...\nnCct226I21EbU1AP/Px...\n-----END PRIVATE KEY-----\n
```

**Quick Fix**:
```bash
# Copy from JSON key file and convert newlines
cat phuketcamp-analytics-bd6932867cc9.json | jq -r '.private_key' | awk '{printf "%s\\n", $0}' | pbcopy
# Now paste into .env.local with quotes
```

### Issue: Events not showing in GA4 Realtime

**Possible Causes**:
1. **Ad blocker**: Disable ad blocker and test
2. **Browser extension**: Test in incognito mode
3. **Localhost**: GA4 may ignore localhost traffic (test on deployed site)
4. **Missing gtag**: Check browser console for errors

**Debug**:
```javascript
// Add to browser console
window.gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test'
})
// Check GA4 Realtime within 30 seconds
```

### Issue: "Property not found" error

**Cause**: `GA_PROPERTY_ID` is incorrect or service account doesn't have access

**Fix**:
1. Verify property ID: https://analytics.google.com → Admin → Property Settings
2. Verify service account has "Viewer" access:
   - Admin → Property Access Management
   - Check for `phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com`
3. If missing, add with "Viewer" role

### Issue: No data in reports

**Possible Causes**:
1. **Too recent**: GA4 has 24-48 hour processing delay for some reports
2. **Date range**: Using `'yesterday'` before data is processed
3. **Time zone**: Property is Asia/Bangkok, queries use UTC by default

**Fix**: Use broader date ranges for testing:
```typescript
getPageViews('7daysAgo', 'today')  // Instead of 'yesterday'
```

---

## Best Practices

### Event Naming Convention

Use snake_case and descriptive names:
```typescript
// GOOD
trackRegistrationClick('christmas-mini')
event({ action: 'download_brochure', ... })

// BAD
trackClick()
event({ action: 'click', ... })
```

### Event Categories

Standardize categories across the site:
- **Conversion**: Registration clicks, form submissions
- **Engagement**: Video plays, scroll depth, time on page
- **Contact**: WhatsApp, email, phone clicks
- **Navigation**: Menu clicks, footer links
- **Lead Generation**: Brochure downloads, newsletter signups

### Rate Limiting

The Google Analytics Data API has quotas:
- **Free tier**: 200,000 tokens per day per project
- **Query complexity**: Affects token usage

**Best Practice**: Cache results for dashboards:
```typescript
// Cache for 1 hour
const cacheTime = 60 * 60 * 1000
let cachedData = null
let lastFetch = 0

async function getCachedStats() {
  const now = Date.now()
  if (cachedData && (now - lastFetch) < cacheTime) {
    return cachedData
  }

  cachedData = await getOverallStats()
  lastFetch = now
  return cachedData
}
```

### Privacy & GDPR

Google Analytics 4 is configured for:
- ✅ IP anonymization (automatic in GA4)
- ✅ No personally identifiable information (PII) collected
- ✅ Asia/Bangkok timezone (local to users)

**Never track**:
- Names, emails, phone numbers
- Payment information
- Passwords or authentication tokens

---

## Next Steps

### Recommended Tracking Additions

1. **Registration Form Events:**
   - Field focus/blur (engagement)
   - Validation errors (friction points)
   - Form abandonment (exit without submit)
   - Successful submission

2. **Camp Selection Tracking:**
   - Mini vs Maxi camp views
   - Week selection patterns
   - Early bird vs regular pricing views

3. **Scroll Depth:**
   - 25%, 50%, 75%, 100% scroll milestones
   - Identifies where users lose interest

4. **Video Engagement:**
   - 25%, 50%, 75%, 100% video completion
   - Currently only tracking 100% completion

5. **Outbound Link Clicks:**
   - Instagram link clicks
   - Links to bamboovalleyphuket.com
   - External resource links

### Dashboard Ideas

Consider building an analytics dashboard at `/admin/analytics`:
- Real-time visitor count
- Today's top pages
- Conversion funnel visualization
- Traffic source breakdown
- Weekly comparison charts

---

## Quick Reference

**Test GA Tracking:**
```bash
# Check if tracking is working
curl https://phuketcamp.com | grep "gtag"
```

**Test API Access:**
```bash
curl https://phuketcamp.com/api/analytics?type=overview | jq '.data.rows[0].metricValues'
```

**View Live Data:**
- GA4 Dashboard: https://analytics.google.com
- Property: Phuket Camps (512906986)
- Realtime Report: https://analytics.google.com → Reports → Realtime

**Service Account JSON:**
- Location: `/Users/marcschwyn/Downloads/phuketcamp-analytics-bd6932867cc9.json`
- Project: phuketcamp-analytics
- Email: phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com

---

## Support

**Google Analytics Documentation:**
- GA4 Events: https://developers.google.com/analytics/devguides/collection/ga4/events
- Data API: https://developers.google.com/analytics/devguides/reporting/data/v1

**Internal Documentation:**
- Session Log: `/logs/SESSION-LOG-2025-11.md` (November 12, 2025 section)
- Implementation Files: `/lib/gtag.ts`, `/lib/analytics.ts`, `/app/api/analytics/route.ts`

**Questions?**
Check session logs or test endpoints directly. All API responses include helpful error messages.
