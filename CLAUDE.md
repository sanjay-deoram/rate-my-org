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

## Key Patterns

### Dynamic routes — params is a Promise
```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
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
import { Slot } from "radix-ui"  // ✓
import { Slot } from "@radix-ui/react-slot"  // ✗
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
- Body/heading: Inter (`font-sans`)
- Mono labels: IBM Plex Mono (`font-mono`)

## Known Gotchas

### `types/validator.ts` — delete if stale
Next.js auto-generates `types/validator.ts` (committed in the repo) AND `.next/types/validator.ts`. The root-level one uses wrong relative paths (`../../app/...` instead of `../app/...`) because it was generated for the `.next/types/` context but placed at project root. If TypeScript errors about "Cannot find module '../../app/page.js'", delete `types/validator.ts` — the correct validator lives in `.next/types/validator.ts` (picked up via tsconfig `".next/types/**/*.ts"`).

## Route Structure

```
/                          → Homepage with search
/orgs/[slug]               → Company profile (static, server rendered)
/reviews/write             → Write a review form (client form)
/interviews/submit         → Submit interview questions (client form)
```

## Adding New Organizations

Add to the `orgs` record in `app/orgs/[slug]/page.tsx` and add the slug to `generateStaticParams`.

## File Conventions

- Shared components: `components/` (server by default)
- Client form components: `components/*.tsx` with `"use client"` at top
- UI primitives: `components/ui/` (shadcn)
- Utilities: `lib/utils.ts`
