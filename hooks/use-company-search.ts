import { useInfiniteQuery } from "@tanstack/react-query";
import { searchCompanies } from "@/lib/api/companies";

export function useCompanySearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["companies", "search", query],
    queryFn: ({ pageParam }) => searchCompanies(query, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: query.trim().length > 0,
    staleTime: Infinity,
  });
}
