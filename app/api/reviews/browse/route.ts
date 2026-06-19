import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { reviews, companies } from "@/drizzle/schema";
import { eq, desc, asc, gte, ilike, or, and, sql } from "drizzle-orm";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().optional(),
  sort: z.enum(["recent", "oldest", "highest", "lowest"]).default("recent"),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  since: z.enum(["today", "week", "month", "year"]).optional(),
  companySlug: z.string().optional(),
  cursor: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const SINCE_INTERVAL: Record<string, string> = {
  today: "1 day",
  week: "7 days",
  month: "30 days",
  year: "365 days",
};

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, sort, minRating, since, companySlug, cursor, limit } = parsed.data;

  const where = and(
    eq(companies.status, "approved"),
    minRating !== undefined ? gte(reviews.overallRating, minRating) : undefined,
    since
      ? sql`${reviews.createdAt} >= now() - interval '${sql.raw(SINCE_INTERVAL[since])}'`
      : undefined,
    q ? or(ilike(reviews.jobTitle, `%${q}%`), ilike(companies.name, `%${q}%`)) : undefined,
    companySlug ? eq(companies.slug, companySlug) : undefined,
  );

  const orderBy = {
    recent: desc(reviews.createdAt),
    oldest: asc(reviews.createdAt),
    highest: desc(reviews.overallRating),
    lowest: asc(reviews.overallRating),
  }[sort];

  const rows = await db
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
    .orderBy(orderBy)
    .limit(limit + 1)
    .offset(cursor);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? cursor + limit : null;

  return NextResponse.json({ items, nextCursor });
}
