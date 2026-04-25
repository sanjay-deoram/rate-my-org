# TanStack Query + Form + Zod + MVC Reorganization Plan

## Why We're Doing This

The project currently uses raw `fetch` + `useState` for all client-side data fetching and form management. Forms inline their type definitions, validation logic, and constants. This plan introduces TanStack Query, TanStack Form, centralized constants, shared types, a service layer, custom hooks, and a clear MVC folder layout.

---

## Where TanStack Query Makes Sense in Next.js (and Why)

> **Short answer: only inside `"use client"` components for user-triggered fetches. Not for page-level data.**

In Next.js App Router, **Server Components handle initial data fetching** — they run on the server, can hit the database directly, and stream HTML. There is no need for TanStack Query in Server Components.

TanStack Query fills the gap where RSC cannot help:

| Pattern                                    | Tool                     | Why                                                     |
| ------------------------------------------ | ------------------------ | ------------------------------------------------------- |
| Initial page data (org profiles, homepage) | RSC `fetch`              | Runs at build/request time, cached by Next.js           |
| Search autocomplete (user is typing)       | `useQuery`               | Client-triggered; benefits from caching + deduplication |
| Form mutations (POST review/interview)     | `useMutation`            | Loading/error/success states, retry, cache invalidation |
| User-triggered pagination                  | `useQuery` (dynamic key) | Cache per page, instant back-navigation                 |

### In this project specifically

- **`useQuery`** replaces the manual `debounceRef` + `setSuggestions` + `fetch` pattern in company search. TanStack Query caches results per query string — if the user types "Stripe", clears it, and types "Stripe" again, the second search is served instantly from cache with no network request.
- **`useMutation`** replaces `setSubmitting(true)` + `try/finally` in form submission. It gives `isPending`, `isError`, and `data` as first-class state.
- **Do NOT use TQ in**: `app/page.tsx`, `app/orgs/[slug]/page.tsx`, `app/layout.tsx` — those are Server Components and should stay that way.

---

## MVC Folder Structure

```
Model  (data definitions, validation rules, constants, API service functions)
├── drizzle/schema.ts              unchanged — Drizzle table defs + Postgres enums
├── lib/schemas/review.ts          updated — import constants, add reviewFormSchema
├── lib/schemas/interview.ts       NEW — Zod schema for interview form (no anonymous field)
├── lib/schemas/company.ts         unchanged
├── constants/employment.ts        NEW — employment type + status arrays (single source of truth)
├── types/review.ts                NEW — TS types inferred from review schemas
├── types/company.ts               NEW — TS types for company/search
├── lib/api/reviews.ts             NEW — submitReview(body) pure async fetch function
├── lib/api/interviews.ts          NEW — submitInterview(body) pure async fetch function
└── lib/api/companies.ts           NEW — searchCompanies(query) pure async fetch function

ViewModel  (React hooks — TQ state wrappers over the service layer)
├── hooks/use-submit-review.ts     NEW — useSubmitReview() wraps useMutation + onSuccess/onError
├── hooks/use-submit-interview.ts  NEW — useSubmitInterview() same pattern
└── hooks/use-company-search.ts    NEW — useCompanySearch(query) wraps useQuery

View  (presentational layer)
├── components/write-review-form.tsx     refactored — calls hooks, thin component
├── components/submit-interview-form.tsx refactored — calls hooks, thin component
├── components/providers.tsx             NEW — QueryClientProvider wrapper
├── components/nav.tsx, footer.tsx       unchanged
└── app/**/page.tsx                      unchanged (Server Component wrappers)

Controller  (request handling, server-side)
├── app/api/companies/route.ts     unchanged
├── app/api/reviews/route.ts       unchanged
└── app/api/interviews/route.ts    (future)
```

### Why two layers (lib/api + hooks)?

`lib/api/` functions are **pure async functions with no React dependency** — they just fetch and return data or throw. They're easy to test, easy to swap (mock in tests, change endpoint later), and reusable outside of React.

`hooks/` are the **React-specific wrappers** — they wire `onSuccess`, `onError`, `isPending` into TanStack Query. Components call `useSubmitReview()` and get back `{ mutate, isPending, error }` with no knowledge of fetch internals.

---

## Anonymous Field — Removed

The `anonymous` toggle in the interview form was a local `useState` with no API wiring — it was never sent to the database and serves no purpose since the entire platform is anonymous by design. It will be:

