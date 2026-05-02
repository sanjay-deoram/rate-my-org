import type { CompanySearchResponse } from "@/types/review";

export async function searchCompanies(
  query: string,
  { cursor, limit = 10 }: { cursor?: string; limit?: number } = {},
): Promise<CompanySearchResponse> {
  const params = new URLSearchParams({ search: query, limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/companies?${params}`);
  if (!res.ok) throw new Error(`Company search failed: ${res.status}`);
  return res.json();
}
