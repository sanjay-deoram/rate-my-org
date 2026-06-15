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
};

export type ReviewBrowsePage = {
  items: ReviewFeedItem[];
  nextCursor: number | null;
};

export async function listReviews(params: {
  q?: string;
  sort?: string;
  minRating?: number;
  since?: string;
  cursor?: number;
}): Promise<ReviewBrowsePage> {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort) sp.set("sort", params.sort);
  if (params.minRating !== undefined) sp.set("minRating", String(params.minRating));
  if (params.since) sp.set("since", params.since);
  if (params.cursor !== undefined) sp.set("cursor", String(params.cursor));
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
    throw new Error(data.error ?? "Submission failed");
  }
  return res.json();
}
