import { Suspense } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { InterviewsFeed } from "@/components/interviews-feed";
import {
  browseInterviews,
  getTrendingInterviewCompanies,
  getInterviewCount,
} from "@/lib/api/interviews";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interviews — RateMyOrg",
  description: "Browse anonymous interview experiences from candidates across all companies.",
};

type SearchParams = {
  q?: string;
  page?: string;
  experience?: string;
  offerReceived?: string;
  since?: string;
  companySlug?: string;
};

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const [{ items, total, totalPages }, trendingCompanies, totalInterviews] = await Promise.all([
    browseInterviews({
      q: sp.q?.trim() || undefined,
      experience: sp.experience || undefined,
      offerReceived: sp.offerReceived || undefined,
      since: sp.since || undefined,
      companySlug: sp.companySlug || undefined,
      page,
    }),
    getTrendingInterviewCompanies(),
    getInterviewCount(),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-20">
        <Suspense>
          <InterviewsFeed
            totalInterviews={totalInterviews}
            trendingCompanies={trendingCompanies}
            items={items}
            total={total}
            page={page}
            totalPages={totalPages}
            filters={{
              q: sp.q?.trim() || undefined,
              experience: sp.experience || undefined,
              offerReceived: sp.offerReceived || undefined,
              since: sp.since || undefined,
              companySlug: sp.companySlug || undefined,
            }}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
