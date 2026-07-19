# RateMyOrg Design System

## Overview

RateMyOrg uses a **minimal, editorial** aesthetic inspired by high-end editorial publications. The palette is near-monochromatic — near-black primary, warm whites, and subtle gray surface hierarchy — with a single vivid green accent for positivity signals (verified, top-rated, anonymous toggle).

---

## Color Palette

All colors are exposed as CSS custom properties in `app/globals.css` and available as Tailwind utilities via `@theme inline`.

### Core (shadcn-mapped)

| Token                    | Value     | Tailwind class               | Use                              |
| ------------------------ | --------- | ---------------------------- | -------------------------------- |
| `--primary`              | `#030303` | `bg-primary`, `text-primary` | Buttons, active states, headings |
| `--primary-foreground`   | `#ffffff` | `text-primary-foreground`    | Text on primary bg               |
| `--primary-container`    | `#1d1d1d` | `bg-primary-container`       | Gradient end, dark cards         |
| `--on-primary-container` | `#868584` | `text-on-primary-container`  | Muted text on dark bg            |
| `--background`           | `#fcf9f8` | `bg-background`              | Page background (warm white)     |
| `--foreground`           | `#1b1b1b` | `text-foreground`            | Body text                        |
| `--muted`                | `#f6f3f2` | `bg-muted`                   | `surface-container-low`          |
| `--muted-foreground`     | `#444748` | `text-muted-foreground`      | Secondary text                   |
| `--accent`               | `#e5e2e1` | `bg-accent`                  | `surface-container-highest`      |
| `--border`               | `#c4c7c7` | `border-border`              | Dividers, outlines               |
| `--destructive`          | `#ba1a1a` | `text-destructive`           | Errors                           |

### Surface Hierarchy

| Token                         | Value     | Tailwind class                 |
| ----------------------------- | --------- | ------------------------------ |
| `--surface-container-lowest`  | `#ffffff` | `bg-surface-container-lowest`  |
| `--surface-container-low`     | `#f6f3f2` | `bg-surface-container-low`     |
| `--surface-container`         | `#f0eded` | `bg-surface-container`         |
| `--surface-container-high`    | `#eae7e7` | `bg-surface-container-high`    |
| `--surface-container-highest` | `#e5e2e1` | `bg-surface-container-highest` |
| `--on-surface`                | `#1b1b1b` | `text-on-surface`              |
| `--on-surface-variant`        | `#444748` | `text-on-surface-variant`      |
| `--outline`                   | `#747878` | `text-outline`                 |
| `--outline-variant`           | `#c4c7c7` | `border-outline-variant`       |

**Muted text**: never create muted text with opacity modifiers on `text-on-surface-variant` (e.g. `text-on-surface-variant/40`, `/45`, `/70`) — this fails WCAG AA contrast. Use solid `text-on-surface-variant` instead.

### Accent (Tertiary / Green)

| Token                  | Value     | Tailwind class                                     | Use                              |
| ---------------------- | --------- | -------------------------------------------------- | -------------------------------- |
| `--tertiary-fixed`     | `#6bff84` | `bg-tertiary-fixed`                                | Accent background                |
| `--tertiary-fixed-dim` | `#2f9654` | `bg-tertiary-fixed-dim`, `text-tertiary-fixed-dim` | Verified icons, anonymous toggle |
| `--on-tertiary-fixed`  | `#071c0d` | `text-on-tertiary-fixed`                           | Text on green bg                 |

### Inverse Tokens

| Token                  | Value     | Tailwind class            | Use                     |
| ---------------------- | --------- | ------------------------- | ----------------------- |
| `--inverse-surface`    | `#303030` | `bg-inverse-surface`      | "Load More" hover state |
| `--inverse-on-surface` | `#f3f0ef` | `text-inverse-on-surface` | Text on inverse surface |
| `--inverse-primary`    | `#c8c6c5` | `text-inverse-primary`    | Logo on dark bg         |

