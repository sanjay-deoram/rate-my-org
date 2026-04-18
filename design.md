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

### Accent (Tertiary / Green)

| Token                  | Value     | Tailwind class                                     | Use                              |
| ---------------------- | --------- | -------------------------------------------------- | -------------------------------- |
| `--tertiary-fixed`     | `#6bff84` | `bg-tertiary-fixed`                                | Accent background                |
| `--tertiary-fixed-dim` | `#3be366` | `bg-tertiary-fixed-dim`, `text-tertiary-fixed-dim` | Verified icons, anonymous toggle |
| `--on-tertiary-fixed`  | `#002107` | `text-on-tertiary-fixed`                           | Text on green bg                 |

### Inverse Tokens

| Token                  | Value     | Tailwind class            | Use                     |
| ---------------------- | --------- | ------------------------- | ----------------------- |
| `--inverse-surface`    | `#303030` | `bg-inverse-surface`      | "Load More" hover state |
| `--inverse-on-surface` | `#f3f0ef` | `text-inverse-on-surface` | Text on inverse surface |
| `--inverse-primary`    | `#c8c6c5` | `text-inverse-primary`    | Logo on dark bg         |

---

## Typography

| Role    | Font          | Variable               | Tailwind class |
| ------- | ------------- | ---------------------- | -------------- |
| Body    | Inter         | `--font-inter`         | `font-sans`    |
| Heading | Inter         | `--font-inter`         | `font-sans`    |
| Mono    | IBM Plex Mono | `--font-ibm-plex-mono` | `font-mono`    |

### Type Scale Usage

- **Display / Hero**: `text-5xl md:text-7xl font-bold tracking-tighter`
- **Section headings**: `text-4xl font-bold tracking-tight`
- **Card headings**: `text-2xl font-bold tracking-tight`
- **Body large**: `text-lg leading-relaxed`
- **Body**: `text-sm leading-relaxed`
- **Label / mono caps**: `font-mono text-[10px] uppercase tracking-widest`
- **Italic quotes**: `italic font-bold` or `italic leading-relaxed`

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

### Mono Label

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

## Dark Mode

Dark mode is supported via the `.dark` class on `<html>`. The dark palette uses:

- Background: `#121212`
- Surface containers: dark grays (`#1a1a1a` → `#303030`)
- Primary flips to light gray `#c8c6c5`
- Text flips to warm white `#fcf9f8`

Toggle by adding/removing the `dark` class on `<html>`.
