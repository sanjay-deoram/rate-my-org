import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HomeSearchBar } from "@/components/home-search-bar";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeReviews } from "@/components/home-reviews";
import { Reveal } from "@/components/motion-primitives";
import { WorkspaceScene, SignalMap } from "@/components/home/workspace-scene";
import {
  getHomepageStats,
  getTopRatedCompanies,
  getRecentReviews,
  getHomepageCompanyBrand,
} from "@/lib/queries/homepage";

const FALLBACK_MOCKUP_COMPANY = {
  name: "1Password",
  industry: "Security software",
  logoKey: "1password.webp",
};

export default async function HomePage() {
  const [stats, topRated, recentReviews, mockupCompany] = await Promise.all([
    getHomepageStats(),
    getTopRatedCompanies(8),
    getRecentReviews(12),
    getHomepageCompanyBrand("1password"),
  ]);

  const leaderboard = topRated.slice(0, 5);

  return (
    <>
      <Nav />
      <main className="bg-background min-h-screen overflow-hidden pt-24">
        <section className="relative">
          <div className="bg-token-green/90 absolute top-20 left-0 h-80 w-[24vw] -translate-x-1/3 rotate-[-8deg] rounded-[2rem] shadow-2xl lg:h-[560px] lg:w-[38vw]" />
          <div className="bg-token-lime/80 absolute top-44 right-0 h-44 w-24 translate-x-16 rotate-[5deg] rounded-[1.25rem] lg:h-72 lg:w-40" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 pt-4 pb-24 md:px-12 lg:pt-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <Reveal>
                <h1 className="max-w-4xl text-4xl leading-[0.98] font-black sm:text-5xl md:text-7xl lg:text-8xl">
                  Rate your organization
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-on-surface-variant mt-6 max-w-2xl text-base leading-7 md:text-lg">
                  Know before you join. Read and post anonymous company reviews and interview
                  experiences, with no login and no takedowns.
                </p>
              </Reveal>
              <Reveal delay={0.2} className="mt-8 w-full max-w-2xl">
                <HomeSearchBar />
              </Reveal>
              <Reveal delay={0.3} className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
              </Reveal>
            </div>

            <div className="relative mt-16 min-h-[620px] lg:mt-20">
              <WorkspaceScene
                stats={stats}
                leaderboard={leaderboard}
                mockupCompany={mockupCompany ?? FALLBACK_MOCKUP_COMPANY}
              />
            </div>
          </div>
        </section>

        <section className="bg-paper-soft py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-12">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-on-surface-variant text-xs font-bold">Workplace examples</p>
              <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
                Each profile shows what people actually experience
              </h2>
              <p className="text-on-surface-variant mt-4 leading-7">
                Search companies, compare ratings, read recent headlines, and spot the interview
                patterns candidates keep running into.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-12">
              <HomeCarousel companies={topRated} />
            </Reveal>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="text-on-surface-variant text-xs font-bold">Anonymous by design</p>
              <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
                Useful signal without accounts, followers, or corporate polish
              </h2>
              <p className="text-on-surface-variant mt-5 max-w-xl leading-7">
                Submissions are built around concrete context: role, status, ratings, written
                experience, and interview rounds. The product keeps the friction low and the record
                focused.
              </p>
            </Reveal>
            <Reveal
              delay={0.15}
              className="border-border bg-card soft-shadow rounded-[1.75rem] border p-4"
            >
              <SignalMap />
            </Reveal>
          </div>
        </section>

        <HomeReviews reviews={recentReviews} />

        <section className="px-5 py-20 md:px-12 md:py-28">
          <Reveal className="bg-primary text-primary-foreground mx-auto max-w-5xl rounded-[1.75rem] px-6 py-14 text-center md:px-12">
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
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
