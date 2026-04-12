import Link from "next/link";
import {
  Search,
  Building2,
  Star,
  MessageSquare,
  BadgeCheck,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 md:px-12 py-24 md:py-40 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-8 max-w-4xl leading-[1.1]">
            Uncover the Truth About Your Next Workplace.
          </h1>

          <div className="w-full max-w-2xl mt-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-on-surface-variant">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search for an organization, role, or city..."
                className="w-full h-20 pl-16 pr-20 bg-surface-container-lowest border border-border/20 shadow-[0_20px_50px_rgba(27,27,27,0.05)] rounded-xl text-lg font-medium placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <span className="hidden md:block font-mono text-[10px] text-on-surface-variant border border-outline-variant/30 rounded px-2 py-1 bg-surface-container">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <Link
                href="/orgs"
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-highest rounded-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Building2 size={18} />
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-foreground">
                  Rate an Org
                </span>
              </Link>

              <Link
                href="/reviews/write"
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-highest rounded-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Star size={18} />
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-foreground">
                  Write a Review
                </span>
              </Link>

              <Link
                href="/interviews/submit"
                className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-highest rounded-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageSquare size={18} />
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-foreground">
                  Share Interview Questions
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending section */}
        <section className="bg-surface-container-low py-32">
          <div className="max-w-7xl mx-auto px-8 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 block">
                  Trending Data
                </span>
                <h2 className="text-4xl font-bold tracking-tight">
                  Most Searched This Week
                </h2>
              </div>
              <Link
                href="/orgs"
                className="text-sm font-bold border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
              >
                View Full Index
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured org card */}
              <div className="md:col-span-8 bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between group cursor-pointer border border-transparent hover:border-surface-container-highest transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center text-3xl font-black">
                      S
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#d1fadf] text-[#00632d] rounded-full">
                      <BadgeCheck size={14} className="fill-current" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Top Rated
                      </span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Stripe</h3>
                  <p className="text-on-surface-variant max-w-md leading-relaxed text-lg">
                    Infrastructure for the internet economy. Known for rigorous
                    engineering culture and high-impact work.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-12">
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant block mb-1 uppercase tracking-widest">
                      Culture Rating
                    </span>
                    <span className="text-3xl font-black">4.8/5.0</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant block mb-1 uppercase tracking-widest">
                      Growth Opportunity
                    </span>
                    <div className="h-2 w-40 bg-surface-container-highest rounded-full mt-3">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anonymity CTA card */}
              <div className="md:col-span-4 bg-primary text-primary-foreground p-10 rounded-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <span className="font-mono text-[10px] text-on-primary-container block mb-6 uppercase tracking-widest">
                    Anonymity Guaranteed
                  </span>
                  <h3 className="text-2xl font-bold mb-4 leading-snug">
                    The safe space for workplace transparency.
                  </h3>
                  <p className="text-on-primary-container text-sm leading-relaxed opacity-80">
                    Join 40k+ professionals sharing honest insights without the
                    fear of identification.
                  </p>
                </div>
                <Link
                  href="/reviews/write"
                  className="z-10 w-full py-4 bg-white text-primary font-bold text-sm rounded text-center transition-all hover:shadow-xl active:scale-[0.98] mt-12 block"
                >
                  Start Sharing
                </Link>
                <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Shield size={140} />
                </div>
              </div>

              {/* Recent interview */}
              <div className="md:col-span-4 bg-surface-container-lowest border border-surface-container-highest hover:border-primary p-8 rounded-xl flex flex-col transition-all duration-300">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-on-surface-variant block mb-4 uppercase tracking-[0.15em]">
                    Recent Interview
                  </span>
                  <h4 className="font-black text-xl mb-4 text-primary leading-tight">
                    Senior Product Designer
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed italic border-l-2 border-surface-container-highest pl-4 mb-6">
                    "The process was heavily focused on systems thinking rather
                    than just visual execution..."
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container-highest">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Figma
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    2 DAYS AGO
                  </span>
                </div>
              </div>

              {/* Recent review */}
              <div className="md:col-span-4 bg-surface-container-lowest border border-surface-container-highest hover:border-primary p-8 rounded-xl flex flex-col transition-all duration-300">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-on-surface-variant block mb-4 uppercase tracking-[0.15em]">
                    Recent Review
                  </span>
                  <h4 className="font-black text-xl mb-4 text-primary leading-tight">
                    Great work-life balance
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed italic border-l-2 border-surface-container-highest pl-4 mb-6">
                    "Transparent leadership and a strong emphasis on mental
                    well-being across the entire org..."
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container-highest">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Linear
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    5 DAYS AGO
                  </span>
                </div>
              </div>

              {/* Salary insight */}
              <div className="md:col-span-4 bg-surface-container-lowest border border-surface-container-highest hover:border-primary p-8 rounded-xl flex flex-col transition-all duration-300">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-on-surface-variant block mb-4 uppercase tracking-[0.15em]">
                    Salary Insight
                  </span>
                  <h4 className="font-medium text-sm text-on-surface-variant mb-1">
                    Software Engineer L5
                  </h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-black text-primary">
                      $245k
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                      Total Comp
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    Based on 14 recent entries verified by community members.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-surface-container-highest">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Vercel
                  </span>
                  <div className="flex items-center gap-1">
                    <BadgeCheck
                      size={14}
                      className="text-tertiary-fixed-dim fill-current"
                    />
                    <span className="text-[10px] font-bold text-tertiary-fixed-dim uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial section */}
        <section className="max-w-7xl mx-auto px-8 md:px-12 py-32 flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
            <div className="w-full aspect-square bg-surface-container rounded-xl overflow-hidden relative shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-dim" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[120px] font-black tracking-tighter text-on-surface-variant/10 select-none leading-none">
                  R
                </div>
              </div>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(27,27,27,0.02)_10px,rgba(27,27,27,0.02)_20px)]" />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              The Digital Curator
            </span>
            <blockquote className="text-4xl md:text-5xl font-medium tracking-tight leading-tight text-primary">
              "We believe that the most valuable data isn&apos;t in a brochure,
              but in the collective experiences of the people who do the work
              every day."
            </blockquote>
            <div className="pt-4">
              <p className="text-on-surface-variant leading-relaxed text-lg max-w-md">
                RateMyOrg isn&apos;t just another review site. We treat
                organizational data as high-end editorial content, ensuring
                every insight is presented with the weight and clarity it
                deserves.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
