"use client";

import { useQuery } from "@tanstack/react-query";

type CompanyOption = { name: string; slug: string };

async function fetchCompaniesWithInterviews(): Promise<CompanyOption[]> {
  const res = await fetch("/api/companies/with-interviews");
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}

export function useCompaniesWithInterviews() {
  return useQuery({
    queryKey: ["companies", "with-interviews"],
    queryFn: fetchCompaniesWithInterviews,
    staleTime: 1000 * 60 * 5,
  });
}
