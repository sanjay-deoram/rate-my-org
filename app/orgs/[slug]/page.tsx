import { notFound } from "next/navigation";
import {
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  BookOpen,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import type { RatingTrend } from "@/types/homepage";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getCompanyWithStats } from "@/lib/queries/orgs";
import { OrgContent } from "@/components/org-content";
import { DecorativeShapes } from "@/components/decorative-shapes";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCompanyWithStats(slug);
  if (!data) return {};
  const { company, stats } = data;
  return {
    title: `${company.name} Reviews — ${stats.avgRating.toFixed(1)}/5.0`,
    description: `${company.name}`,
  };
}

export default async function OrgProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCompanyWithStats(slug);

  if (!data) notFound();

  const { company, stats } = data;
  const initial = company.name[0].toUpperCase();
  const tagline = company.description ?? company.industry ?? "";
  const logoUrl = company.logoKey
    ? `${process.env.NEXT_PUBLIC_LOGO_CDN ?? ""}/${company.logoKey}`
    : null;

  return (
    <>
      <Nav />
      <main className="relative overflow-hidden pt-28 pb-24">
        <DecorativeShapes variant="profile" />
        {/* Back button */}
        <div className="relative z-10 mx-auto mb-5 max-w-7xl px-5 md:mb-8 md:px-12">
          <Link
            href="/companies"
            className="text-on-surface-variant hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Brand header */}
        <section className="relative z-10 mx-auto mb-10 max-w-7xl px-5 md:mb-16 md:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8">
            <div className="flex min-w-0 items-center gap-4 md:gap-8">
              <div className="bg-surface-container-lowest border-border/20 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm md:h-32 md:w-32">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain p-2 md:p-3"
                  />
                ) : (
                  <span className="text-foreground text-2xl font-black md:text-5xl">{initial}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 md:mb-2 md:gap-3">
                  <h1 className="text-foreground break-anywhere text-2xl font-black sm:text-3xl md:text-5xl">
                    {company.name}
                  </h1>
                  <BadgeCheck className="text-tertiary-fixed-dim h-5 w-5 shrink-0 fill-current md:h-7 md:w-7" />
                </div>
                <p className="text-on-surface-variant break-anywhere text-xs font-medium uppercase md:text-sm">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-3 md:gap-4 md:text-right">
              <div className="flex flex-col md:items-end">
                <span className="text-on-surface-variant label-eyebrow mb-1 md:text-sm">
                  Aggregate Rating
                </span>
                <div
                  className={`text-5xl leading-none font-black md:text-7xl ${stats.reviewCount > 0 ? (stats.avgRating >= 2.5 ? "text-tertiary-fixed-dim" : "text-destructive") : ""}`}
                >
                  {stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "—"}
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 md:items-end">
                <div className="text-on-surface-variant font-mono text-base md:text-xl">/ 5.0</div>
                {stats.ratingTrend !== "neutral" && <TrendBadge trend={stats.ratingTrend} />}
              </div>
            </div>
          </div>
        </section>

        {/* KPI grid */}
        <section className="relative z-10 mx-auto mb-5 max-w-7xl px-5 md:mb-8 md:px-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-8">
            <div className="bg-surface-container-low hover:bg-surface-container-highest flex flex-col justify-between rounded-xl p-4 transition-all duration-300 md:h-48 md:p-8">
              <span className="text-on-surface-variant font-mono text-[11px] tracking-widest uppercase md:text-xs">
                Recommend
              </span>
              <div className="mt-3 flex items-end justify-between md:mt-0">
                <span
                  className={`text-2xl font-bold md:text-5xl ${stats.reviewCount > 0 ? (stats.recommendPct >= 50 ? "text-tertiary-fixed-dim" : "text-destructive") : ""}`}
                >
                  {stats.reviewCount > 0 ? `${stats.recommendPct}%` : "—"}
                </span>
                <div className="border-outline-variant/20 hidden h-12 w-12 items-center justify-center rounded-full border md:flex">
                  {stats.recommendPct >= 50 ? (
                    <TrendingUp size={20} className="text-tertiary-fixed-dim" />
                  ) : (
                    <TrendingDown size={20} className="text-destructive" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low hover:bg-surface-container-highest flex flex-col justify-between rounded-xl p-4 transition-all duration-300 md:h-48 md:p-8">
              <span className="text-on-surface-variant font-mono text-[11px] tracking-widest uppercase md:text-xs">
                Reviews
              </span>
              <div className="mt-3 flex items-end justify-between md:mt-0">
                <span className="text-2xl font-bold md:text-5xl">{stats.reviewCount}</span>
                <div className="border-outline-variant/20 hidden h-12 w-12 items-center justify-center rounded-full border md:flex">
                  <MessageSquare size={20} className="text-tertiary-fixed-dim" />
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground flex flex-col justify-between rounded-xl p-4 md:h-48 md:p-8">
              <span className="text-on-primary-container font-mono text-[11px] tracking-widest uppercase md:text-xs">
                Interviews
              </span>
              <div className="mt-3 flex items-end justify-between md:mt-0">
                <span className="text-2xl font-bold md:text-5xl">{stats.interviewCount}</span>
                <BookOpen className="hidden md:block" size={28} />
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10">
          <OrgContent data={data} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function TrendBadge({ trend }: { trend: RatingTrend }) {
  const isUp = trend === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${isUp ? "bg-tertiary-fixed-dim/15 text-token-green-deep" : "bg-destructive/10 text-destructive"}`}
    >
      {isUp ? (
        <TrendingUp size={10} className="text-tertiary-fixed-dim" />
      ) : (
        <TrendingDown size={10} />
      )}
      {isUp ? "Trending up" : "Trending down"}
    </span>
  );
}
