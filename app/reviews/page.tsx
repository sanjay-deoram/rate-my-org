import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ReviewsFeed } from "@/components/reviews-feed";
import { db } from "@/lib/db";
import { reviews, companies } from "@/drizzle/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews — RateMyOrg",
  description: "Browse anonymous workplace reviews from employees across all companies.",
};

export default async function ReviewsPage() {
  const [[{ count: totalReviews }], trending] = await Promise.all([
    db.select({ count: count() }).from(reviews),
    db
      .select({ name: companies.name, slug: companies.slug })
      .from(companies)
      .leftJoin(reviews, eq(reviews.companyId, companies.id))
      .where(eq(companies.status, "approved"))
      .groupBy(companies.id, companies.name, companies.slug)
      .orderBy(desc(sql`count(${reviews.id})`))
      .limit(4),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen pt-20">
        <ReviewsFeed totalReviews={totalReviews} trendingCompanies={trending} />
      </main>
      <Footer />
    </>
  );
}
