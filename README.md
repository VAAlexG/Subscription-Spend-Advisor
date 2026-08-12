# VA Subscription Spend Advisor

An internal advisory web application for Versatile Accounting to identify recurring client subscriptions, review potential savings and produce evidence-backed recommendations.

The interface follows the Versatile Accounting brand system: Ledger Ink, Versatile Gold, Sand, Archive typography and the VA ascent mark.

## Current product stage

This repository contains the working Phase 1 pilot interface and its core domain logic:

- firm portfolio and separate client workspaces;
- Xero CSV import intake;
- transaction fingerprinting and recurring-payment detection;
- subscription register, renewal dates and ownership;
- evidence-bearing AI recommendation validation and advisor approval states;
- quarterly report archive and savings outcome tracking;
- tenant/client role boundaries and audit model;
- Xero OAuth provider boundary for the later direct integration.

The displayed portfolio is representative pilot data. D1 persistence, authenticated production actions, live Workers AI calls, Xero token exchange and report generation are the next implementation layer.

## Run locally

Requirements: Node.js 22 and pnpm 10 or newer.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Run the checks with:

```bash
pnpm test
pnpm build
```

## Cloudflare architecture

The hosted application runs as a full-stack Next.js Worker through Cloudflare's OpenNext adapter.

- **Workers** hosts the application and server routes.
- **D1** stores firms, users, client workspaces, transactions, subscriptions, recommendations, reports and audit events.
- **R2** stores original CSV imports, evidence files and generated PDFs.
- **Queues** handles recurring-payment analysis and other background work.
- **Workers AI** is reserved for structured recommendation drafts; advisor approval remains mandatory.
- **Cloudflare Access** can protect the pilot site at the edge while Microsoft/client authentication is completed inside the application.

Bindings are declared in `wrangler.jsonc`. D1's initial schema is in `migrations/0001_initial.sql`.

## Deploy from a developer machine

Authenticate Wrangler once:

```bash
pnpm wrangler login
pnpm deploy
```

Wrangler will build the Next.js application, create the Worker bundle and provision the declared Cloudflare resources. Apply the D1 migration after the database is created:

```bash
pnpm wrangler d1 migrations apply subscription-spend-advisor-db --remote
```

Use `wrangler secret put` for secrets. Do not put credentials in `wrangler.jsonc` or commit `.env` files.

## GitHub deployment

The repository includes two workflows:

- `CI` runs tests, the Next.js build and the Cloudflare Worker build.
- `Deploy to Cloudflare` performs a manual production deployment from the GitHub Actions screen.

Add these GitHub repository secrets before enabling deployment:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The API token should be restricted to the required Workers, D1, R2 and Queues permissions for the relevant Cloudflare account. Once the first deployment succeeds, the workflow can be changed to deploy automatically on merges to `main`. Cloudflare also supports connecting the GitHub repository from the Workers dashboard if dashboard-managed builds are preferred.

## Future Xero connection and client portal

Xero will use OAuth 2.0. Tokens must be stored as secrets, rotated safely and never written to logs. Each transaction retains its source so CSV and Xero data can be reconciled without duplication.

The client portal will reuse the same tenant/client data model. Client users will only see published recommendations and public notes; internal advisor notes and unapproved AI drafts remain firm-only.
