# Plan: Companies schema + seed + list endpoint

Scope: (1) Drizzle schema for `companies`, (2) seed script that reads `python-scripts/manifest.json` and inserts rows with R2 logo URLs, (3) public `GET /api/companies` used by the review/interview flows for picking a company. Nothing else.

---

## 1. What we have today

- `scripts/upload-logos.ts` uploads `logos/<slug>.webp` → R2 under key `<slug>.webp`.
- `python-scripts/manifest.json` has one entry per logo: `companyId` (external Mongo id — ignore), `name`, `slug`, `originalUrl`, `status`, `reviewCount`, `avgCADSalary`, `avgUSDSalary`.
- `drizzle/schema.ts` currently holds a placeholder `playing_with_neon` table.
- `drizzle.config.ts` points at `./db/schema.ts` but the real schema lives at `./drizzle/schema.ts`. **Fix config path before running migrations.**
- ~1262 logos in `logos/`.

The PRD's `Company` model assumes industry / headquarters / size / founded / description. The manifest does **not** carry any of that. The seed populates only what we have; the rest are nullable and filled in later via the admin panel or user-submitted edits.

---

## 2. Schema (`drizzle/schema.ts`)

Replace the placeholder table. Single table for this task:

```ts
// companies
id            uuid pk default gen_random_uuid()
name          text not null
slug          text not null unique            // globally unique, matches R2 key
industry      text null                       // enrich later
headquarters  text null                       // enrich later
website       text null
size          text null                       // enum-like: '1-50' | '51-200' | ...
founded       integer null
description   text null
logoKey       text null                       // R2 object key, e.g. "shopify.webp"
createdAt     timestamptz not null default now()
updatedAt     timestamptz not null default now()
```

Notes / deviations from PRD §8.1:

- **Store `logoKey` not `logoUrl`.** Public URL is built at read time as `${NEXT_PUBLIC_LOGO_CDN}/${logoKey}`. Lets us change CDN domain without a data migration.
- **PRD calls for composite unique on (name, headquarters).** We don't have headquarters in the seed, so enforce it later once that field is backfilled. `slug` uniqueness is enough for v1 because slugs in the manifest are already disambiguated.
- **Indexes:** `slug` (unique, already), plus a `gin` index on `name gin_trgm_ops` to power fuzzy autocomplete later. Create the `pg_trgm` extension in a migration.

Also add a Zod schema (`lib/schemas/company.ts`) derived via `drizzle-zod` so the API and any future form share validation.

---

## 3. Migration

1. Fix `drizzle.config.ts` — point `schema` at `./drizzle/schema.ts`.
2. `pnpm drizzle-kit generate` → review SQL → `pnpm drizzle-kit migrate` (or `push` for dev).
3. In the generated migration, prepend:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   ```
   and append the trigram index on `companies.name`.

---

## 4. Seed script (`scripts/seed-companies.ts`)

Separate from `upload-logos.ts` so uploads and DB writes stay decoupled (you can re-run either independently).

Behavior:

1. Load `python-scripts/manifest.json`.
2. Filter to `status === "ok"`.
3. For each entry build a row: `{ name, slug, logoKey: \`${slug}.webp\` }`.
4. Bulk insert in batches of ~500 using `db.insert(companies).values(batch).onConflictDoUpdate({ target: companies.slug, set: { name, logoKey, updatedAt: now } })`. Idempotent — safe to re-run.
5. Log `{ inserted, updated, skipped }`.

Env: reuses `DATABASE_URL` via existing `lib/db.ts`. No new env vars.

Run with `pnpm tsx scripts/seed-companies.ts`.

Sanity check: count rows after seed should match `manifest.filter(status==="ok").length`.

---

## 5. Public list endpoint (`app/api/companies/route.ts`)

Purpose: power the "pick a company" autocomplete on the review/interview submit flows. Keep it boring and cacheable.

**Contract**

```
GET /api/companies?q=<string>&limit=<1..50>&cursor=<slug>
```

- `q` (optional): case-insensitive substring match on `name`. When present, order by trigram similarity desc, then name asc. When absent, order by name asc.
- `limit` (optional, default 20, max 50).
- `cursor` (optional): slug of last item from previous page; server returns items with `slug > cursor` under the same ordering. Simple keyset pagination; no offset.

**Response**

```ts
{
  items: Array<{
    slug: string;
    name: string;
    logoUrl: string | null; // built server-side from logoKey + CDN base
  }>;
  nextCursor: string | null;
}
```

**Implementation notes**

- Server Component–friendly: plain Next.js route handler, no auth, `export const runtime = "nodejs"` (neon-http works on edge too, but stick to node to match the rest of the app until we need edge).
- Validate query params with Zod; reject on invalid.
- Cache: `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`. Directory changes slowly; 5-min CDN cache is fine.
- Rate limit: defer to the global middleware described in PRD §6 — don't build a per-endpoint limiter here.
- No Turnstile — this is a read endpoint.

**Select UI (out of scope for this task, noted for context)**
The review/interview forms will call this endpoint from a debounced combobox (shadcn `Command` + `Popover`). Not part of this plan; flagged so the endpoint shape matches what the form needs.

---

## 6. Order of operations

1. Fix `drizzle.config.ts` path.
2. Write new `companies` schema + Zod schema.
3. Generate migration, hand-edit to add `pg_trgm` + trigram index, apply.
4. Run `scripts/upload-logos.ts` (already exists) to get logos into R2.
5. Run `scripts/seed-companies.ts` to populate the table.
6. Add `NEXT_PUBLIC_LOGO_CDN` env var (e.g. `https://logos.ratemyorg.com`).
7. Implement `app/api/companies/route.ts`.
8. Smoke-test: `curl /api/companies?q=shop` → expect Shopify.

---

## 7. Open questions

- **CDN domain**: is `logos.ratemyorg.com` (or similar) wired up in Cloudflare yet? If not, temporarily serve via the R2 public dev URL and swap later — only the env var changes.
- **Headquarters/industry backfill**: do you want a follow-up task to scrape/enrich these, or wait for admin-panel editing? Affects when we can add the PRD's `(name, headquarters)` composite unique.
- **Soft-delete vs hard-delete** for admin removal later: not needed for this task but worth deciding before the admin panel.
