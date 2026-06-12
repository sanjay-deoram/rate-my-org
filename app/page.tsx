import Link from "next/link";
import { Ghost, TrendingUp, TrendingDown } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HomeSearchBar } from "@/components/home-search-bar";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeReviews } from "@/components/home-reviews";
import { getHomepageStats, getTopRatedCompanies, getRecentReviews } from "@/lib/queries/homepage";
import { RatingTrend } from "@/types/homepage";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function fmtRating(raw: string | null): string | null {
  if (!raw) return null;
  const n = parseFloat(raw);
  if (isNaN(n)) return null;
  return (Math.round(n * 10) / 10).toFixed(1);
}

export default async function HomePage() {
  const [stats, topRated, recentReviews] = await Promise.all([
    getHomepageStats(),
    getTopRatedCompanies(6),
    getRecentReviews(12),
  ]);

  const leaderboard = topRated.slice(0, 4);

  return (
    <>
      <Nav />
      <main className="bg-background min-h-screen pt-20">
        {/* Hero — two-column on desktop, stacked on mobile */}
        <section className="mx-auto max-w-7xl px-8 py-14 md:px-12 md:py-20 lg:py-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Left: copy + search + stats */}
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="bg-tertiary-fixed-dim absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-tertiary-fixed-dim relative inline-flex h-2 w-2 rounded-full" />
                </span>
                <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                  The Workplace Index · Live
                </span>
              </div>

              <h1 className="text-foreground mb-6 text-5xl leading-[1.05] font-black tracking-tighter md:text-6xl lg:text-7xl">
                Rate your org.
                <br />
                <span className="inline-flex items-center gap-1.5 md:gap-3">
                  <span className="from-foreground to-outline bg-gradient-to-r bg-clip-text text-transparent italic">
                    Anonymously.
                  </span>
                  <Ghost
                    className="animate-float text-foreground/25 h-[0.5em] w-[0.5em] shrink-0 md:h-[0.65em] md:w-[0.65em]"
                    strokeWidth={1.2}
                  />
                </span>
              </h1>

              <p className="text-on-surface-variant mb-10 max-w-md text-base leading-relaxed md:text-lg">
                Know before you join. Real reviews, real interviews. No login. No takedowns.
              </p>

              <div className="mb-8 w-full max-w-lg">
                <HomeSearchBar />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-x-5 md:gap-x-8 lg:justify-start">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-xl font-black tabular-nums">
                    {formatCount(stats.totalReviews)}
                  </span>
                  <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                    Reviews
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-xl font-black tabular-nums">
                    {formatCount(stats.totalCompanies)}
                  </span>
                  <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                    Companies
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-xl font-black tabular-nums">
                    {formatCount(stats.totalInterviews)}
                  </span>
                  <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                    Interviews
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Top Rated card — desktop only shows here; on mobile it renders below */}
            <div className="w-full shrink-0 lg:w-[420px]">
              <TopRatedCard leaderboard={leaderboard} />
            </div>
          </div>
        </section>

        {/* Trending carousel section */}
        <section className="bg-surface-container-low">
          <div className="mx-auto max-w-7xl px-8 py-20 md:px-12">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-tertiary-fixed-dim h-1.5 w-1.5 rounded-full" />
                  <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                    Trending This Week
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                  Where people are looking now
                </h2>
              </div>
            </div>
            <HomeCarousel companies={topRated} />
          </div>
        </section>

        {/* Recent reviews */}
        <HomeReviews reviews={recentReviews} />

        {/* CTA — split with live stat panel */}
        <section className="border-surface-container-highest border-t">
          <div className="mx-auto max-w-7xl px-8 py-24 md:px-12">
            <div className="flex flex-col gap-16 md:flex-row md:items-center">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-2">
                  <span className="bg-tertiary-fixed-dim h-1.5 w-1.5 animate-pulse rounded-full" />
                  <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                    Growing every day
                  </span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
                  A living record
                  <br />
                  of the workplace.
                </h2>
                <p className="text-on-surface-variant max-w-sm text-base leading-relaxed">
                  Every submission is anonymous and permanent. No login, no takedowns, no corporate
                  spin.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/reviews/write"
                    className="bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-center text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Write a Review
                  </Link>
                  <Link
                    href="/interviews/submit"
                    className="border-surface-container-highest hover:border-primary rounded-full border px-6 py-2.5 text-center text-sm font-bold transition-colors duration-300"
                  >
                    Submit Interview Questions
                  </Link>
                </div>
              </div>

              <div className="flex-1">
                <div className="from-primary to-primary-container rounded-2xl bg-gradient-to-br p-8">
                  <p className="text-on-primary-container mb-8 text-[10px] font-bold tracking-[0.2em] uppercase">
                    Index at a glance
                  </p>
                  {(
                    [
                      ["Reviews submitted", formatCount(stats.totalReviews)],
                      ["Companies indexed", formatCount(stats.totalCompanies)],
                      ["Interview reports", formatCount(stats.totalInterviews)],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between border-t border-white/10 py-5"
                    >
                      <span className="text-on-primary-container text-sm">{label}</span>
                      <span className="text-primary-foreground text-3xl font-black tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type LeaderboardEntry = {
  slug: string;
  name: string;
  industry: string | null;
  logoKey: string | null;
  avgRating: string | null;
  ratingTrend: RatingTrend;
};

function ratingColor(avgRating: string | null): string {
  if (!avgRating) return "";
  return parseFloat(avgRating) >= 2.5 ? "text-tertiary-fixed-dim" : "text-destructive";
}

function TrendIcon({ trend, className }: { trend: RatingTrend; className?: string }) {
  if (trend === "up") return <TrendingUp size={12} className={className} />;
  if (trend === "down") return <TrendingDown size={12} className={className} />;
  return null;
}

function TopRatedCard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="bg-surface-container-lowest border-surface-container-highest overflow-hidden rounded-2xl border">
      {/* Card header */}
      <div className="from-primary to-primary-container flex items-center justify-between bg-gradient-to-b px-7 py-5">
        <span className="text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
          Top Rated
        </span>
        <span className="text-primary-foreground/40 text-[10px] font-bold tracking-[0.2em] uppercase">
          Score
        </span>
      </div>

      {/* Rows */}
      {leaderboard.length === 0 ? (
        <p className="text-on-surface-variant px-6 py-8 text-sm">No rated companies yet.</p>
      ) : (
        <div>
          {leaderboard.map((company, i) => {
            const logoSrc = company.logoKey && CDN ? `${CDN}/${company.logoKey}` : null;
            const rating = fmtRating(company.avgRating);
            return (
              <Link
                key={company.slug}
                href={`/orgs/${company.slug}`}
                className="border-surface-container-highest group relative isolate flex items-center gap-4 overflow-hidden border-b px-7 py-5 last:border-b-0"
              >
                {/* Slide-in fill */}
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />

                <span className="text-on-surface-variant relative w-6 shrink-0 font-mono text-xs transition-colors duration-300 group-hover:text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="bg-surface-container relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors duration-300 group-hover:bg-white/10">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-primary relative text-base leading-none font-black transition-colors duration-300 group-hover:text-white">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="relative min-w-0 flex-1">
                  <p className="truncate text-base leading-tight font-bold transition-colors duration-300 group-hover:text-white">
                    {company.name}
                  </p>
                </div>

                <div className="relative flex shrink-0 items-center gap-1">
                  {rating ? (
                    <>
                      <TrendIcon
                        trend={company.ratingTrend}
                        className={`transition-colors duration-300 group-hover:text-white ${ratingColor(company.avgRating)}`}
                      />
                      <span
                        className={`text-base font-black tabular-nums transition-colors duration-300 group-hover:text-white ${ratingColor(company.avgRating)}`}
                      >
                        {rating}
                      </span>
                    </>
                  ) : (
                    <span className="text-on-surface-variant text-xs transition-colors duration-300 group-hover:text-white/50">
                      —
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
