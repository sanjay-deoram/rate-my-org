import { useMutation } from "@tanstack/react-query";
import { createCompany, type CreateCompanyPayload, type CreatedCompany } from "@/lib/api/companies";

export function useCreateCompany(onSuccess: (company: CreatedCompany) => void) {
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess,
    onError: (error: Error) => {
      console.error("Company creation failed:", error.message);
    },
  });
}
