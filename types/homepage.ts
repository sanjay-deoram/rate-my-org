export type RatingTrend = "up" | "down" | "neutral";

export type TopRatedCompany = {
  slug: string;
  name: string;
  industry: string | null;
  logoKey: string | null;
  avgRating: string | null;
  reviewCount: number;
  latestHeadline: string | null;
  latestSummary: string | null;
  ratingTrend: RatingTrend;
};
