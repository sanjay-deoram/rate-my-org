import { db } from "@/lib/db";
import { companies, reviews, interviews } from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { difficultyLabel } from "@/lib/org-display";
import { roundToOneDecimal } from "@/lib/utils";
import type { RatingTrend } from "@/types/homepage";

function computeTrend(
  avgRating: number,
  reviewCount: number,
  recentReviews: { overallRating: number }[],
): RatingTrend {
  if (reviewCount === 0) return "neutral";
  if (reviewCount >= 3) {
    const recentAvg = recentReviews.reduce((s, r) => s + r.overallRating, 0) / recentReviews.length;
    if (recentAvg > avgRating + 0.1) return "up";
    if (recentAvg < avgRating - 0.1) return "down";
  }
  return avgRating >= 2.5 ? "up" : "down";
}

export async function getCompanyWithStats(slug: string) {
  const [company] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.slug, slug), eq(companies.status, "approved")))
    .limit(1);

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
      ? roundToOneDecimal(companyReviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount)
      : 0;
  const recommendPct = reviewCount > 0 ? Math.round((avgRating / 5) * 100) : 0;

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
      ratingTrend: computeTrend(avgRating, reviewCount, companyReviews.slice(0, 5)),
    },
    reviews: companyReviews,
    interviews: companyInterviews,
  };
}

export type OrgProfile = NonNullable<Awaited<ReturnType<typeof getCompanyWithStats>>>;
