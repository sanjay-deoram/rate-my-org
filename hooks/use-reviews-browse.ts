"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { listReviews } from "@/lib/api/reviews";

export type ReviewFilters = {
  q?: string;
  sort?: string;
  minRating?: number;
  since?: string;
  companySlug?: string;
};

export function useReviewsBrowse(filters: ReviewFilters) {
  return useInfiniteQuery({
    queryKey: ["reviews", "browse", filters],
    queryFn: ({ pageParam }) => listReviews({ ...filters, cursor: pageParam }),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
}