- **Removed** from `interviewFormSchema` (not added to begin with)
- **Removed** from the interview form UI (the toggle widget is dropped)
- **No DB migration needed** — the field was never in the database

---

## Packages to Install

```bash
pnpm add @tanstack/react-query @tanstack/react-form @tanstack/zod-form-adapter
```

| Package                      | Latest Version |
| ---------------------------- | -------------- |
| `@tanstack/react-query`      | v5.100.4       |
| `@tanstack/react-form`       | v1.29.1        |
| `@tanstack/zod-form-adapter` | v0.42.1        |

---

## Implementation Steps

### Step 1 — `constants/employment.ts` (NEW)

Single source of truth — currently duplicated between `lib/schemas/review.ts` and `components/write-review-form.tsx`.

```ts
export const EMPLOYMENT_TYPE_VALUES = [
  "full_time",
  "part_time",
  "temporary",
  "contract",
  "seasonal",
  "self_employed",
  "per_diem",
  "reserve",
  "freelance",
  "apprenticeship",
] as const;

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPE_VALUES)[number];

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentTypeValue; label: string }[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "temporary", label: "Temporary" },
  { value: "contract", label: "Contract" },
  { value: "seasonal", label: "Seasonal" },
  { value: "self_employed", label: "Self Employed" },
  { value: "per_diem", label: "Per Diem" },
  { value: "reserve", label: "Reserve" },
  { value: "freelance", label: "Freelance" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "current_employee" as const, label: "Current Employee" },
  { value: "former_employee" as const, label: "Former Employee" },
];

export type EmploymentStatusValue = (typeof EMPLOYMENT_STATUS_OPTIONS)[number]["value"];

export const CURRENT_YEAR = new Date().getFullYear();
export const FORMER_YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
```

---

### Step 2 — `lib/schemas/review.ts` (UPDATE)

Import `EMPLOYMENT_TYPE_VALUES` from constants. Add `reviewFormSchema` (extends POST body with UI-only display fields).

```ts
import { z } from "zod";
import { EMPLOYMENT_TYPE_VALUES } from "@/constants/employment";

export const reviewPostBodySchema = z
  .object({
    companySlug: z.string().min(1),
    overallRating: z.number().int().min(1).max(5),
    employmentStatus: z.enum(["current_employee", "former_employee"]),
    formerYear: z.number().int().min(1950).max(new Date().getFullYear()).nullable().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPE_VALUES),
    jobTitle: z.string().min(1).max(120),
    headline: z.string().min(1).max(200),
    pros: z.string().min(1).max(5000),
    cons: z.string().min(1).max(5000),
    adviceToManagement: z.string().min(1).max(5000),
  })
  .refine((d) => d.employmentStatus !== "former_employee" || d.formerYear != null, {
    message: "Year is required for former employees",
    path: ["formerYear"],
  });

// UI-only fields — stripped before sending to API
export const reviewFormSchema = reviewPostBodySchema.and(
  z.object({
    companyName: z.string().min(1, "Select a company"),
    companyLogoUrl: z.string().nullable(),
  }),
);

export type ReviewPostBody = z.infer<typeof reviewPostBodySchema>;
export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
```

---

### Step 3 — `lib/schemas/interview.ts` (NEW)

No `anonymous` field — the platform is anonymous by design.

```ts
import { z } from "zod";

export const INTERVIEW_CATEGORIES = [
  "Technical",
  "Behavioral",
  "System Design",
  "Cultural Fit",
  "Whiteboard",
] as const;

export type InterviewCategory = (typeof INTERVIEW_CATEGORIES)[number];

export const interviewFormSchema = z.object({
  companySlug: z.string().min(1, "Select a company"),
  companyName: z.string().min(1),
  roleTitle: z.string().min(1, "Role title is required").max(120),
  department: z.string().max(120).optional(),
  category: z.enum(INTERVIEW_CATEGORIES, { message: "Select a category" }),
  question: z.string().min(10, "Please describe the question in more detail").max(5000),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
```

---

### Step 4 — `types/review.ts` (NEW)

```ts
export type { ReviewPostBody, ReviewFormValues } from "@/lib/schemas/review";

export type CompanySuggestion = {
  slug: string;
  name: string;
  logoUrl: string | null;
};

export type CompanySearchResponse = {
  items: CompanySuggestion[];
  nextCursor: string | null;
};
```

---

### Step 5 — `types/company.ts` (NEW)

