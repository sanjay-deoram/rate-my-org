import type { RatingTrend } from "@/types/homepage";

export type HomepageStats = {
  totalReviews: number;
  totalCompanies: number;
  totalInterviews: number;
};

export type LeaderboardEntry = {
  slug: string;
  name: string;
  industry: string | null;
  logoKey: string | null;
  avgRating: string | null;
  ratingTrend: RatingTrend;
};

export type MockupCompany = {
  name: string;
  industry: string | null;
  logoKey: string | null;
};

export type WorkspaceSceneProps = {
  stats: HomepageStats;
  leaderboard: LeaderboardEntry[];
  mockupCompany: MockupCompany;
};
