import { db } from "@/lib/db";
import { companies, reviews, interviews } from "@/drizzle/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import type { TopRatedCompany } from "@/types/homepage";

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

async function queryTopRated(limit: number, withHaving: boolean): Promise<TopRatedCompany[]> {
  const baseQuery = db
    .select({
      slug: companies.slug,
      name: companies.name,
      industry: companies.industry,
      logoKey: companies.logoKey,
      avgRating: sql<string | null>`AVG(${reviews.overallRating})`,
      reviewCount: sql<number>`COUNT(${reviews.id})`,
      latestHeadline: sql<
        string | null
      >`(SELECT headline FROM reviews WHERE company_id = ${companies.id} ORDER BY created_at DESC LIMIT 1)`,
    })
    .from(companies)
    .leftJoin(reviews, eq(reviews.companyId, companies.id))
    .where(eq(companies.status, "approved"))
    .groupBy(companies.id, companies.slug, companies.name, companies.industry, companies.logoKey)
    .orderBy(desc(sql`AVG(${reviews.overallRating})`))
    .limit(limit);

  if (withHaving) {
    return baseQuery.having(sql`COUNT(${reviews.id}) > 0`);
  }

  return baseQuery;
}

export async function getTopRatedCompanies(limit = 6): Promise<TopRatedCompany[]> {
  const rows = await queryTopRated(limit, true);
  if (rows.length > 0) return rows;
  return queryTopRated(limit, false);
}