```ts
export type { Company } from "@/lib/schemas/company";

export type CompanySelectOption = {
  slug: string;
  name: string;
  logoUrl: string | null;
};
```

---

### Step 6 — `lib/api/companies.ts` (NEW)

Pure async fetch — no React, no TQ. Just the network call.

```ts
import type { CompanySearchResponse } from "@/types/review";

export async function searchCompanies(query: string, limit = 6): Promise<CompanySearchResponse> {
  const res = await fetch(`/api/companies?search=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) throw new Error("Company search failed");
  return res.json();
}
```

---

### Step 7 — `lib/api/reviews.ts` (NEW)

```ts
import type { ReviewPostBody } from "@/types/review";

export type SubmitReviewResponse = {
  review: { id: string; createdAt: string };
};

export async function submitReview(body: ReviewPostBody): Promise<SubmitReviewResponse> {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Submission failed");
  }
  return res.json();
}
```

---

### Step 8 — `lib/api/interviews.ts` (NEW)

Stub until `app/api/interviews/route.ts` is built. Resolves immediately so the hook pattern is already wired correctly.

```ts
import type { InterviewFormValues } from "@/lib/schemas/interview";

export type SubmitInterviewResponse = {
  interview: { id: string; createdAt: string };
};

export async function submitInterview(
  body: Omit<InterviewFormValues, "companyName">,
): Promise<SubmitInterviewResponse> {
  const res = await fetch("/api/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Submission failed");
  }
  return res.json();
}
```

---

### Step 9 — `hooks/use-company-search.ts` (NEW)

```ts
import { useQuery } from "@tanstack/react-query";
import { searchCompanies } from "@/lib/api/companies";

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: ["companies", "search", query],
    queryFn: () => searchCompanies(query),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}
```

Both forms import this same hook — TanStack Query deduplicates identical in-flight requests and shares the cache between them.

---

### Step 10 — `hooks/use-submit-review.ts` (NEW)

`onSuccess` and `onError` live here, not in the component.

```ts
import { useMutation } from "@tanstack/react-query";
import { submitReview } from "@/lib/api/reviews";

export function useSubmitReview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitReview,
    onSuccess,
    onError: (error: Error) => {
      console.error("Review submission failed:", error.message);
    },
  });
}
```

---

### Step 11 — `hooks/use-submit-interview.ts` (NEW)

```ts
import { useMutation } from "@tanstack/react-query";
import { submitInterview } from "@/lib/api/interviews";

export function useSubmitInterview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitInterview,
    onSuccess,
    onError: (error: Error) => {
      console.error("Interview submission failed:", error.message);
    },
  });
}
```

---

### Step 12 — `components/providers.tsx` (NEW)

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState initializer — NOT module-level — prevents shared state between SSR requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

---

### Step 13 — `app/layout.tsx` (UPDATE)

```tsx
import { Providers } from "@/components/providers";

<body className="bg-background text-foreground flex min-h-screen flex-col">
  <Providers>{children}</Providers>
</body>;
```

---

### Step 14 — `components/write-review-form.tsx` (REFACTOR)

**What gets replaced:**

| Before                                            | After                                    |
| ------------------------------------------------- | ---------------------------------------- |
| `useState<ReviewFormState>` + manual `validate()` | `useForm` (TanStack Form)                |
| `useState<FormErrors>`                            | `field.state.meta.errors` (built-in)     |
| `debounceRef` + inline `fetch` + `setSuggestions` | `useCompanySearch` hook                  |
| `setSubmitting` + `try/finally` + inline `fetch`  | `useSubmitReview` hook                   |
| Inline `EMPLOYMENT_TYPES` array                   | `EMPLOYMENT_TYPE_OPTIONS` from constants |
| Inline `CompanySuggestion` type                   | imported from `types/review.ts`          |

**Component shape after refactor:**

```tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useState, useRef } from "react";
import { reviewFormSchema } from "@/lib/schemas/review";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  FORMER_YEARS,
} from "@/constants/employment";
import { useCompanySearch } from "@/hooks/use-company-search";
import { useSubmitReview } from "@/hooks/use-submit-review";
import type { CompanySuggestion, ReviewPostBody } from "@/types/review";

