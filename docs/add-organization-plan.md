# Add Organization — Implementation Plan

## Overview

Users who can't find a company in search need a way to create it on the fly without leaving their in-progress review/interview form. The new company is immediately selectable client-side but stays **pending** (invisible to everyone else) until the admin reviews and approves it. Approving a company auto-approves all associated reviews/interviews.

---

## Decisions

- **UX:** Modal dialog — stays on the review/interview form, no navigation away
- **Fields:** Name, Location (e.g. "Toronto, CA"), Industry, Website (optional)
- **Visibility:** New companies default to `pending` — hidden from all public search/browse queries
- **Approval cascade:** Approving a company makes it and all its reviews/interviews go live simultaneously (no separate review/interview approval step)
- **Logo uploads:** Admin can upload to Cloudflare R2 during the approval flow

---

## Phase 1 — DB Migration

**File:** `drizzle/schema.ts`

Add a `companyStatusEnum` and a `status` column to the `companies` table:

```ts
export const companyStatusEnum = pgEnum("company_status", ["pending", "approved"]);

// In companies table:
status: companyStatusEnum("status").notNull().default("approved"),
```

Default is `approved` so all existing companies remain visible. User-submitted companies are inserted with `status: "pending"`.

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

---

## Phase 2 — POST /api/companies + Zod Schema

**File:** `app/api/companies/route.ts` — add `POST` alongside the existing `GET`

Logic:

1. Parse + validate body with Zod: `{ name, headquarters, industry, website? }`
2. Generate a URL-safe slug from the name (slugify, append location suffix on conflict)
3. Duplicate check: if `(name, headquarters)` already exists (any status) → 409 with existing slug
4. Insert with `status: "pending"`
5. Return `{ company: { id, slug, name, headquarters } }`

**File:** `lib/schemas/company.ts` — add:

```ts
export const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  headquarters: z.string().min(2).max(100),
  industry: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")),
});
```

---

## Phase 3 — Filter Pending Companies from Public Queries

**File:** `app/api/companies/route.ts` — `GET` handler

Add `.where(eq(companies.status, "approved"))` to both the search query and browse query.

**File:** `app/orgs/[slug]/page.tsx`

After fetching company by slug, if `company.status === "pending"` → `notFound()`.

---

## Phase 4 — `<AddOrganizationModal>` + Wire into Search

**New file:** `components/add-organization-modal.tsx` (`"use client"`)

Uses shadcn `<Dialog>` + TanStack Form + Zod.

```ts
interface AddOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyCreated: (company: { slug: string; name: string }) => void;
  initialName?: string;
}
```

Fields: Company Name, Industry, Location, Website (optional)

Submit flow:

1. `useMutation` → `POST /api/companies`
2. On success → call `onCompanyCreated({ slug, name })` → parent auto-selects the company
3. On 409 → show inline error "This company already exists"

**File:** `components/company-search-input.tsx`

Replace the existing `<a href="/orgs/add">` link (line 177) with:

- Local `isModalOpen` state
- Render `<AddOrganizationModal initialName={inputValue} />`
- `onCompanyCreated` callback → calls `onSelect` with new company data → closes modal

---

## Phase 5 — Admin API Routes

All routes protected by existing admin cookie middleware.

| Route                               | Method | Purpose                                               |
| ----------------------------------- | ------ | ----------------------------------------------------- |
| `/api/admin/companies/pending`      | GET    | List pending companies with review/interview counts   |
| `/api/admin/companies/[id]`         | PATCH  | Edit company fields (any subset)                      |
| `/api/admin/companies/[id]`         | DELETE | Reject + hard delete (cascades to reviews/interviews) |
| `/api/admin/companies/[id]/approve` | POST   | Set status to `approved`                              |
| `/api/admin/companies/[id]/logo`    | POST   | Upload logo to R2, update `logoKey`                   |

Logo upload requires:

- `sharp` (resize to 200×200, convert to WebP)
- `@aws-sdk/client-s3` (S3-compatible R2 upload)
- Env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

---

## Phase 6 — Admin UI: Pending Companies Queue

**New file:** `components/pending-companies-queue.tsx` (`"use client"`)

Rendered in `app/admin/page.tsx` — replaces the "Coming soon" Company Management card.

Each pending company card shows:

- Name, location, industry, website, review count, interview count, submitted date
- **Edit** → inline form (name, industry, location, website, size, description)
- **Upload Logo** → file input → POST to logo endpoint
- **Approve** (green) → POST approve → card removed from queue
- **Reject** (red, with confirmation dialog) → DELETE → card removed from queue

Uses TanStack Query `useQuery` for the pending list and `useMutation` for each action.

---

## Critical Files

| File                                            | Change                                    |
| ----------------------------------------------- | ----------------------------------------- |
| `drizzle/schema.ts`                             | Add `companyStatusEnum` + `status` column |
| `app/api/companies/route.ts`                    | Add POST; filter GET by `approved` status |
| `app/orgs/[slug]/page.tsx`                      | `notFound()` for pending companies        |
| `components/company-search-input.tsx`           | Replace link with modal open              |
| `lib/schemas/company.ts`                        | Add `createCompanySchema`                 |
| `components/add-organization-modal.tsx`         | **New**                                   |
| `app/api/admin/companies/pending/route.ts`      | **New**                                   |
| `app/api/admin/companies/[id]/route.ts`         | **New**                                   |
| `app/api/admin/companies/[id]/approve/route.ts` | **New**                                   |
| `app/api/admin/companies/[id]/logo/route.ts`    | **New**                                   |
| `components/pending-companies-queue.tsx`        | **New**                                   |
| `app/admin/page.tsx`                            | Wire in `<PendingCompaniesQueue>`         |

---

## Verification Checklist

- [ ] User creates a pending company via modal → company has `status = pending` in DB
- [ ] Pending company does NOT appear in public search/autocomplete
- [ ] Navigating directly to `/orgs/<pending-slug>` returns 404
- [ ] Review/interview linked to pending company is stored in DB but not visible publicly
- [ ] Admin can see pending company in queue with review/interview counts
- [ ] Admin can edit all company fields inline
- [ ] Admin can upload a logo (R2 upload, `logoKey` updated in DB)
- [ ] Admin approves → company appears in public search, review/interview appears on profile
- [ ] Admin rejects → company + all linked content deleted from DB
- [ ] Duplicate submission (same name + location) returns 409 with user-facing error
