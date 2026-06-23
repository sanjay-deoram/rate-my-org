import { Suspense } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ReviewsFeed } from "@/components/reviews-feed";
import { browseReviews, getTrendingCompanies, getReviewCount } from "@/lib/api/reviews";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews — RateMyOrg",
  description: "Browse anonymous workplace reviews from employees across all companies.",
};

type SearchParams = {
  q?: string;
  page?: string;
  minRating?: string;
  since?: string;
  companySlug?: string;
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const [{ items, total, totalPages }, trendingCompanies, totalReviews] = await Promise.all([
    browseReviews({
      q: sp.q?.trim() || undefined,
      minRating: sp.minRating ? parseInt(sp.minRating) : undefined,
      since: sp.since || undefined,
      companySlug: sp.companySlug || undefined,
      page,
    }),
    getTrendingCompanies(),
    getReviewCount(),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-20">
        <Suspense>
          <ReviewsFeed
            totalReviews={totalReviews}
            trendingCompanies={trendingCompanies}
            items={items}
            total={total}
            page={page}
            totalPages={totalPages}
            filters={{
              q: sp.q?.trim() || undefined,
              minRating: sp.minRating || undefined,
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
