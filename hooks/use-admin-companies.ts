import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  updateCompany,
  uploadCompanyLogo,
  type UpdateCompanyPayload,
} from "@/lib/api/admin";

const PENDING_KEY = ["admin", "companies", "pending"] as const;

export function useAdminPendingCompanies() {
  return useQuery({
    queryKey: PENDING_KEY,
    queryFn: getPendingCompanies,
    staleTime: 30_000,
  });
}

export function useApproveCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveCompany(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PENDING_KEY }),
    onError: (err: Error) => console.error("Approve failed:", err.message),
  });
}

export function useRejectCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectCompany(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PENDING_KEY }),
    onError: (err: Error) => console.error("Reject failed:", err.message),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyPayload }) =>
      updateCompany(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PENDING_KEY }),
    onError: (err: Error) => console.error("Update failed:", err.message),
  });
}

export function useUploadCompanyLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadCompanyLogo(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: PENDING_KEY }),
    onError: (err: Error) => console.error("Logo upload failed:", err.message),
  });
}
