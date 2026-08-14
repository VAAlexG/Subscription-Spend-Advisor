# VA Subscription Spend Advisor

A Cloudflare-native internal advisory application for Versatile Accounting to identify recurring client subscriptions, review potential savings, and produce evidence-backed quarterly reports.

## Phase 1 status

Phase 1 is implemented as a working advisor pilot:

- Cloudflare Access identity boundary with D1-backed firm and advisor memberships;
- tenant-scoped client workspaces and audit logging;
- configurable Xero CSV mapping, row validation, R2 source retention and duplicate protection;
- recurring-payment detection with supporting transaction IDs, cadence and confidence;
- confirmed and manual subscription register with billing cycle, owner, renewal, notice period and GST treatment;
- AUD annualisation with client-selectable GST-inclusive or GST-exclusive presentation;
- Workers AI recommendation drafting constrained by advisor-supplied evidence;
- manual recommendations, advisor-only approval and separate estimated/accepted/implemented/verified outcomes;
- branded, immutable PDF report snapshots stored in R2 and served through an authorised route;
- Xero/provider interface and client-portal data boundaries reserved for later phases.

Workers AI output remains an internal draft. It cannot be published without advisor approval and never performs purchases, cancellations, migrations, deletion, or other client actions.

## Local development

Requirements: Node.js 22 and pnpm 10 or newer.

```bash
pnpm install
pnpm wrangler d1 migrations apply subscription-spend-advisor-db --local
pnpm dev
```

Open `http://localhost:3000`. Development mode supplies a local advisor identity; production requires the Cloudflare Access authenticated-user-email header.

Run verification with:

```bash
pnpm test
pnpm build
pnpm cf:build
```

## Cloudflare resources

The app is a full-stack Next.js Worker built by OpenNext. `wrangler.jsonc` declares:

- D1 binding `DB` for operational and audit data;
- R2 binding `FILES` for CSV sources and generated PDFs;
- Workers AI binding `AI` for structured recommendation drafts;
- Workers Static Assets binding `ASSETS`;
- Worker observability.

Apply both migrations in `migrations/` before first use. No OAuth secret is required in Phase 1.

## First deployment

After creating the Cloudflare Worker, D1 database and R2 bucket, replace the placeholder D1 `database_id` in `wrangler.jsonc`, authenticate Wrangler and run:

```bash
pnpm wrangler d1 migrations apply subscription-spend-advisor-db --remote
pnpm deploy
```

Protect the production hostname with Cloudflare Access and allow only authorised Versatile Accounting staff. The first Access-authorised user bootstraps the firm-administrator membership; subsequent users must be added by an administrator in D1 until staff management UI is introduced.

## GitHub deployment

`CI` verifies tests, the Next.js build and the Worker bundle. The manual deployment workflow requires these repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Restrict the token to the relevant Workers, D1, R2 and Workers AI resources. Cloudflare Access policy and resource creation remain account-level setup steps and are intentionally not committed as secrets.

## Deferred phases

Direct Xero OAuth, scheduled incremental synchronisation, client authentication/portal collaboration, multi-firm white labelling and billing remain Phase 2–4 work. The provider interface, provenance fields, tenant/client identifiers, recommendation publication states and internal/public note separation are already in place so these additions do not require a domain-model rebuild.
