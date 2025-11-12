# Google Analytics Setup - Quick Reference

## Tracking Details
- **Measurement ID:** `G-JFVHXB4LPX`
- **Property ID:** `512906986`
- **Property Name:** Phuket Camps
- **Live Tracking:** ✅ Active on https://phuketcamp.com

## API Access (Programmatic)
- **Service Account:** `phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com`
- **Google Cloud Project:** phuketcamp-analytics (personal Gmail account)
- **Permissions:** Viewer access granted in GA4 property
- **JSON Key Location:** `/Users/marcschwyn/Downloads/phuketcamp-analytics-bd6932867cc9.json`

## Environment Variables (in Netlify)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-JFVHXB4LPX
GA_PROPERTY_ID=512906986
GOOGLE_SERVICE_ACCOUNT_EMAIL=phuket-camps-analytics@phuketcamp-analytics.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## API Endpoints
- Overview: `https://phuketcamp.com/api/analytics?type=overview`
- Top Pages: `https://phuketcamp.com/api/analytics?type=toppages`
- Traffic Sources: `https://phuketcamp.com/api/analytics?type=traffic`
- Conversions: `https://phuketcamp.com/api/analytics?type=conversions`
- Page Views: `https://phuketcamp.com/api/analytics?type=pageviews`

## Files Created
- `/lib/gtag.ts` - Client-side tracking functions
- `/lib/analytics.ts` - Server-side API client
- `/app/api/analytics/route.ts` - API endpoint
- `/types/gtag.d.ts` - TypeScript declarations

## Test Command
```bash
curl "https://phuketcamp.com/api/analytics?type=overview" | jq '.'
```

## Important Notes
- Organization policy blocked service account creation in bamboovalleyphuket.com org
- Solution: Created service account in personal Google Cloud project instead
- Service account has Viewer access to GA4 property - works perfectly
- Private key format: Must have `\n` as literal text, not actual line breaks
