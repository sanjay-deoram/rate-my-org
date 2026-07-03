import { db } from "@/lib/db";
import { companies, reviews, interviews } from "@/drizzle/schema";
import { eq, desc, sql, count, and, ne } from "drizzle-orm";
import type { TopRatedCompany, RatingTrend } from "@/types/homepage";

function computeTrend(
  avgRating: string | null,
  recentAvg: string | null,
  reviewCount: number,
): RatingTrend {
  if (!avgRating) return "neutral";
  const overall = parseFloat(avgRating);
  if (reviewCount >= 3 && recentAvg) {
    const recent = parseFloat(recentAvg);
    if (recent > overall + 0.1) return "up";
    if (recent < overall - 0.1) return "down";
  }
  return overall >= 2.5 ? "up" : "down";
}

export type RecentReviewEntry = {
  id: string;
  headline: string;
  overallRating: number;
  jobTitle: string;
  employmentStatus: string;
  companyName: string;
  companySlug: string;
  companyLogoKey: string | null;
};

export async function getRecentReviews(limit = 8): Promise<RecentReviewEntry[]> {
  const rows = await db
    .select({
      id: reviews.id,
      headline: reviews.headline,
      overallRating: reviews.overallRating,
      jobTitle: reviews.jobTitle,
      employmentStatus: reviews.employmentStatus,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogoKey: companies.logoKey,
    })
    .from(reviews)
    .innerJoin(companies, eq(reviews.companyId, companies.id))
    .where(and(eq(companies.status, "approved"), ne(reviews.headline, "")))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
  return rows;
}

export async function getHomepageStats() {
  const [reviewRows, companyRows, interviewRows] = await Promise.all([
    db.select({ count: count() }).from(reviews),
    db.select({ count: count() }).from(companies).where(eq(companies.status, "approved")),
    db.select({ count: count() }).from(interviews),
  ]);

  return {
    totalReviews: reviewRows[0].count,
    totalCompanies: companyRows[0].count,
    totalInterviews: interviewRows[0].count,
  };
}

export async function getHomepageCompanyBrand(slug: string) {
  const [row] = await db
    .select({
      slug: companies.slug,
      name: companies.name,
      industry: companies.industry,
      logoKey: companies.logoKey,
    })
    .from(companies)
    .where(and(eq(companies.slug, slug), eq(companies.status, "approved")))
    .limit(1);

  return row ?? null;
}

async function queryTopRated(limit: number, withHaving: boolean): Promise<TopRatedCompany[]> {
  const selection = {
    slug: companies.slug,
    name: companies.name,
    industry: companies.industry,
    logoKey: companies.logoKey,
    avgRating: sql<string | null>`AVG(${reviews.overallRating})`,
    reviewCount: sql<number>`COUNT(${reviews.id})`,
    latestHeadline: sql<
      string | null
    >`(SELECT headline FROM reviews WHERE company_id = ${companies.id} ORDER BY created_at DESC LIMIT 1)`,
    recentAvgRating: sql<
      string | null
    >`(SELECT AVG(overall_rating) FROM (SELECT overall_rating FROM reviews WHERE company_id = ${companies.id} ORDER BY created_at DESC LIMIT 5) sub)`,
  };

  const base = db
    .select(selection)
    .from(companies)
    .leftJoin(reviews, eq(reviews.companyId, companies.id))
    .where(eq(companies.status, "approved"))
    .groupBy(companies.id, companies.slug, companies.name, companies.industry, companies.logoKey)
    .orderBy(desc(sql`AVG(${reviews.overallRating})`))
    .limit(limit);

  const rows = await (withHaving ? base.having(sql`COUNT(${reviews.id}) > 0`) : base);

  return rows.map(({ recentAvgRating, ...row }) => ({
    ...row,
    ratingTrend: computeTrend(row.avgRating, recentAvgRating, row.reviewCount),
  }));
}

export async function getTopRatedCompanies(limit = 6): Promise<TopRatedCompany[]> {
  const rows = await queryTopRated(limit, true);
  if (rows.length > 0) return rows;
  return queryTopRated(limit, false);
}
