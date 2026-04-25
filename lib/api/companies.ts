import type { CompanySearchResponse } from "@/types/review";

export async function searchCompanies(query: string, limit = 6): Promise<CompanySearchResponse> {
  const res = await fetch(`/api/companies?search=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) throw new Error("Company search failed");
  return res.json();
}
