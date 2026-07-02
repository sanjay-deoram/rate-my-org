export type { ReviewPostBody, ReviewFormValues } from "@/lib/schemas/review";

export type CompanySuggestion = {
  slug: string;
  name: string;
  logoUrl: string | null;
  reviewCount: number;
  interviewCount: number;
  avgRating: number | null;
};

export type CompanySearchResponse = {
  items: CompanySuggestion[];
  nextCursor: string | null;
};
