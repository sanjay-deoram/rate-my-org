"use client";

import { useRouter } from "next/navigation";
import { CompanySearchInput } from "@/components/company-search-input";
import type { CompanySuggestion } from "@/types/review";

export function HomeSearchBar() {
  const router = useRouter();

  function handleSelect(company: CompanySuggestion) {
    router.push(`/orgs/${company.slug}`);
  }

  return (
    <div className="bg-surface-container-lowest border-border/20 relative flex items-center overflow-visible rounded-2xl border shadow-[0_20px_60px_rgba(27,27,27,0.08)]">
      <div className="flex-1 px-5 py-2">
        <CompanySearchInput
          onSelect={handleSelect}
          placeholder="Search for a company, role, or culture tag..."
          inputSize="lg"
          noUnderline
          wrapperClassName=""
        />
      </div>
      <div className="flex shrink-0 items-center pr-3">
        <button
          type="button"
          className="bg-foreground text-background h-10 rounded-xl px-5 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97]"
        >
          Search
        </button>
      </div>
    </div>
  );
}
