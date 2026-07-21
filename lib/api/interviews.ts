import type { InterviewFormValues, RoundType } from "@/lib/schemas/interview";

export type SubmitInterviewResponse = {
  interview: { id: string; createdAt: string };
};

export type InterviewPostBody = Omit<InterviewFormValues, "companyName">;

export type InterviewFeedItem = {
  id: string;
  roleTitle: string;
  department: string | null;
  difficulty: number;
  overallExperience: string;
  rounds: Array<{ type: RoundType; notes: string }>;
  offerReceived: string;
  createdAt: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  companyIndustry: string | null;
  companyLogoKey: string | null;
};

export type InterviewBrowsePage = {
  items: InterviewFeedItem[];
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

export const INTERVIEWS_PAGE_SIZE = 10;

export async function browseInterviews(params: {
  q?: string;
  experience?: string;
  offerReceived?: string;
  since?: string;
  companySlug?: string;
  page: number;
}): Promise<{ items: InterviewFeedItem[]; total: number; totalPages: number }> {
  const { db } = await import("@/lib/db");
  const { interviews, companies } = await import("@/drizzle/schema");
  const { desc, eq, ilike, or, and, sql } = await import("drizzle-orm");

  const { q, experience, offerReceived, since, companySlug, page } = params;
  const offset = (page - 1) * INTERVIEWS_PAGE_SIZE;

  const where = and(
    eq(companies.status, "approved"),
    experience
      ? eq(interviews.overallExperience, experience as "Great" | "Neutral" | "Negative")
      : undefined,
    offerReceived
      ? eq(interviews.offerReceived, offerReceived as "Yes" | "No" | "Yes but Declined")
      : undefined,
    since && SINCE_INTERVAL[since]
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
      .limit(INTERVIEWS_PAGE_SIZE)
      .offset(offset),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / INTERVIEWS_PAGE_SIZE));
  const items: InterviewFeedItem[] = rows.map((r) => ({
    ...r,
    rounds: r.rounds as Array<{ type: RoundType; notes: string }>,
    createdAt: r.createdAt.toISOString(),
  }));

  return { items, total, totalPages };
}

export async function getTrendingInterviewCompanies(
  limit = 4,
): Promise<{ name: string; slug: string }[]> {
  const { db } = await import("@/lib/db");
  const { interviews, companies } = await import("@/drizzle/schema");
  const { desc, eq, sql } = await import("drizzle-orm");

  return db
    .select({ name: companies.name, slug: companies.slug })
    .from(companies)
    .leftJoin(interviews, eq(interviews.companyId, companies.id))
    .where(eq(companies.status, "approved"))
    .groupBy(companies.id, companies.name, companies.slug)
    .orderBy(desc(sql`count(${interviews.id})`))
    .limit(limit);
}

export async function getInterviewCount(): Promise<number> {
  const { db } = await import("@/lib/db");
  const { interviews } = await import("@/drizzle/schema");
  const { count } = await import("drizzle-orm");

  const [{ count: total }] = await db.select({ count: count() }).from(interviews);
  return total;
}

// ---------- Client-side fetch functions ----------

export async function submitInterview(body: InterviewPostBody): Promise<SubmitInterviewResponse> {
  const res = await fetch("/api/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 409 || res.status === 429) {
    const data = await res.json();
    throw new Error(
      typeof data.error === "string" ? data.error : "Oops, failed to submit interview.",
    );
  }
  if (!res.ok) throw new Error("Oops, failed to submit interview.");
  return res.json();
}
