import { notFound } from "next/navigation";
import { BadgeCheck, TrendingUp, UserCheck, Terminal, PlusCircle, MinusCircle } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

type OrgData = {
  name: string;
  tagline: string;
  initial: string;
  rating: number;
  recommendPct: number;
  ceoApprovalPct: number;
  ceoName: string;
  topPillar: string;
  cultureFingerprint: { label: string; score: number }[];
  interviewDifficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  interviewDifficultyLevel: number;
  interviewNote: string;
  reviews: {
    title: string;
    role: string;
    location: string;
    timeAgo: string;
    rating: number;
    pros: string;
    cons: string;
    highlight: string;
  }[];
};

const orgs: Record<string, OrgData> = {
  stripe: {
    name: "Stripe",
    tagline: "Financial Infrastructure for the Internet",
    initial: "S",
    rating: 4.8,
    recommendPct: 94,
    ceoApprovalPct: 98,
    ceoName: "Patrick Collison",
    topPillar: "Engineering Excellence",
    cultureFingerprint: [
      { label: "Work-Life Balance", score: 4.2 },
      { label: "Career Growth", score: 4.9 },
      { label: "Compensation", score: 4.7 },
      { label: "Inclusion & Diversity", score: 4.5 },
    ],
    interviewDifficulty: "Hard",
    interviewDifficultyLevel: 4,
    interviewNote:
      "Most candidates report technical deep-dives and rigorous systems design assessments.",
    reviews: [
      {
        title: "The highest bar I've ever encountered.",
        role: "Software Engineer L4",
        location: "San Francisco, CA",
        timeAgo: "2 years ago",
        rating: 5.0,
        pros: "Unrivaled technical talent. You are surrounded by people who wrote the books you learned from. Operational rigor is second to none.",
        cons: "The internal tooling is so specialized it can be hard to map back to the industry standards if you leave. Fast pace can be draining.",
        highlight:
          "Management truly cares about the craft. It's not just about shipping; it's about shipping the right way. If you want to grow as an engineer, there is no better place on Earth right now.",
      },
      {
        title: "Demanding but deeply rewarding culture.",
        role: "Product Manager",
        location: "Dublin, Ireland",
        timeAgo: "6 months ago",
        rating: 4.5,
        pros: "Extreme clarity of mission. Decisions are made through rigorous writing and debate. Compensation is at the top of the market.",
        cons: "Work-life balance can skew poorly during major product launches. The 'Stripe way' can feel dogmatic to newcomers.",
        highlight:
          "Everything is documented. The friction to get information is zero, which means you spend more time building and less time in meetings.",
      },
    ],
  },
  linear: {
    name: "Linear",
    tagline: "The Issue Tracker for High-Performance Teams",
    initial: "L",
    rating: 4.7,
    recommendPct: 96,
    ceoApprovalPct: 97,
    ceoName: "Karri Saarinen",
    topPillar: "Product Craft",
    cultureFingerprint: [
      { label: "Work-Life Balance", score: 4.6 },
      { label: "Career Growth", score: 4.5 },
      { label: "Compensation", score: 4.4 },
      { label: "Inclusion & Diversity", score: 4.3 },
    ],
    interviewDifficulty: "Medium",
    interviewDifficultyLevel: 3,
    interviewNote:
      "Process is thorough but respectful. Strong emphasis on product thinking and design sensibility.",
    reviews: [
      {
        title: "A masterclass in shipping quality software.",
        role: "Frontend Engineer",
        location: "Remote",
        timeAgo: "1 year ago",
        rating: 4.8,
        pros: "Small team, massive impact. Every engineer owns significant surfaces. The codebase is clean and the bar is high.",
        cons: "Very small team means limited mentorship structure. You need to be self-directed.",
        highlight:
          "If you care deeply about craft and user experience, Linear is one of the best places you can work. The team lives what they ship.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(orgs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = orgs[slug];
  if (!org) return {};
  return {
    title: `${org.name} Reviews — ${org.rating}/5.0`,
    description: `${org.name}: ${org.tagline}. ${org.recommendPct}% recommend to a friend.`,
  };
}

export default async function OrgProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = orgs[slug];

  if (!org) notFound();

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        {/* Brand header */}
        <section className="max-w-7xl mx-auto px-8 md:px-12 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-surface-container-lowest flex items-center justify-center rounded-xl border border-border/20 shadow-sm">
                <span className="text-5xl font-black text-foreground">
                  {org.initial}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-5xl font-black tracking-[-0.04em] text-foreground">
                    {org.name}
                  </h1>
                  <BadgeCheck
                    size={30}
                    className="text-tertiary-fixed-dim fill-current"
                  />
                </div>
                <p className="text-on-surface-variant font-medium tracking-tight uppercase text-sm">
                  {org.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-4 text-right">
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm uppercase tracking-widest text-on-surface-variant mb-1">
                  Aggregate Rating
                </span>
                <div className="text-7xl font-black tracking-tighter leading-none">
                  {org.rating.toFixed(1)}
                </div>
              </div>
              <div className="text-on-surface-variant font-mono text-xl">
                / 5.0
              </div>
            </div>
          </div>
        </section>

        {/* KPI grid */}
        <section className="max-w-7xl mx-auto px-8 md:px-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 hover:bg-surface-container-highest transition-all duration-300">
              <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">
                Recommend to Friend
              </span>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">
                  {org.recommendPct}%
                </span>
                <div className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-tertiary-fixed-dim" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 hover:bg-surface-container-highest transition-all duration-300">
              <span className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">
                CEO Approval ({org.ceoName})
              </span>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">
                  {org.ceoApprovalPct}%
                </span>
                <div className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center">
                  <UserCheck size={20} className="text-tertiary-fixed-dim" />
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground p-8 rounded-xl flex flex-col justify-between h-48">
              <span className="text-on-primary-container text-xs font-mono uppercase tracking-widest">
                Top Rated Pillar
              </span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold tracking-tighter">
                  {org.topPillar}
                </span>
                <Terminal size={28} />
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: stats */}
          <div className="lg:col-span-4 space-y-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                Culture Fingerprint
              </h2>
              <div className="space-y-10">
                {org.cultureFingerprint.map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="font-mono text-xs text-on-surface-variant">
                        {item.score.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
              <h3 className="font-bold mb-4">Interview Difficulty</h3>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black font-mono">
                  {org.interviewDifficulty}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full ${
                        i <= org.interviewDifficultyLevel
                          ? "bg-primary"
                          : "bg-surface-container-highest"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
                {org.interviewNote}
              </p>
            </div>
          </div>

          {/* Right: reviews */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold tracking-tight">
                Anonymous Feedback
              </h2>
              <div className="flex gap-4">
                <button className="text-sm font-mono uppercase tracking-widest border-b border-primary pb-1">
                  Recent
                </button>
                <button className="text-sm font-mono uppercase tracking-widest text-on-surface-variant hover:text-foreground transition-colors">
                  Highest Rated
                </button>
              </div>
            </div>

            <div className="space-y-12">
              {org.reviews.map((review, i) => (
                <article
                  key={i}
                  className="bg-surface-container-lowest p-10 rounded-xl hover:bg-surface-container-low transition-colors duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1 italic">
                        &ldquo;{review.title}&rdquo;
                      </h3>
                      <p className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
                        {review.role} • {review.location} • {review.timeAgo}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded shrink-0 ml-4">
                      <span className="text-sm font-bold">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                          <PlusCircle
                            size={16}
                            className="text-tertiary-fixed-dim"
                          />{" "}
                          Pros
                        </h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {review.pros}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-on-surface-variant">
                          <MinusCircle size={16} /> Cons
                        </h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {review.cons}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant/20">
                      <p className="text-foreground italic leading-relaxed text-lg">
                        &ldquo;{review.highlight}&rdquo;
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <button className="bg-surface-container-highest px-8 py-4 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-inverse-surface hover:text-inverse-on-surface transition-all">
                Load More Archives
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