---

## Typography

| Role    | Font  | Variable       | Tailwind class                       |
| ------- | ----- | -------------- | ------------------------------------ |
| Body    | Inter | `--font-inter` | `font-sans`                          |
| Heading | Inter | `--font-inter` | `font-sans`                          |
| Utility | Inter | `--font-inter` | `font-mono` (same family; caps / UI) |

### Type Scale Usage

- **Display / Hero**: `text-5xl md:text-7xl font-bold tracking-tighter`
- **Section headings**: `text-4xl font-bold tracking-tight`
- **Card headings**: `text-2xl font-bold tracking-tight`
- **Body large**: `text-lg leading-relaxed`
- **Body**: `text-sm leading-relaxed`
- **Label / small caps**: `font-mono text-[10px] uppercase tracking-widest` (uses Inter via theme)
- **Italic quotes**: `italic font-bold` or `italic leading-relaxed`

### Typography Roles

Two shared utility classes (defined in `app/globals.css`) codify the small-caps label sizes — use these instead of ad-hoc `text-[Npx]` classes:

- `.label-eyebrow` — `font-mono text-[10px] font-bold tracking-widest uppercase`. Section eyebrows, stat labels, timestamps.
- `.label-meta` — `font-mono text-[11px] font-bold tracking-widest uppercase`. Inline action labels, tabs, pagination.

Neither class sets a text color — callers apply color (e.g. `text-on-surface-variant`).

Arbitrary sizes like `text-[9px]`, `text-[13px]`, and `text-[15px]` are disallowed elsewhere in the app. The one exception is `text-[9px]`, which is permitted only inside the aria-hidden decorative phone mockup.

---

## Responsive Design

### Breakpoints

Tailwind defaults apply: `sm` = 640px, `md` = 768px, `lg` = 1024px. Mobile-first — base classes target phones, `md:` targets tablets and up.

### Responsive Type Scale

Every heading that uses a large desktop size must step down on mobile. Never use a fixed large size without a mobile override.

| Role                           | Mobile        | Desktop                               |
| ------------------------------ | ------------- | ------------------------------------- |
| Hero / display                 | `text-4xl`    | `md:text-6xl lg:text-7xl`             |
| Page title (org name)          | `text-2xl`    | `md:text-5xl`                         |
| Section heading                | `text-xl`     | `sm:text-2xl md:text-3xl lg:text-4xl` |
| Rating display (KPI)           | `text-5xl`    | `md:text-7xl`                         |
| KPI card value                 | `text-2xl`    | `md:text-5xl`                         |
| Small caps label (tight space) | `text-[9px]`  | `md:text-xs`                          |
| Small caps label (normal)      | `text-[10px]` | —                                     |

### Responsive Spacing

| Token                      | Mobile  | Desktop    |
| -------------------------- | ------- | ---------- |
| Section horizontal padding | `px-5`  | `md:px-12` |
| Section vertical padding   | `py-12` | `md:py-20` |
| Card internal padding      | `p-4`   | `md:p-8`   |
| Gap between logo and name  | `gap-4` | `md:gap-8` |

Section horizontal padding convention is `px-5 md:px-12` — `px-5` is the mobile floor; never go below it.

### Feed Cards (review + interview)

Review and interview cards are content-dense, so they must shrink noticeably on phones — padding, header margins, inner gaps, and type all step up with the breakpoint. Do **not** ship a card that only has a single desktop-scale padding value.

| Property              | Mobile        | `sm:` (640px+)      | `lg:` (1024px+) |
| --------------------- | ------------- | ------------------- | --------------- |
| Card padding          | `p-5`         | `sm:p-6`            | `lg:p-8`        |
| Header bottom margin  | `mb-3`/`mb-4` | `sm:mb-5`/`sm:mb-6` | —               |
| Header / logo gap     | `gap-2.5`     | `sm:gap-3`          | —               |
| Card title (job/role) | `text-lg`     | `sm:text-xl`        | `lg:text-2xl`   |
| Timestamp / meta text | `text-xs`     | `sm:text-sm`        | —               |
| Body / column gap     | `gap-4`       | `sm:gap-6`          | `md:gap-8`      |

