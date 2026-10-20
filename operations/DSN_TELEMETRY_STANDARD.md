# Required DSN telemetry — all future builds

Owner directive: Curtiss Witt, 2026-10-20. Applies to every new DSA/site build and future retrofit. Preserve existing telemetry and add DSN delivery alongside it.

## Contract

POST https://decisionsupportnetwork.com/api/telemetry/events using fire-and-forget fetch with keepalive (or sendBeacon). Telemetry failure must never block navigation, assessment, report generation or lead capture.

Send only:
```json
{"propertyId":"<registered-property-id>","interface":"human_ui","eventName":"dsa_view","sessionId":"<random-per-tab-id>","utmSource":null,"utmMedium":null,"utmCampaign":null}
```

Expert Edge Finder uses `expert-edge-finder`. Every other build must use its own registered DSN property ID; do not copy Expert Edge Finder's ID.

Allowed events: `dsa_view`, `assessment_start`, `assessment_complete`, `cta_click`, `lead_start`, `lead_complete`.
- Send dsa_view on every page load and client-side route change; avoid development-effect duplicate sends.
- Mirror existing browser telemetry calls to DSN.
- Start means the visitor begins the corresponding flow. Completion means a successful confirmed result, never a button click, failed request, or sample report.
- Track CTA clicks across the site, including article links into the assessment and external booking links. A booking-link click is not a completed lead or confirmed booking.
- Keep a random identifier in sessionStorage for that tab, with an in-memory fallback if storage is unavailable.
- Carry UTM source, medium and campaign through the tab's journey. Use non-personal campaign codes only; sanitize and bound values.
- Never send names, emails, phone numbers, answers, reports, contact records, free text, full URLs, query strings, cookies or authentication values. Construct an explicit allowlisted envelope; never spread form objects into telemetry.
- Use credentials: omit and referrerPolicy: no-referrer with fetch. Do not label API/MCP activity human_ui.

## Release check

Confirm the registered property ID, collector acceptance/CORS, every page's view hook, meaningful event placement, per-tab/UTM continuity, payload privacy, and a non-blocking failure path. Confirm a live payload reaches the collector; distinguish collector acceptance from dashboard persistence. Do not run paid assessment generation just to test telemetry.

## Expert Edge Finder implementation

`lib/edge/dsn-telemetry.mjs`: shared transport.
`components/dsn-telemetry.tsx`: root-layout views and cross-page assessment/booking link clicks.
`app/page.tsx`: existing telemetry mirror, assessment start, first registration interaction, successful assessment/registration completion, and assessment/strategy CTA buttons.

Existing server-side completion records remain unchanged. Browser completion delivery is best-effort; it is not a durable server-side completion outbox.
