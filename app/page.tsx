import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
    getTopRatedCompanies(8),
    getRecentReviews(12),
  ]);

  const leaderboard = topRated.slice(0, 5);

  return (
    <>
      <Nav />
      <main className="bg-background min-h-screen overflow-hidden pt-24">
        <section className="relative">
          <div className="bg-token-green/90 absolute top-20 left-0 hidden h-[560px] w-[38vw] -translate-x-1/3 rotate-[-8deg] rounded-[2rem] shadow-2xl lg:block" />
          <div className="bg-token-lime/80 absolute top-44 right-0 hidden h-72 w-40 translate-x-16 rotate-[5deg] rounded-[1.25rem] lg:block" />
          <div className="mx-auto max-w-7xl px-5 pt-4 pb-24 md:px-8 lg:pt-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="text-on-surface-variant mb-4 text-xs font-semibold">
                Anonymous workplace reviews, interviews, and company signals
              </p>
              <h1 className="max-w-4xl text-4xl leading-[0.98] font-black sm:text-5xl md:text-7xl lg:text-8xl">
                Know the culture before the offer lands
              </h1>
              <p className="text-on-surface-variant mt-6 max-w-2xl text-base leading-7 md:text-lg">
                RateMyOrg turns unfiltered employee reviews and interview reports into a clear read
                on where work feels fair, sharp, and worth your time.
              </p>
              <div className="mt-8 w-full max-w-2xl">
                <HomeSearchBar />
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/reviews/write"
                  className="bg-token-blue inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Write a review
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/interviews/submit"
                  className="border-border bg-card hover:border-primary inline-flex h-12 items-center rounded-full border px-6 text-sm font-bold transition active:scale-[0.98]"
                >
                  Share interview questions
                </Link>
              </div>
            </div>

            <div className="relative mt-16 min-h-[620px] lg:mt-20">
              <WorkspaceScene stats={stats} leaderboard={leaderboard} />
            </div>
          </div>
        </section>

        <section className="bg-paper-soft py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-on-surface-variant text-xs font-bold">Workplace examples</p>
              <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
                Each profile shows what people actually experience
              </h2>
              <p className="text-on-surface-variant mt-4 leading-7">
                Search companies, compare ratings, read recent headlines, and spot the interview
                patterns candidates keep running into.
              </p>
            </div>
            <div className="mt-12">
              <HomeCarousel companies={topRated} />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-on-surface-variant text-xs font-bold">Anonymous by design</p>
              <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
                Useful signal without accounts, followers, or corporate polish
              </h2>
              <p className="text-on-surface-variant mt-5 max-w-xl leading-7">
                Submissions are built around concrete context: role, status, ratings, written
                experience, and interview rounds. The product keeps the friction low and the record
                focused.
              </p>
            </div>
            <div className="border-border bg-card soft-shadow rounded-[1.75rem] border p-4">
              <SignalMap />
            </div>
          </div>
        </section>

        <HomeReviews reviews={recentReviews} />

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="bg-primary text-primary-foreground mx-auto max-w-5xl rounded-[1.75rem] px-6 py-14 text-center md:px-12">
            <p className="text-xs font-bold text-white/55">Contribute to the index</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
              Help the next candidate read the room before they join
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/reviews/write"
                className="bg-token-lime text-on-tertiary-fixed inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-bold transition hover:opacity-90 active:scale-[0.98]"
              >
                Post an anonymous review
              </Link>
              <Link
                href="/companies"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold transition hover:bg-white/10 active:scale-[0.98]"
              >
                Browse companies
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type HomepageStats = {
  totalReviews: number;
  totalCompanies: number;
  totalInterviews: number;
};

type LeaderboardEntry = {
  slug: string;
  name: string;
  industry: string | null;
  logoKey: string | null;
  avgRating: string | null;
  ratingTrend: RatingTrend;
};

function WorkspaceScene({
  stats,
  leaderboard,
}: {
  stats: HomepageStats;
  leaderboard: LeaderboardEntry[];
}) {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="bg-token-blue/80 absolute top-6 left-1/2 z-10 hidden h-32 w-32 -translate-x-[520px] rotate-[-12deg] rounded-[1.25rem] lg:block" />
      <div className="absolute top-44 left-1/2 z-10 hidden h-44 w-44 -translate-x-[410px] rotate-[8deg] rounded-full bg-white shadow-xl lg:block" />
      <div className="bg-ink absolute top-60 left-1/2 z-30 hidden h-12 w-28 -translate-x-[345px] rotate-[-18deg] rounded-md lg:block" />
      <div className="bg-ink desk-shadow absolute top-36 left-1/2 z-20 hidden h-52 w-72 -translate-x-[190px] rotate-[-9deg] rounded-[1rem] p-8 text-white lg:block">
        <p className="text-xs text-white/45">RateMyOrg</p>
        <p className="mt-9 text-4xl leading-none font-black">Culture Signal Playbook</p>
      </div>

      <div className="relative z-30 mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="border-border bg-card desk-shadow rounded-[1.5rem] border p-5 md:p-7 lg:rotate-[1.5deg]">
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Live index</p>
              <h2 className="text-2xl font-black">Workplace pulse</h2>
            </div>
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full">
              <ShieldCheck size={17} />
            </div>
          </div>
          <div className="grid gap-3 py-5 sm:grid-cols-3">
            <StatTile
              icon={MessageSquareText}
              label="Reviews"
              value={formatCount(stats.totalReviews)}
            />
            <StatTile
              icon={Building2}
              label="Companies"
              value={formatCount(stats.totalCompanies)}
            />
            <StatTile
              icon={ClipboardList}
              label="Interviews"
              value={formatCount(stats.totalInterviews)}
            />
          </div>
          <TopRatedCard leaderboard={leaderboard} />
        </div>

        <div className="relative min-h-[520px]">
          <PhoneMockup />
          <div className="border-border bg-card soft-shadow absolute right-0 bottom-4 left-10 rounded-[1.25rem] border p-5 sm:left-28">
            <div className="flex items-center gap-3">
              <div className="bg-token-lime text-on-tertiary-fixed flex h-10 w-10 items-center justify-center rounded-full">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-black">No login wall</p>
                <p className="text-on-surface-variant text-sm">
                  Review, rate, or share interview notes fast.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-10 right-5 hidden h-24 w-24 rounded-full border-[18px] border-black/10 sm:block" />
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquareText;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-paper-soft rounded-xl p-4">
      <Icon size={16} className="text-token-green-deep mb-5" />
      <p className="text-3xl font-black tabular-nums">{value}</p>
      <p className="text-on-surface-variant mt-1 text-xs font-semibold">{label}</p>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="border-ink bg-ink desk-shadow absolute top-4 left-1/2 w-[255px] -translate-x-1/2 rotate-[8deg] rounded-[2.1rem] border-[10px] p-2">
      <div className="overflow-hidden rounded-[1.55rem] bg-white">
        <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-bold">
          <span>9:41</span>
          <span className="bg-ink h-5 w-16 rounded-full" />
        </div>
        <div className="px-5 pt-7 pb-5">
          <p className="text-on-surface-variant text-xs font-semibold">Latest review</p>
          <h3 className="mt-2 text-3xl leading-none font-black">4.2</h3>
          <div className="text-token-green mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <div className="bg-paper-soft mt-5 rounded-xl p-4">
            <p className="text-sm font-bold">Strong team, fuzzy promotion path</p>
            <p className="text-on-surface-variant mt-2 text-xs leading-5">
              Product pace is high and managers are responsive. Compensation and level criteria need
              more daylight.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-token-lime/70 rounded-lg p-3">
              <p className="text-[11px] font-bold">Culture</p>
              <p className="text-xl font-black">4.5</p>
            </div>
            <div className="bg-token-blue/20 rounded-lg p-3">
              <p className="text-[11px] font-bold">Interview</p>
              <p className="text-xl font-black">3 rnd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ratingColor(avgRating: string | null): string {
  if (!avgRating) return "";
  return parseFloat(avgRating) >= 2.5 ? "text-token-green-deep" : "text-destructive";
}

function TrendIcon({ trend, className }: { trend: RatingTrend; className?: string }) {
  if (trend === "up") return <TrendingUp size={13} className={className} />;
  if (trend === "down") return <TrendingDown size={13} className={className} />;
  return null;
}

function TopRatedCard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="border-border overflow-hidden rounded-xl border bg-white">
      <div className="bg-ink flex items-center justify-between px-5 py-4 text-white">
        <span className="text-xs font-bold">Top rated organizations</span>
        <span className="text-xs font-bold text-white/45">Score</span>
      </div>

      {leaderboard.length === 0 ? (
        <p className="text-on-surface-variant px-5 py-8 text-sm">No rated companies yet.</p>
      ) : (
        <div>
          {leaderboard.map((company, i) => {
            const logoSrc = company.logoKey && CDN ? `${CDN}/${company.logoKey}` : null;
            const rating = fmtRating(company.avgRating);
            return (
              <Link
                key={company.slug}
                href={`/orgs/${company.slug}`}
                className="group border-border hover:bg-token-lime/35 flex min-h-20 items-center gap-4 border-b px-5 py-4 transition last:border-b-0"
              >
                <span className="text-on-surface-variant w-6 shrink-0 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="bg-paper-soft flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-base font-black">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{company.name}</p>
                  <p className="text-on-surface-variant truncate text-xs">
                    {company.industry ?? "Organization profile"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {rating ? (
                    <>
                      <TrendIcon
                        trend={company.ratingTrend}
                        className={ratingColor(company.avgRating)}
                      />
                      <span className={`font-black tabular-nums ${ratingColor(company.avgRating)}`}>
                        {rating}
                      </span>
                    </>
                  ) : (
                    <span className="text-on-surface-variant text-xs">New</span>
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

function SignalMap() {
  const withCards = [
    ["Confident", "Reviews show the real work"],
    ["Prepared", "Interview rounds are visible"],
    ["Selective", "Tradeoffs are easier to compare"],
    ["Committed", "Candidates know what they accept"],
  ];
  const withoutCards = ["Unclear", "Surprised", "Second guessing", "Churn risk"];

  return (
    <div className="space-y-4">
      <div className="text-token-blue flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-black">
          <BadgeCheck size={18} />
          With RateMyOrg
        </div>
        <span className="text-sm font-bold">More informed</span>
      </div>
      <div className="border-token-blue bg-token-blue/10 grid overflow-hidden rounded-xl border sm:grid-cols-4">
        {withCards.map(([label, note], i) => (
          <div key={label} className="border-token-blue/20 p-4 sm:border-r sm:last:border-r-0">
            <div className="bg-token-lime mb-6 flex h-9 w-9 items-center justify-center rounded-full font-black">
              {i + 1}
            </div>
            <p className="font-black">{label}</p>
            <p className="text-on-surface-variant mt-2 text-xs leading-5">{note}</p>
          </div>
        ))}
      </div>
      <div className="bg-paper-soft grid overflow-hidden rounded-xl sm:grid-cols-4">
        {withoutCards.map((label) => (
          <div key={label} className="border-border p-4 sm:border-r sm:last:border-r-0">
            <div className="border-outline-variant mb-6 h-9 w-9 rounded-full border" />
            <p className="text-on-surface-variant text-sm font-bold">{label}</p>
          </div>
        ))}
      </div>
      <div className="text-destructive flex items-start gap-2">
        <BriefcaseBusiness size={16} />
        <span className="text-sm font-black">Without shared workplace signal</span>
      </div>
    </div>
  );
}
