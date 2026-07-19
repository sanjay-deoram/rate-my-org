@AGENTS.md

# Project: RateMyOrg

Anonymous workplace review platform. No user authentication required. Users can rate organizations, write reviews, and share interview questions without logging in.

## Stack

- **Next.js 16** App Router — `params` is a `Promise`, always `await params` in dynamic routes
- **React 19** — default Server Components, use `"use client"` only for interactivity
- **TypeScript** — strict mode
- **Tailwind CSS 4** — configured via `@theme inline` in `app/globals.css`, no `tailwind.config.js`
- **shadcn** with `radix-nova` style — components in `components/ui/`, uses `radix-ui` package (not `@radix-ui/*`)
- **pnpm** — package manager
- **TanStack Query v5** (`@tanstack/react-query`) — client-side async state for user-triggered fetches only. `useQuery` for search autocomplete, `useMutation` for form POSTs. Provider in `components/providers.tsx`. Never use in Server Components.
- **TanStack Form v1** (`@tanstack/react-form`) — form state + field-level validation via render-prop `form.Field` API. Zod 4 is detected automatically via Standard Schema — no adapter needed.
- **Zod 4** — validation schemas in `lib/schemas/`. Shared across API routes (server) and form field validators (client).
- **Cloudflare** — Hosted site on cloudflare, R2 bucket for company image, cdn for quick access.

## Key Patterns

### Dynamic routes — params is a Promise

```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

### Tailwind 4 custom tokens

Custom colors are defined in `app/globals.css` under `@theme inline`. Adding `--color-foo: var(--foo)` makes `bg-foo`, `text-foo` etc. work as Tailwind utilities.

### Client vs Server components

- Default: Server Component (no directive needed)
- Interactive forms, `usePathname`, `useState` → add `"use client"` directive
- Pattern: Server page wrapper + Client form component (see `app/reviews/write/page.tsx`)

### shadcn component imports

Use `radix-ui` (unified package), not `@radix-ui/react-*`:

```tsx
import { Slot } from "radix-ui"; // ✓
import { Slot } from "@radix-ui/react-slot"; // ✗
```

## Design System

See `design.md` for full design system documentation.

### Key tokens

- `--primary`: `#030303` (near-black) — buttons, active states
- `--background`: `#fcf9f8` (warm white) — page bg
- `--tertiary-fixed-dim`: `#3be366` (green) — verified icons, anonymous toggle
- `--primary-container`: `#1d1d1d` — gradient end, dark cards
- Surface hierarchy: lowest (#fff) → low → default → high → highest (#e5e2e1)

### Fonts

- Body, headings, and label styling: Inter (`font-sans`; `font-mono` maps to the same family in `@theme`

## Route Structure

```
/                          → Homepage with search
/orgs/[slug]               → Company profile (static, server rendered)
/reviews/write             → Write a review form (client form)
/interviews/submit         → Submit interview questions (client form)
```

## Project Structure (MVC)

### Model

- `drizzle/schema.ts` — DB schema (source of truth for table + enum definitions)
- `lib/schemas/` — Zod validation schemas (`review.ts`, `company.ts`, `interview.ts`)
- `lib/api/` — Pure async fetch functions, no React (`reviews.ts`, `interviews.ts`, `companies.ts`)
- `lib/org-sort.ts` — Pure sort/filter/toggle utility functions for org content
- `constants/index.ts` — Shared app-wide constants (employment types, industries, etc.)
- `constants/org-content.ts` — UI-only constants scoped to org content (SORT_OPTIONS, EXPERIENCE_BADGE)
- `types/` — Hand-authored TS types inferred from schemas or derived from query results. Do NOT put auto-generated Next.js types here.

### ViewModel

- `hooks/` — Custom hooks. TanStack Query wrappers over `lib/api/` functions. `onSuccess`/`onError` live here, not in components. UI-only hooks (e.g. `use-dropdown.ts`) also live here.

### View

- `components/` — React components (thin — props + JSX only, no inline constants, types, or utility functions)
- `components/providers.tsx` — `QueryClientProvider` (wraps root layout body)
- `app/**/page.tsx` — Server Component page wrappers

### Controller

- `app/api/**/route.ts` — API route handlers (validate → DB → JSON)

## Component Extraction Rules

Keep components thin — they should only contain props, state, and JSX. Extract everything else:

- **Types** → `types/<feature>.ts` (e.g. `types/org-content.ts`)
- **UI-scoped constants** (sort options, badge maps) → `constants/<feature>.ts`
- **App-wide constants** (employment types, industries) → `constants/index.ts`
- **Pure functions** (sort, filter, transform) → `lib/<feature>.ts`
- **Custom hooks** (dropdowns, toggles, subscriptions) → `hooks/use-<name>.ts` with `"use client"` if they use browser APIs
- **Reusable sub-components** (cards, empty states) → their own `components/<name>.tsx` file

## Code Style Rules

- **No nested ternaries.** A single-level ternary (`a ? b : c`) is fine. Never nest one inside another. Use lookup objects (`{ reviews: x, interviews: y, both: z }[tab]`), `if`/`else` chains, or a named render function instead.

## File Conventions

- Shared components: `components/` (server by default)
- Client form components: `components/*.tsx` with `"use client"` at top
- UI primitives: `components/ui/` (shadcn)
- Utilities: `lib/utils.ts`

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
