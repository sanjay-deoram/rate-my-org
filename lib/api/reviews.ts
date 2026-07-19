import type { ReviewPostBody } from "@/types/review";

export type SubmitReviewResponse = {
  review: { id: string; createdAt: string };
};

export type ReviewFeedItem = {
  id: string;
  jobTitle: string;
  overallRating: number;
  employmentType: string;
  employmentStatus: string;
  pros: string;
  cons: string;
  adviceToManagement: string;
  headline: string;
  formerYear: number | null;
  createdAt: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  companyIndustry: string | null;
  companyLogoKey: string | null;
};

export type ReviewBrowsePage = {
  items: ReviewFeedItem[];
  total: number;
  page: number;
  totalPages: number;
};

// ---------- Server-side DB functions (server components only) ----------

const SINCE_INTERVAL: Record<string, string> = {
  today: "1 day",
  week: "7 days",
  month: "30 days",
  year: "365 days",
};

export const REVIEWS_PAGE_SIZE = 10;

export async function browseReviews(params: {
  q?: string;
  minRating?: number;
  since?: string;
  companySlug?: string;
  page: number;
}): Promise<{ items: ReviewFeedItem[]; total: number; totalPages: number }> {
  const { db } = await import("@/lib/db");
  const { reviews, companies } = await import("@/drizzle/schema");
  const { desc, eq, gte, ilike, or, and, sql } = await import("drizzle-orm");

  const { q, minRating, since, companySlug, page } = params;
  const offset = (page - 1) * REVIEWS_PAGE_SIZE;

  const where = and(
    eq(companies.status, "approved"),
    minRating !== undefined ? gte(reviews.overallRating, minRating) : undefined,
    since && SINCE_INTERVAL[since]
      ? sql`${reviews.createdAt} >= now() - interval '${sql.raw(SINCE_INTERVAL[since])}'`
      : undefined,
    q ? or(ilike(reviews.jobTitle, `%${q}%`), ilike(companies.name, `%${q}%`)) : undefined,
    companySlug ? eq(companies.slug, companySlug) : undefined,
  );

  const [countResult, rows] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviews)
      .innerJoin(companies, eq(reviews.companyId, companies.id))
      .where(where),
    db
      .select({
        id: reviews.id,
        jobTitle: reviews.jobTitle,
        overallRating: reviews.overallRating,
        employmentType: reviews.employmentType,
        employmentStatus: reviews.employmentStatus,
        pros: reviews.pros,
        cons: reviews.cons,
        adviceToManagement: reviews.adviceToManagement,
        headline: reviews.headline,
        formerYear: reviews.formerYear,
        createdAt: reviews.createdAt,
        companyId: reviews.companyId,
        companyName: companies.name,
        companySlug: companies.slug,
        companyIndustry: companies.industry,
        companyLogoKey: companies.logoKey,
      })
      .from(reviews)
      .innerJoin(companies, eq(reviews.companyId, companies.id))
      .where(where)
      .orderBy(desc(reviews.createdAt))
      .limit(REVIEWS_PAGE_SIZE)
      .offset(offset),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / REVIEWS_PAGE_SIZE));
  const items: ReviewFeedItem[] = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return { items, total, totalPages };
}

export async function getTrendingCompanies(limit = 4): Promise<{ name: string; slug: string }[]> {
  const { db } = await import("@/lib/db");
  const { reviews, companies } = await import("@/drizzle/schema");
  const { desc, eq, sql } = await import("drizzle-orm");

  return db
    .select({ name: companies.name, slug: companies.slug })
    .from(companies)
    .leftJoin(reviews, eq(reviews.companyId, companies.id))
    .where(eq(companies.status, "approved"))
    .groupBy(companies.id, companies.name, companies.slug)
    .orderBy(desc(sql`count(${reviews.id})`))
    .limit(limit);
}

export async function getReviewCount(): Promise<number> {
  const { db } = await import("@/lib/db");
  const { reviews } = await import("@/drizzle/schema");
  const { count } = await import("drizzle-orm");

  const [{ count: total }] = await db.select({ count: count() }).from(reviews);
  return total;
}

// ---------- Client-side fetch functions ----------

export async function listReviews(params: {
  q?: string;
  sort?: string;
  minRating?: number;
  since?: string;
  companySlug?: string;
  page?: number;
}): Promise<ReviewBrowsePage> {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort) sp.set("sort", params.sort);
  if (params.minRating !== undefined) sp.set("minRating", String(params.minRating));
  if (params.since) sp.set("since", params.since);
  if (params.companySlug) sp.set("companySlug", params.companySlug);
  if (params.page !== undefined) sp.set("page", String(params.page));
  const res = await fetch(`/api/reviews/browse?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function submitReview(body: ReviewPostBody): Promise<SubmitReviewResponse> {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(typeof data.error === "string" ? data.error : "Oops, failed to submit review.");
  }
  return res.json();
}
