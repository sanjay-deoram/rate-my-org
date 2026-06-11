import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HomeSearchBar } from "@/components/home-search-bar";
import { HomeCarousel } from "@/components/home-carousel";
import { getHomepageStats, getTopRatedCompanies } from "@/lib/queries/homepage";

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
  const [stats, topRated] = await Promise.all([getHomepageStats(), getTopRatedCompanies(6)]);

  const leaderboard = topRated.slice(0, 4);

  return (
    <>
      <Nav />
      <main className="bg-background min-h-screen pt-20">
        {/* Hero — two-column on desktop, stacked on mobile */}
        <section className="mx-auto max-w-7xl px-8 py-20 md:px-12 md:py-28">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
            {/* Left: copy + search + stats */}
            <div className="flex-1">
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
                Every company.
                <br />
                On the record.
              </h1>

              <p className="text-on-surface-variant mb-10 max-w-md text-base leading-relaxed md:text-lg">
                A permanent, anonymous index of what it&apos;s really like to work — and interview —
                anywhere. No login. No takedowns.
              </p>

              <div className="mb-8 w-full max-w-lg">
                <HomeSearchBar />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
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
            <div className="w-full shrink-0 md:w-[400px]">
              <TopRatedCard leaderboard={leaderboard} />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-surface-container-highest mx-8 border-t md:mx-12" />

        {/* Trending carousel section */}
        <section className="mx-auto max-w-7xl px-8 py-20 md:px-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-tertiary-fixed-dim h-1.5 w-1.5 rounded-full" />
                <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
                  Trending This Week
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Where people are looking now
              </h2>
            </div>
          </div>
          <HomeCarousel companies={topRated} />
        </section>

        {/* Editorial section */}
        <section className="border-surface-container-highest border-t">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-8 py-32 md:flex-row md:px-12">
            <div className="flex-1">
              <div className="bg-surface-container group relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl">
                <div className="from-surface-container-high to-surface-dim absolute inset-0 bg-linear-to-br" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-on-surface-variant/10 text-[120px] leading-none font-black tracking-tighter select-none">
                    R
                  </div>
                </div>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(27,27,27,0.02)_10px,rgba(27,27,27,0.02)_20px)]" />
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                The Digital Curator
              </span>
              <blockquote className="text-primary text-4xl leading-tight font-medium tracking-tight md:text-5xl">
                &quot;We believe that the most valuable data isn&apos;t in a brochure, but in the
                collective experiences of the people who do the work every day.&quot;
              </blockquote>
              <div className="pt-4">
                <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
                  RateMyOrg isn&apos;t just another review site. We treat organizational data as
                  high-end editorial content, ensuring every insight is presented with the weight
                  and clarity it deserves.
                </p>
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
};

function TopRatedCard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="bg-surface-container-lowest border-surface-container-highest overflow-hidden rounded-2xl border">
      {/* Card header */}
      <div className="border-surface-container-highest flex items-center justify-between border-b px-6 py-4">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Top Rated</span>
        <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.2em] uppercase">
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
                className="border-surface-container-highest group relative isolate flex items-center gap-4 overflow-hidden border-b px-6 py-4 last:border-b-0"
              >
                {/* Slide-in fill */}
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />

                <span className="text-on-surface-variant relative w-6 shrink-0 font-mono text-xs transition-colors duration-300 group-hover:text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="bg-surface-container relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors duration-300 group-hover:bg-white/10">
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
                  <p className="truncate text-sm leading-tight font-bold transition-colors duration-300 group-hover:text-white">
                    {company.name}
                  </p>
                  {company.industry && (
                    <p className="text-on-surface-variant truncate text-xs transition-colors duration-300 group-hover:text-white/50">
                      {company.industry}
                    </p>
                  )}
                </div>

                <div className="relative flex shrink-0 items-center gap-1">
                  {rating ? (
                    <>
                      <BadgeCheck
                        size={12}
                        className="text-tertiary-fixed-dim fill-current transition-colors duration-300 group-hover:text-white"
                      />
                      <span className="text-sm font-black tabular-nums transition-colors duration-300 group-hover:text-white">
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
