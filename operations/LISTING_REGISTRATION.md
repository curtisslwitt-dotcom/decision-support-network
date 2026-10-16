# DSN listing registration procedure

Recorded 2026-10-16 from the owner's deployed Abacus implementation and live management API checks. This documents the existing architecture; it does not introduce a parallel registry.

## Source of truth

Abacus project: https://apps.abacus.ai/chatllm/agent?convoId=131366302f
Reference: https://apps.abacus.ai/conversationFiles/131366302f/output/CCA_Management_API_Reference.md (PDF and DOCX also available).

All deployed source paths below are relative to `/home/ubuntu/cca_decision_support_network/nextjs_space/`. Line numbers are owner-provided snapshot references and can change.

| File | Responsibility |
| --- | --- |
| app/api/manage/listings/route.ts | POST at L53 validates required fields, optionally ingests the live capability manifest, and creates or updates a listing. |
| app/api/manage/listings/[slug]/route.ts | GET L18, PATCH L39, DELETE L65. DELETE sets listingStatus to inactive. |
| app/api/manage/properties/route.ts | POST L38 registers the separate telemetry property. |
| app/api/manage/routing/[id]/route.ts | GET L17 checks linkage between property and directory listing. |
| lib/manage-auth.ts | Accepts Authorization: Bearer MANAGEMENT_API_KEY or x-management-key. |
| prisma/schema.prisma | DSA listing with propertyId link, plus Property model. |

The GitHub main snapshot inspected at 7d16ae0e90186774ae8b9e0b61b56df4624545ba predates these deployed management routes. These paths describe the deployed Abacus project, not files claimed to exist in that GitHub snapshot. Synchronizing deployed implementation source is separate work.

## Authentication

Use the existing MANAGEMENT_API_KEY from the owner's private credential store. The original Abacus credential artifact was output/management_api_key.txt. Never commit that file or its contents. The same management key works for properties and listings; a directory-admin browser login is not required.

## Existing registration example

Original call: 2026-09-10. Save this JSON as listing.json:

```json
{
  "slug": "decision-economy-institute",
  "name": "The Decision Economy",
  "organization": "Decision Economy Institute",
  "description": "Understand your Decision Economy readiness across seven areas and get three practical next actions. No account or email required.",
  "category": "Business & AI Readiness",
  "categorySlug": "business-ai-readiness",
  "decisionSupported": "Which of seven Decision Economy readiness areas to focus on first, with three practical next actions.",
  "humanUrl": "https://decisioneconomyinstitute.com",
  "capabilityManifestUrl": "https://decisioneconomyinstitute.com/capability-manifest.json",
  "autoIngest": false,
  "verificationLevel": "self-reported",
  "listingStatus": "active"
}
```

Load MANAGEMENT_API_KEY securely into your environment, with shell tracing disabled:

```bash
curl --fail-with-body -sS -X POST \
  https://decisionsupportnetwork.com/api/manage/listings \
  -H "Authorization: Bearer $MANAGEMENT_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @listing.json
```

Later refreshes use the same POST endpoint and slug (upsert), add propertyId "decision-economy", and enable autoIngest (true by default). The live capability manifest supplies REST, MCP, OpenAPI URLs, tool name and version. capabilityManifestUrl remains required even with autoIngest false, confirmed by live validation on 2026-10-16.

Create the separate telemetry property with POST /api/manage/properties:
```json
{"propertyId":"decision-economy","domain":"decisioneconomyinstitute.com","name":"Decision Economy Institute"}
```

Use PATCH /api/manage/listings/decision-economy-institute for small edits, supplying only changed fields. GET that endpoint for readback. GET /api/manage/routing/decision-economy to check linkage. Public result: https://decisionsupportnetwork.com/tools/decision-economy-institute.

## Acceptance and limits

1. Inspect the POST result and GET listing readback.
2. Check propertyId and GET routing linkage (dsaListingPresent).
3. Open the public /tools/SLUG page and verify identity, destination links and verification label.
4. Record interface authentication/browser limitations. Available does not mean anonymous.
5. Set verificationLevel explicitly to self-reported unless approved certification evidence supports another value. Active listing is not certification.
6. Property registration and listing linkage do not prove telemetry delivery; verify telemetry separately.

For Expert Edge Finder, use expert-edge-finder for both slug and propertyId and https://expertedgefinder.com as the canonical domain. Its certification remains pending.
