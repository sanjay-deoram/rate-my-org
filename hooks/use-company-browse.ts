import { useInfiniteQuery } from "@tanstack/react-query";
import { listCompanies } from "@/lib/api/companies";

export function useCompanyBrowse() {
  return useInfiniteQuery({
    queryKey: ["companies", "browse"],
    queryFn: ({ pageParam }) => listCompanies({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
}
