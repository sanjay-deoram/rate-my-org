import { notFound } from "next/navigation";
import { BadgeCheck, TrendingUp, BookOpen, MessageSquare } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getCompanyWithStats } from "@/lib/queries/orgs";
import { OrgContent } from "@/components/org-content";

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
      <main className="pt-28 pb-24">
        {/* Brand header */}
        <section className="mx-auto mb-16 max-w-7xl px-8 md:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="flex items-center gap-8">
              <div className="bg-surface-container-lowest border-border/20 flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border shadow-sm">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <span className="text-foreground text-5xl font-black">{initial}</span>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-foreground text-5xl font-black tracking-[-0.04em]">
                    {company.name}
                  </h1>
                  <BadgeCheck size={30} className="text-tertiary-fixed-dim fill-current" />
                </div>
                <p className="text-on-surface-variant text-sm font-medium tracking-tight uppercase">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-4 text-right">
              <div className="flex flex-col items-end">
                <span className="text-on-surface-variant mb-1 font-mono text-sm tracking-widest uppercase">
                  Aggregate Rating
                </span>
                <div className="text-7xl leading-none font-black tracking-tighter">
                  {stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "—"}
                </div>
              </div>
              <div className="text-on-surface-variant font-mono text-xl">/ 5.0</div>
            </div>
          </div>
        </section>

        {/* KPI grid */}
        <section className="mx-auto mb-20 max-w-7xl px-8 md:px-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-surface-container-low hover:bg-surface-container-highest flex h-48 flex-col justify-between rounded-xl p-8 transition-all duration-300">
              <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                Recommend to Friend
              </span>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">
                  {stats.reviewCount > 0 ? `${stats.recommendPct}%` : "—"}
                </span>
                <div className="border-outline-variant/20 flex h-12 w-12 items-center justify-center rounded-full border">
                  <TrendingUp size={20} className="text-tertiary-fixed-dim" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low hover:bg-surface-container-highest flex h-48 flex-col justify-between rounded-xl p-8 transition-all duration-300">
              <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                Total Reviews
              </span>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">{stats.reviewCount}</span>
                <div className="border-outline-variant/20 flex h-12 w-12 items-center justify-center rounded-full border">
                  <MessageSquare size={20} className="text-tertiary-fixed-dim" />
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground flex h-48 flex-col justify-between rounded-xl p-8">
              <span className="text-on-primary-container font-mono text-xs tracking-widest uppercase">
                Interview Reports
              </span>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">{stats.interviewCount}</span>
                <BookOpen size={28} />
              </div>
            </div>
          </div>
        </section>

        {/* Main content — client component owns sidebar filters + feed */}
        <OrgContent data={data} />
      </main>
      <Footer />
    </>
  );
}