**Between cards in a feed**, use `space-y-3 sm:space-y-6` (archive feeds) or `space-y-3 sm:space-y-4` (company page) — never a single large gap that dominates the mobile viewport.

### Sidebar / Aside Panel Padding

Side panels (e.g. the summary/aside panel in `write-review-form` and `submit-interview-form`) use their own padding scale, distinct from the card padding scale above:

| Property      | Mobile | `sm:` (640px+) | `lg:` (1024px+) |
| ------------- | ------ | -------------- | --------------- |
| Panel padding | `p-6`  | `sm:p-8`       | `lg:p-10`       |

### Responsive Component Sizes

**Logo boxes**

```tsx
<div className="h-16 w-16 md:h-32 md:w-32 rounded-xl">
```

Always use `shrink-0` to prevent the logo from compressing when text wraps next to it.

**Icon sizes**

Decorative / supporting icons (KPI card corners, inline badges) should be hidden on mobile to reclaim space:

```tsx
{
  /* Decorative icon — visible desktop only */
}
<div className="hidden h-12 w-12 md:flex ...">
  <TrendingUp size={20} />
</div>;

{
  /* Inline badge icon — shrinks on mobile */
}
<BadgeCheck className="h-5 w-5 shrink-0 md:h-7 md:w-7" />;
```

Never hide icons that carry semantic meaning (e.g. verified checkmark, rating star).

### Responsive Layout Patterns

**KPI / stat grid**

Use `grid-cols-3` at all breakpoints for 3-stat rows. Remove fixed card height on mobile; let content size the card naturally.

```tsx
<div className="grid grid-cols-3 gap-3 md:gap-8">
  <div className="rounded-xl p-4 md:h-48 md:p-8">
    <span className="text-[9px] md:text-xs ...">Label</span>
    <span className="text-2xl md:text-5xl ...">Value</span>
  </div>
</div>
```

**Horizontal scroll carousels**

Carousel card basis controls how many items are visible. Always show a partial peek of the next card so users know the list is scrollable.

```
basis-[82%]          → 1 card + peek   (< 640px)
sm:basis-[55%]       → ~1.8 cards      (640–767px)
md:basis-1/3         → 3 cards         (768–1023px)
lg:basis-1/4         → 4 cards         (1024px+)
```

**Two-column headers (logo + name)**

On mobile, collapse to a tighter row — don't stack logo above name. Reduce both sizes proportionally.

```tsx
<div className="flex items-center gap-4 md:gap-8">
  <div className="h-16 w-16 shrink-0 md:h-32 md:w-32 ...">...</div>
  <h1 className="text-2xl md:text-5xl ...">Company Name</h1>
</div>
```

**Stat row (homepage)**

Never use `flex-wrap` for a short stat row — it creates an orphan on the second line. Use `flex` with a smaller `gap-x` on mobile instead.

```tsx
<div className="flex items-center gap-x-5 md:gap-x-8">
```

---

## Border Radius

Base `--radius: 0.375rem`. Scale via Tailwind:

| Class                     | Value    | Use                          |
| ------------------------- | -------- | ---------------------------- |
| `rounded`                 | ~0.1rem  | Very sharp (almost square)   |
| `rounded-md`              | ~0.3rem  | Subtle rounding              |
| `rounded-lg`              | 0.375rem | Default shadcn components    |
| `rounded-xl`              | 0.75rem  | Cards, containers            |
| `rounded-full`            | 9999px   | Pills, avatar circles        |
| `rounded-full` from theme | 0.75rem  | Rounded-full in custom scale |

---

## Gradient

Primary CTA gradient (dark): `bg-gradient-to-b from-primary to-primary-container`