export function WriteReviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchData } = useCompanySearch(debouncedQuery);
  const submitReview = useSubmitReview(() => setSubmitted(true));

  const form = useForm({
    defaultValues: {
      /* all fields */
    },
    validatorAdapter: zodValidator(),
    validators: { onSubmit: reviewFormSchema },
    onSubmit: async ({ value }) => {
      const { companyName, companyLogoUrl, ...postBody } = value;
      await submitReview.mutateAsync(postBody as ReviewPostBody);
    },
  });

  // ... render with form.Field for each field
}
```

**Field pattern:**

```tsx
<form.Field name="jobTitle" validators={{ onChange: z.string().min(1, "Required").max(120) }}>
  {(field) => (
    <div className="space-y-2">
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(inputCls, field.state.meta.errors.length > 0 && "border-destructive")}
      />
      {field.state.meta.errors[0] && (
        <p className="text-destructive text-xs">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
</form.Field>
```

**Form element and submit button:**

```tsx
<form onSubmit={form.handleSubmit}>
  {/* ... fields ... */}
  <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
    {([canSubmit, isSubmitting]) => (
      <button type="submit" disabled={!canSubmit || isSubmitting || submitReview.isPending}>
        {submitReview.isPending ? "Publishing..." : "Publish Review"}
      </button>
    )}
  </form.Subscribe>
</form>
```

`IntegritySidebar` is **unchanged**.

---

### Step 15 — `components/submit-interview-form.tsx` (REFACTOR)

Same pattern. Key differences from the review form:

- Uses `useSubmitInterview` hook instead of `useSubmitReview`
- Uses `interviewFormSchema` from `lib/schemas/interview.ts`
- Uses `INTERVIEW_CATEGORIES` for the category pills
- **No anonymous toggle** — removed entirely
- `AnonymitySidebar` is **unchanged**

---

### Step 16 — `CLAUDE.md` (UPDATE)

Add to **Stack**:

```md
- **TanStack Query v5** — client-side async state. `useQuery` for search, `useMutation` for POSTs. Provider in `components/providers.tsx`.
- **TanStack Form v1** — form state + field-level Zod validation via render-prop `form.Field` API
- **`@tanstack/zod-form-adapter`** — bridges TanStack Form validators with Zod
```

Add **Project Structure (MVC)**:

```md
### Model

- `drizzle/schema.ts` — DB schema (source of truth)
- `lib/schemas/` — Zod validation schemas
- `constants/` — Shared constant arrays (employment types/statuses)
- `types/` — Hand-authored TS types inferred from schemas
- `lib/api/` — Pure async fetch functions (no React); one file per resource

### ViewModel

- `hooks/` — TanStack Query wrappers over lib/api functions.
  onSuccess/onError live here, not in components.

### View

- `components/` — React components (thin — call hooks, render state)
- `components/providers.tsx` — QueryClientProvider
- `app/**/page.tsx` — Server Component page wrappers

### Controller

- `app/api/**/route.ts` — API route handlers (validate → DB → JSON)

### Rules

- Never use useQuery/useMutation in Server Components
- Company search query key: `["companies", "search", query]` — shared across both forms
- lib/api/ functions have no React imports — keep them that way
```

---

## Execution Order

```
1.  pnpm add @tanstack/react-query @tanstack/react-form @tanstack/zod-form-adapter
2.  constants/employment.ts
3.  lib/schemas/interview.ts          (no anonymous field)
4.  lib/schemas/review.ts             (import constants, add reviewFormSchema)
5.  types/review.ts
6.  types/company.ts
7.  lib/api/companies.ts
8.  lib/api/reviews.ts
9.  lib/api/interviews.ts
10. hooks/use-company-search.ts
11. hooks/use-submit-review.ts
12. hooks/use-submit-interview.ts
13. components/providers.tsx
14. app/layout.tsx                    (wrap with Providers)
15. components/write-review-form.tsx
16. components/submit-interview-form.tsx
17. CLAUDE.md
```

---

## Verification Checklist

- [ ] `pnpm typecheck` — no TypeScript errors
- [ ] `pnpm lint` — ESLint passes
- [ ] `/reviews/write` — company search shows suggestions after ~500ms
- [ ] `/reviews/write` — same query typed twice → no duplicate network request (Network tab)
- [ ] `/reviews/write` — empty submit → per-field errors appear
- [ ] `/reviews/write` — filled form → success screen
- [ ] `/interviews/submit` — no anonymous toggle visible
- [ ] `/interviews/submit` — company search shares cache with review form
- [ ] `pnpm build` — no errors
