import type { Company } from "@/lib/schemas/company";

export type PendingCompany = Company & {
  reviewCount: number;
  interviewCount: number;
};

export type UpdateCompanyPayload = Partial<{
  name: string;
  industry: string;
  headquarters: string;
  website: string;
  size: string;
  description: string;
}>;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getPendingCompanies(): Promise<PendingCompany[]> {
  const res = await fetch("/api/admin/companies/pending");
  const data = await handleResponse<{ companies: PendingCompany[] }>(res);
  return data.companies;
}

export async function approveCompany(id: string): Promise<Company> {
  const res = await fetch(`/api/admin/companies/${id}/approve`, { method: "POST" });
  const data = await handleResponse<{ company: Company }>(res);
  return data.company;
}

export async function rejectCompany(id: string): Promise<void> {
  const res = await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
  if (res.status === 204) return;
  await handleResponse<never>(res);
}

export async function updateCompany(id: string, payload: UpdateCompanyPayload): Promise<Company> {
  const res = await fetch(`/api/admin/companies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ company: Company }>(res);
  return data.company;
}

export async function uploadCompanyLogo(id: string, file: File): Promise<{ logoKey: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/admin/companies/${id}/logo`, { method: "POST", body: formData });
  return handleResponse<{ logoKey: string }>(res);
}