```
linear-gradient(180deg, #030303 0%, #1d1d1d 100%)
```

---

## Shadows

| Usage            | Class                                      |
| ---------------- | ------------------------------------------ |
| Search input     | `shadow-[0_20px_50px_rgba(27,27,27,0.05)]` |
| Company logo box | `shadow-sm`                                |
| CTA hover        | `hover:shadow-xl`                          |

---

## Shadcn Integration

This project uses shadcn with the `radix-nova` style. Components are in `components/ui/`. The shadcn CSS variables in `globals.css` are overridden to match the RateMyOrg palette.

Key shadcn mappings:

- `primary` = near-black (`#030303`) — used for primary buttons, active nav indicators
- `secondary` = surface-container (`#f0eded`) — soft gray backgrounds
- `muted` = surface-container-low (`#f6f3f2`) — form backgrounds, section bg
- `accent` = surface-container-highest (`#e5e2e1`) — hover states, subtle accents
- `destructive` = error red (`#ba1a1a`)

---

## Component Patterns

### Bento Mini Card

```tsx
<div className="bg-surface-container-lowest border border-surface-container-highest hover:border-primary p-8 rounded-xl flex flex-col transition-all duration-300">
```

### Primary CTA Button

```tsx
<button className="px-5 py-2 text-sm font-medium text-primary-foreground bg-gradient-to-b from-primary to-primary-container rounded-md shadow-sm active:scale-[0.98] hover:opacity-90">
```

### Small caps label

```tsx
<span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
```

### Minimal Input (form fields)

```tsx
<input className="border-outline-variant/30 focus:border-primary w-full border-b bg-transparent py-4 transition-all outline-none focus:ring-0" />
```

### Rating Bar

```tsx
<div className="bg-surface-container-highest h-1.5 w-full overflow-hidden rounded-full">
  <div className="bg-primary h-full rounded-full" style={{ width: "84%" }} />
</div>
```

### Anonymous Toggle

```tsx
<button
  role="switch"
  aria-checked={anonymous}
  className={cn(
    "relative h-6 w-11 rounded-full transition-colors",
    anonymous ? "bg-tertiary-fixed-dim" : "bg-surface-container-highest",
  )}
>
  <span
    className={cn(
      "absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform",
      anonymous ? "translate-x-5" : "translate-x-0",
    )}
  />
</button>
```

---

## Interaction Patterns

### List Item Hover — Primary Wipe Animation

All interactive list rows (company cards, dropdown items, search results) use a left-to-right `bg-primary` wipe as their hover state instead of a flat background swap. The item itself must be `relative overflow-hidden rounded-xl` (or `rounded-lg` for compact rows). Text and icons transition to `text-primary-foreground`.

**Rules:**

- Every dropdown list, search result list, or navigable row **must** use this animation — no plain `hover:bg-*` replacements.
- The container needs `overflow-hidden` so the wipe clips to its border radius.
- Use `rounded-xl` for full-height cards, `rounded-lg` for compact dropdown rows.

```tsx
<div className="group relative flex items-center gap-4 overflow-hidden rounded-lg px-4 py-3">
  {/* Wipe layer — always first child */}
  <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-lg transition-transform duration-300 ease-out group-hover:scale-x-100" />

  {/* All content must be relative so it sits above the wipe */}
  <span className="group-hover:text-primary-foreground relative font-medium transition-colors duration-300">
    Item label
  </span>
</div>
```

For Radix `SelectItem`, use `group-data-[highlighted]:scale-x-100` instead of `group-hover:scale-x-100` because Radix manages focus via the `data-highlighted` attribute.

---

## Dark Mode

Dark mode is supported via the `.dark` class on `<html>`. The dark palette uses:

- Background: `#121212`
- Surface containers: dark grays (`#1a1a1a` → `#303030`)
- Primary flips to light gray `#c8c6c5`
- Text flips to warm white `#fcf9f8`

Toggle by adding/removing the `dark` class on `<html>`.
