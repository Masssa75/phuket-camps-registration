# Production health check

```bash
cd Apps/phuket-camps
node qa/check.mjs            # full: deploy gate + smoke + browser  (~60s)
node qa/check.mjs --smoke    # HTTP only, no browser                (~15s)
node qa/check.mjs --gate     # just wait for Netlify deploys to be ready
node qa/check.mjs --weekly   # smoke + TLS expiry + Wix SEO redirects
```

Exit code 0 = all green. Non-zero = something is broken; the failure list prints at the end.

Covers all three production sites: **phuketcamp.com**, **bamboovalleyphuket.com**, **phuketsummercamp.com**.

## Run it after every change

1. `npm run build` locally — `tsc --noEmit` alone does **not** catch client/server import errors.
2. Push.
3. `node qa/check.mjs` — the deploy gate waits for Netlify to reach `ready` before asserting anything,
   so you can run it immediately after pushing. It only gates the site whose commit actually moved.

## Known failure: toddler sessions (real, not a test bug)

`/api/toddler/sessions` returns `{"sessions":[]}` while `/register/toddler` still renders
"Select Sessions" / "Choose Package". The page looks fine and returns 200; nothing can be booked.
Seed future rows with `status='open'` and `session_date >= today` to fix. **This test is correct —
do not delete it to get a green run.**

## What this deliberately does NOT do

**No writes. It never submits a registration.** That is not laziness, it is the only safe option today:

- `Apps/summer/supabase/migrations/002_telegram_notifications.sql` puts an `AFTER INSERT` trigger on
  `registrations` that pg_net-POSTs to an edge function messaging the real staff group. **Any** insert,
  from anywhere, pages staff. HTTP-level guards cannot prevent this — it fires at the database layer.
- There is no `is_test` concept anywhere in the schema (grep confirms), so a test child is
  indistinguishable from a real one in every query the admin runs. Leftover TEST rows are already
  sitting in production from earlier work for exactly this reason.

**To safely test the write path, in this order:**
1. `ALTER TABLE registrations ADD COLUMN is_test boolean NOT NULL DEFAULT false` (same on
   `toddler_registrations`, `contact_messages`, `event_registrations`).
2. Recreate the trigger as `AFTER INSERT ... WHEN (NEW.is_test IS NOT TRUE)` — this is the fix that
   actually stops staff-group pollution, at the layer where the notification originates.
3. Default `.eq('is_test', false)` in `RegistrationWorkflow.tsx` and the bamboo-core inbox/roster
   queries, with a "show test data" toggle.
4. Sentinel identity: `qa+<runid>@bamboovalley.test` (`.test` is RFC 2606 reserved, so a stray
   confirmation email can never reach a real person) and `child_name` prefixed `ZZQA-`.
5. Teardown by that predicate, **plus a startup sweep** removing leftovers older than 1h so a crashed
   run self-heals — that is how the current leftovers accumulated.
6. A dedicated `camps` row `slug='qa-permanent'` with a far-future week, so test bookings never land
   in the roster staff are working from during a live camp.
7. Gate the write test behind `QA_ALLOW_WRITES=1` and keep it out of the default run.

## Other known gaps (deliberate, not oversights)

- **payment-slip** is a shape check only. A 404 there cannot distinguish "no such id" from "RLS broke
  and every parent link in every payment email is dead". Upgrade to a seeded permanent QA
  registration id once step 6 above exists.
- **Outbound Telegram is unverified.** Registration alerts come from the DB trigger, not from app code.
  If the bot token rotates or the edge function is undeployed, staff silently stop getting
  registrations and nothing here turns red. A read-only `getMe` would cover it.
- **Gmail/`gws` auth expiry** = total payment-collection failure, uncovered.
  `Apps/summer/scripts/gmail-smoke-test.js` already exists and could be wired in.
- **Deep-linked `/register?camp=<slug>`** is untested; a single `soldOut` toggle turns a live ad
  destination into a dead end while `/api/camps` still reports other camps open.

## Rules for editing this file

- Assert **behaviour, not copy**. No exact titles, prices, camp slugs, blog names or buildIds — they
  all change as normal business and a suite that reds on healthy changes gets muted.
- Never `waitUntil: 'networkidle'` on the homepage; the hero video streams forever and it never settles.
- `waitForSelector` on a `<script>` tag needs `state: 'attached'` — scripts are never "visible".
- Parse cache-control directives; never byte-compare (the edge normalises spaces inconsistently).
