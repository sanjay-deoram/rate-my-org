import { db } from "@/lib/db";
import { companies, reviews, interviews } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

function difficultyLabel(avg: number): "Easy" | "Medium" | "Hard" | "Very Hard" {
  if (avg <= 2) return "Easy";
  if (avg <= 3) return "Medium";
  if (avg <= 4) return "Hard";
  return "Very Hard";
}

export async function getCompanyWithStats(slug: string) {
  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);

  if (!company) return null;

  const [companyReviews, companyInterviews] = await Promise.all([
    db
      .select()
      .from(reviews)
      .where(eq(reviews.companyId, company.id))
      .orderBy(desc(reviews.createdAt)),
    db
      .select()
      .from(interviews)
      .where(eq(interviews.companyId, company.id))
      .orderBy(desc(interviews.createdAt)),
  ]);

  const reviewCount = companyReviews.length;
  const avgRating =
    reviewCount > 0
      ? Math.round((companyReviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount) * 10) /
        10
      : 0;
  const recommendPct =
    reviewCount > 0
      ? Math.round((companyReviews.filter((r) => r.overallRating >= 4).length / reviewCount) * 100)
      : 0;

  const interviewCount = companyInterviews.length;
  const avgDifficulty =
    interviewCount > 0
      ? companyInterviews.reduce((s, i) => s + i.difficulty, 0) / interviewCount
      : 0;

  return {
    company,
    stats: {
      avgRating,
      reviewCount,
      recommendPct,
      avgDifficulty,
      avgDifficultyLabel: difficultyLabel(avgDifficulty),
      avgDifficultyLevel: Math.round(avgDifficulty),
      interviewCount,
    },
    reviews: companyReviews,
    interviews: companyInterviews,
  };
}

export type OrgProfile = NonNullable<Awaited<ReturnType<typeof getCompanyWithStats>>>;
