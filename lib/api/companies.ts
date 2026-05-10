import type { CompanySearchResponse } from "@/types/review";
import type { Company, CreateCompanyPayload } from "@/lib/schemas/company";

export type { CreateCompanyPayload };

export type CreatedCompany = Pick<Company, "id" | "slug" | "name" | "headquarters">;

export async function createCompany(payload: CreateCompanyPayload): Promise<CreatedCompany> {
  const res = await fetch("/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) {
    const data = await res.json();
    throw Object.assign(new Error(data.error ?? "Company already exists."), {
      status: 409,
      slug: data.slug,
    });
  }
  if (!res.ok) throw new Error("Failed to create company. Please try again.");
  const data = await res.json();
  return data.company;
}

export async function listCompanies({
  cursor,
  limit = 20,
}: { cursor?: string; limit?: number } = {}): Promise<CompanySearchResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/companies?${params}`);
  if (!res.ok) throw new Error(`Company list failed: ${res.status}`);
  return res.json();
}

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
