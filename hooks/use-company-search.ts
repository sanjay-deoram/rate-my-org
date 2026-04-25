import { useQuery } from "@tanstack/react-query";
import { searchCompanies } from "@/lib/api/companies";

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: ["companies", "search", query],
    queryFn: () => searchCompanies(query),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}
