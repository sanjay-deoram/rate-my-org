import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { interviews, companies } from "@/drizzle/schema";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().optional(),
  experience: z.enum(["Great", "Neutral", "Negative"]).optional(),
  offerReceived: z.enum(["Yes", "No", "Yes but Declined"]).optional(),
  since: z.enum(["today", "week", "month", "year"]).optional(),
  companySlug: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
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

  const { q, experience, offerReceived, since, companySlug, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const where = and(
    eq(companies.status, "approved"),
    experience ? eq(interviews.overallExperience, experience) : undefined,
    offerReceived ? eq(interviews.offerReceived, offerReceived) : undefined,
    since
      ? sql`${interviews.createdAt} >= now() - interval '${sql.raw(SINCE_INTERVAL[since])}'`
      : undefined,
    q ? or(ilike(interviews.roleTitle, `%${q}%`), ilike(companies.name, `%${q}%`)) : undefined,
    companySlug ? eq(companies.slug, companySlug) : undefined,
  );

  const [countResult, rows] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(interviews)
      .innerJoin(companies, eq(interviews.companyId, companies.id))
      .where(where),
    db
      .select({
        id: interviews.id,
        roleTitle: interviews.roleTitle,
        department: interviews.department,
        difficulty: interviews.difficulty,
        overallExperience: interviews.overallExperience,
        rounds: interviews.rounds,
        offerReceived: interviews.offerReceived,
        createdAt: interviews.createdAt,
        companyId: interviews.companyId,
        companyName: companies.name,
        companySlug: companies.slug,
        companyIndustry: companies.industry,
        companyLogoKey: companies.logoKey,
      })
      .from(interviews)
      .innerJoin(companies, eq(interviews.companyId, companies.id))
      .where(where)
      .orderBy(desc(interviews.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({ items: rows, total, page, totalPages });
}
