"use client";

import Link from "next/link";
import { Star, MessageSquare, Users } from "lucide-react";

const MOCK_COMPANIES = [
  { name: "Stripe", slug: "stripe", logoUrl: null, rating: 4.2, reviews: 38, interviews: 12 },
  { name: "Vercel", slug: "vercel", logoUrl: null, rating: 4.7, reviews: 21, interviews: 6 },
  { name: "Linear", slug: "linear", logoUrl: null, rating: 3.9, reviews: 14, interviews: 4 },
];

// ═══════════════════════════════════════════════════════════════════
// OPTION A — Pill badges inline under the name
// ═══════════════════════════════════════════════════════════════════

function CardA({
  company,
}: {
  company: { name: string; slug: string; rating: number; reviews: number; interviews: number };
}) {
  return (
    <Link
      href="#"
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-xl px-6 py-5"
    >
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />
      <div className="relative shrink-0">
        <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-14 w-14 items-center justify-center rounded-lg text-xl font-black transition-colors duration-300 group-hover:bg-white/10">
          {company.name[0]}
        </div>
      </div>
      <div className="relative min-w-0 flex-1">
        <h3 className="text-foreground group-hover:text-primary-foreground truncate text-base font-bold transition-colors duration-300">
          {company.name}
        </h3>
        <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[11px] tracking-wide transition-colors duration-300">
          {company.slug}
        </p>
        {/* Pill badges */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700 transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
            <Star size={9} className="fill-current" />
            {company.rating}
          </span>
          <span className="bg-surface-container text-on-surface-variant flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
            <MessageSquare size={9} />
            {company.reviews}
          </span>
          <span className="bg-surface-container text-on-surface-variant flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
            <Users size={9} />
            {company.interviews}
          </span>
        </div>
      </div>
      <span className="text-on-surface-variant group-hover:text-primary-foreground relative shrink-0 text-sm font-medium transition-colors duration-300">
        View →
      </span>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION B — Bottom stat row with hairline divider
// ═══════════════════════════════════════════════════════════════════

function CardB({
  company,
}: {
  company: { name: string; slug: string; rating: number; reviews: number; interviews: number };
}) {
  return (
    <Link href="#" className="group relative isolate overflow-hidden rounded-xl">
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />
      {/* Top row */}
      <div className="relative flex items-center gap-5 px-6 pt-5 pb-4">
        <div className="shrink-0">
          <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-14 w-14 items-center justify-center rounded-lg text-xl font-black transition-colors duration-300 group-hover:bg-white/10">
            {company.name[0]}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground group-hover:text-primary-foreground truncate text-base font-bold transition-colors duration-300">
            {company.name}
          </h3>
          <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[11px] tracking-wide transition-colors duration-300">
            {company.slug}
          </p>
        </div>
        <span className="text-on-surface-variant group-hover:text-primary-foreground relative shrink-0 text-sm font-medium transition-colors duration-300">
          View →
        </span>
      </div>
      {/* Stat row */}
      <div className="border-outline-variant/10 relative flex items-center gap-6 border-t px-6 py-3 transition-colors duration-300 group-hover:border-white/10">
        <div className="flex items-center gap-1.5">
          <Star
            size={11}
            className="fill-amber-400 text-amber-400 transition-colors duration-300 group-hover:fill-white group-hover:text-white"
          />
          <span className="text-foreground group-hover:text-primary-foreground font-mono text-xs font-bold transition-colors duration-300">
            {company.rating}
          </span>
          <span className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[10px] transition-colors duration-300">
            rating
          </span>
        </div>
        <div className="bg-outline-variant/20 h-3 w-px transition-colors duration-300 group-hover:bg-white/20" />
        <div className="flex items-center gap-1.5">
          <MessageSquare
            size={11}
            className="text-on-surface-variant group-hover:text-primary-foreground/70 transition-colors duration-300"
          />
          <span className="text-foreground group-hover:text-primary-foreground font-mono text-xs font-bold transition-colors duration-300">
            {company.reviews}
          </span>
          <span className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[10px] transition-colors duration-300">
            reviews
          </span>
        </div>
        <div className="bg-outline-variant/20 h-3 w-px transition-colors duration-300 group-hover:bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Users
            size={11}
            className="text-on-surface-variant group-hover:text-primary-foreground/70 transition-colors duration-300"
          />
          <span className="text-foreground group-hover:text-primary-foreground font-mono text-xs font-bold transition-colors duration-300">
            {company.interviews}
          </span>
          <span className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[10px] transition-colors duration-300">
            interviews
          </span>
        </div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION C — Right-side stacked stats, replaces "View →"
// ═══════════════════════════════════════════════════════════════════

function CardC({
  company,
}: {
  company: { name: string; slug: string; rating: number; reviews: number; interviews: number };
}) {
  return (
    <Link
      href="#"
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-xl px-6 py-5"
    >
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />
      <div className="relative shrink-0">
        <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-14 w-14 items-center justify-center rounded-lg text-xl font-black transition-colors duration-300 group-hover:bg-white/10">
          {company.name[0]}
        </div>
      </div>
      <div className="relative min-w-0 flex-1">
        <h3 className="text-foreground group-hover:text-primary-foreground truncate text-base font-bold transition-colors duration-300">
          {company.name}
        </h3>
        <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[11px] tracking-wide transition-colors duration-300">
          {company.slug}
        </p>
      </div>
      {/* Right-side stacked stats */}
      <div className="relative flex shrink-0 flex-col items-end gap-1 text-right">
        <div className="flex items-center gap-1">
          <Star
            size={10}
            className="fill-amber-400 text-amber-400 transition-colors duration-300 group-hover:fill-white group-hover:text-white"
          />
          <span className="text-foreground group-hover:text-primary-foreground font-mono text-xs font-bold transition-colors duration-300">
            {company.rating}
          </span>
        </div>
        <span className="text-on-surface-variant group-hover:text-primary-foreground/60 font-mono text-[10px] transition-colors duration-300">
          {company.reviews} reviews
        </span>
        <span className="text-on-surface-variant group-hover:text-primary-foreground/60 font-mono text-[10px] transition-colors duration-300">
          {company.interviews} interviews
        </span>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════

const VARIANTS = [
  {
    id: "A",
    title: "Pill Badges",
    tagline: "Small color-coded chips inline beneath the company name",
    Card: CardA,
  },
  {
    id: "B",
    title: "Bottom Stat Row",
    tagline: "Hairline divider separates the card header from a stats footer",
    Card: CardB,
  },
  {
    id: "C",
    title: "Right-Side Stack",
    tagline: "Rating + counts stacked vertically on the far right, replacing 'View →'",
    Card: CardC,
  },
];

export default function CompanyCardDesignPage() {
  return (
    <div className="bg-background min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-outline font-mono text-xs tracking-widest uppercase">Design Preview</p>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Company Card — Stats Variants</h1>
        <p className="text-on-surface-variant mb-16 max-w-xl">
          Three ways to surface rating, review count, and interview count on each company card.
          Hover each card to see the active state.
        </p>

        <div className="space-y-16">
          {VARIANTS.map((v) => (
            <section key={v.id} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-black">
                  {v.id}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{v.title}</h2>
                  <p className="text-on-surface-variant text-sm">{v.tagline}</p>
                </div>
              </div>
              <div className="divide-outline-variant/20 divide-y rounded-2xl bg-white px-6 pt-2 shadow-sm">
                {MOCK_COMPANIES.map((company) => (
                  <v.Card key={company.slug} company={company} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-outline-variant/20 mt-16 border-t pt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Temp preview — delete{" "}
            <code className="bg-surface-container-high rounded px-1.5 py-0.5 text-xs">
              app/design-preview/cards/
            </code>{" "}
            after picking a variant.
          </p>
        </div>
      </div>
    </div>
  );
}
