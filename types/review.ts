export type { ReviewPostBody, ReviewFormValues } from "@/lib/schemas/review";

export type CompanySuggestion = {
  slug: string;
  name: string;
  logoUrl: string | null;
};

export type CompanySearchResponse = {
  items: CompanySuggestion[];
  nextCursor: string | null;
};
