"use client";

import { useQuery } from "@tanstack/react-query";

type CompanyOption = { name: string; slug: string };

async function fetchCompaniesWithReviews(): Promise<CompanyOption[]> {
  const res = await fetch("/api/companies/with-reviews");
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}

export function useCompaniesWithReviews() {
  return useQuery({
    queryKey: ["companies", "with-reviews"],
    queryFn: fetchCompaniesWithReviews,
    staleTime: 1000 * 60 * 5,
  });
}
