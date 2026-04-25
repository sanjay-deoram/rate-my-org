import type { ReviewPostBody } from "@/types/review";

export type SubmitReviewResponse = {
  review: { id: string; createdAt: string };
};

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
