import Link from "next/link";
import { Search, BadgeCheck, Shield } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main
        className="min-h-screen pt-20"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 0%, #e2e2e2 0%, #f3f2f2 40%, #fcf9f8 70%)",
        }}
      >
        {/* Hero */}
        <section className="relative flex flex-col items-center overflow-hidden px-8 py-24 text-center md:px-12 md:py-40">
          {/* Pill badge */}
          <div className="bg-surface-container border-surface-container-highest mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <span className="text-on-surface-variant text-[10px] font-bold tracking-[0.18em] uppercase">
              Transparency First
            </span>
          </div>

          <h1 className="text-foreground mb-8 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tighter md:text-7xl">
            Uncover the Truth About Your Next Workplace
          </h1>

          <p className="text-on-surface-variant mb-12 max-w-xl text-base leading-relaxed md:text-lg">
            Anonymous, verified insights from the people who actually work there. No PR fluff, just
            honest experiences.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl">
            <div className="bg-surface-container-lowest border-border/20 relative flex items-center overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(27,27,27,0.08)]">
              <div className="text-on-surface-variant pointer-events-none flex shrink-0 items-center pl-5">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for a company, role, or culture tag..."
                className="placeholder:text-on-surface-variant h-16 flex-1 bg-transparent px-4 text-base font-medium focus:outline-none"
              />
              <div className="flex shrink-0 items-center gap-2 pr-3">
                <button
                  type="submit"
                  className="bg-foreground text-background h-10 rounded-xl px-5 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97]"
                >
                  Search
                </button>
                <span className="text-on-surface-variant border-outline-variant/40 bg-surface-container hidden h-8 w-8 items-center justify-center rounded-lg border font-mono text-[9px] font-bold md:inline-flex">
                  ⌘K
                </span>
                <span className="text-on-surface-variant border-outline-variant/40 bg-surface-container hidden h-8 w-8 items-center justify-center rounded-lg border font-mono text-[9px] font-bold md:inline-flex">
                  ESC
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Trending section */}
        <section className="bg-surface-container-low py-32">
          <div className="mx-auto max-w-7xl px-8 md:px-12">
            <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-[0.2em] uppercase">
                  Trending Data
                </span>
                <h2 className="text-4xl font-bold tracking-tight">Most Searched This Week</h2>
              </div>
              <Link
                href="/orgs"
                className="border-foreground border-b pb-1 text-sm font-bold transition-opacity hover:opacity-70"
              >
                View Full Index
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Featured org card */}
              <div className="bg-surface-container-lowest group hover:border-surface-container-highest flex cursor-pointer flex-col justify-between rounded-xl border border-transparent p-10 transition-all duration-300 md:col-span-8">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <div className="bg-surface-container flex h-16 w-16 items-center justify-center rounded-lg text-3xl font-black">
                      S
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#d1fadf] px-3 py-1 text-[#00632d]">
                      <BadgeCheck size={14} className="fill-current" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">
                        Top Rated
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-3xl font-bold">Stripe</h3>
                  <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
                    Infrastructure for the internet economy. Known for rigorous engineering culture
                    and high-impact work.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-12">
                  <div>
                    <span className="text-on-surface-variant mb-1 block font-mono text-[10px] tracking-widest uppercase">
                      Culture Rating
                    </span>
                    <span className="text-3xl font-black">4.8/5.0</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant mb-1 block font-mono text-[10px] tracking-widest uppercase">
                      Growth Opportunity
                    </span>
                    <div className="bg-surface-container-highest mt-3 h-2 w-40 rounded-full">
                      <div className="bg-primary h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anonymity CTA card */}
              <div className="bg-primary text-primary-foreground group relative flex flex-col justify-between overflow-hidden rounded-xl p-10 md:col-span-4">
                <div className="z-10">
                  <span className="text-on-primary-container mb-6 block font-mono text-[10px] tracking-widest uppercase">
                    Anonymity Guaranteed
                  </span>
                  <h3 className="mb-4 text-2xl leading-snug font-bold">
                    The safe space for workplace transparency.
                  </h3>
                  <p className="text-on-primary-container text-sm leading-relaxed opacity-80">
                    Join 40k+ professionals sharing honest insights without the fear of
                    identification.
                  </p>
                </div>
                <Link
                  href="/reviews/write"
                  className="text-primary z-10 mt-12 block w-full rounded bg-white py-4 text-center text-sm font-bold transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  Start Sharing
                </Link>
                <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform duration-500 group-hover:scale-110">
                  <Shield size={140} />
                </div>
              </div>

              {/* Recent interview */}
              <div className="bg-surface-container-lowest border-surface-container-highest hover:border-primary flex flex-col rounded-xl border p-8 transition-all duration-300 md:col-span-4">
                <div className="flex-grow">
                  <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-[0.15em] uppercase">
                    Recent Interview
                  </span>
                  <h4 className="text-primary mb-4 text-xl leading-tight font-black">
                    Senior Product Designer
                  </h4>
                  <p className="text-on-surface-variant border-surface-container-highest mb-6 border-l-2 pl-4 text-sm leading-relaxed italic">
                    &quot;The process was heavily focused on systems thinking rather than just
                    visual execution...&quot;
                  </p>
                </div>
                <div className="border-surface-container-highest flex items-center justify-between border-t pt-6">
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    Figma
                  </span>
                  <span className="text-on-surface-variant font-mono text-[10px]">2 DAYS AGO</span>
                </div>
              </div>

              {/* Recent review */}
              <div className="bg-surface-container-lowest border-surface-container-highest hover:border-primary flex flex-col rounded-xl border p-8 transition-all duration-300 md:col-span-4">
                <div className="flex-grow">
                  <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-[0.15em] uppercase">
                    Recent Review
                  </span>
                  <h4 className="text-primary mb-4 text-xl leading-tight font-black">
                    Great work-life balance
                  </h4>
                  <p className="text-on-surface-variant border-surface-container-highest mb-6 border-l-2 pl-4 text-sm leading-relaxed italic">
                    &quot;Transparent leadership and a strong emphasis on mental well-being across
                    the entire org...&quot;
                  </p>
                </div>
                <div className="border-surface-container-highest flex items-center justify-between border-t pt-6">
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    Linear
                  </span>
                  <span className="text-on-surface-variant font-mono text-[10px]">5 DAYS AGO</span>
                </div>
              </div>

              {/* Salary insight */}
              <div className="bg-surface-container-lowest border-surface-container-highest hover:border-primary flex flex-col rounded-xl border p-8 transition-all duration-300 md:col-span-4">
                <div className="flex-grow">
                  <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-[0.15em] uppercase">
                    Salary Insight
                  </span>
                  <h4 className="text-on-surface-variant mb-1 text-sm font-medium">
                    Software Engineer L5
                  </h4>
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-primary text-4xl font-black">$245k</span>
                    <span className="text-on-surface-variant text-[10px] font-bold tracking-tighter uppercase">
                      Total Comp
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-tight">
                    Based on 14 recent entries verified by community members.
                  </p>
                </div>
                <div className="border-surface-container-highest flex items-center justify-between border-t pt-6">
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    Vercel
                  </span>
                  <div className="flex items-center gap-1">
                    <BadgeCheck size={14} className="text-tertiary-fixed-dim fill-current" />
                    <span className="text-tertiary-fixed-dim text-[10px] font-bold tracking-wider uppercase">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial section */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-8 py-32 md:flex-row md:px-12">
          <div className="flex-1">
            <div className="bg-surface-container group relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl">
              <div className="from-surface-container-high to-surface-dim absolute inset-0 bg-gradient-to-br" />
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
                high-end editorial content, ensuring every insight is presented with the weight and
                clarity it deserves.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
