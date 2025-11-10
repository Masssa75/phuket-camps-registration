# Phuket Camps - Session Notes

**Project**: https://phuketcamp.com
**Repository**: phuket-camps (Next.js 15)
**Deployment**: Netlify (site ID: 0a76257f-4938-49a9-9739-cfb1fcb4cced)

## Latest Update - November 8, 2025

### ✅ Safari White Screen Bug - FIXED

**Issue**:
- Safari Mac showed white screen after form submission
- Success page DOM was rendered but not painted
- Window resize or waiting eventually showed content

**Root Cause**:
Safari compositor bug - simultaneous scroll + state change caused paint skip

**Solution**:
Separate scroll from state change with 50ms delay
```javascript
// Scroll first
window.scrollTo({ top: 0, behavior: 'instant' })
// Then set state
setTimeout(() => setSubmitSuccess(true), 50)
```

**File**: `app/register/page.tsx:316-324`

**Status**: ✅ Verified working by user

### ✅ Comprehensive Test Suite

**Location**: `test-registration-scenarios.js`

**5 Test Scenarios** (based on real Winter Camp 2025 data):
1. Single child - Mini Camp - Multiple weeks
2. Single child - Maxi Camp - Single week
3. Multiple siblings - Different programs
4. Child with allergies (edge case)
5. Full camp attendance

**Run Tests**:
```bash
node test-registration-scenarios.js
```

**Results**: All 5 scenarios passing ✅

### Debugging/Logging

**Extensive logging added** for troubleshooting:
- 🚀 Component lifecycle
- 📡 API calls with timing
- ✅ Success states
- 🎉 Registration complete
- 🔄 State changes
- Performance metrics

**Console logs** show full submission flow with timestamps.

### Test Files

```
test-safari-submit.js              - Safari WebKit form test
test-safari-unmount.js             - Component unmount detection
test-registration-scenarios.js     - 5-scenario comprehensive suite
read-excel.js                      - Excel data reader
winter-camp-data.json              - Real attendance data export
```

### Key Files Modified

```
app/register/page.tsx      - Safari fix + logging
tsconfig.json              - Excluded supabase folder
package.json               - Added xlsx dependency
```

### Running the Site

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
netlify deploy --prod

# Run tests
node test-registration-scenarios.js
```

### Database

**Supabase Project**: xunccqdrybxpwcvafvag.supabase.co
**Tables**:
- camps (christmas-2025, winter-2026 configurations)
- registrations (form submissions)

### Known Issues

None - Safari bug resolved, all tests passing

### For Full Session History

See: `/Users/marcschwyn/Desktop/projects/BambooValley/logs/SESSION-LOG-2025-11.md`
