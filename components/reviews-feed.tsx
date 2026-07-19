"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MessageSquare, Star, Calendar, Building2, X, ArrowRight } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { Pagination } from "@/components/ui/pagination";
import { useCompaniesWithReviews } from "@/hooks/use-companies-with-reviews";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { DecorativeShapes } from "@/components/decorative-shapes";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import type { ReviewFeedItem } from "@/lib/api/reviews";

const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4.0+" },
  { value: "3", label: "3.0+" },
  { value: "2", label: "2.0+" },
];

const TIME_OPTIONS = [
  { value: "", label: "Any Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

type TrendingCompany = { name: string; slug: string };

type ActiveFilters = {
  q?: string;
  minRating?: string;
  since?: string;
  companySlug?: string;
};

export function ReviewsFeed({
  totalReviews,
  trendingCompanies,
  items,
  total,
  page,
  totalPages,
  filters,
}: {
  totalReviews: number;
  trendingCompanies: TrendingCompany[];
  items: ReviewFeedItem[];
  total: number;
  page: number;
  totalPages: number;
  filters: ActiveFilters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local state only for the search input display value
  const [query, setQuery] = useState(filters.q ?? "");

  const { data: companiesData, isLoading: companiesLoading } = useCompaniesWithReviews();
  const companyOptions = [
    { value: "", label: "All Companies" },
    ...(companiesData ?? []).map((c) => ({ value: c.slug, label: c.name })),
  ];

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    return `/reviews?${sp}`;
  }

  function setFilter(key: string, value: string | undefined) {
    router.replace(buildUrl({ [key]: value || undefined, page: undefined }));
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(buildUrl({ q: val || undefined, page: undefined }));
    }, 300);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(buildUrl({ q: query || undefined, page: undefined }));
  }

  function pickTrending(companyName: string) {
    setQuery(companyName);
    router.replace(buildUrl({ q: companyName, page: undefined }));
  }

  function clearAll() {
    setQuery("");
    router.replace("/reviews");
  }

  const hasFilters = filters.q || filters.minRating || filters.since || filters.companySlug;

  return (
    <div>
      {/* Grey hero section */}
      <div className="bg-surface-container-low relative w-full overflow-hidden px-5 py-10 sm:py-14 md:px-12 md:py-20">
        <DecorativeShapes variant="archive" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-6 text-center sm:mb-8">
            <p className="text-on-surface-variant mb-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
              Explore · {totalReviews.toLocaleString()}+ Anonymous Reviews
            </p>
            <h1 className="text-foreground text-3xl font-black sm:text-4xl md:text-6xl">
              Search the archive
            </h1>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="border-border bg-surface-container-lowest mx-auto flex max-w-2xl items-center gap-3 rounded-full border px-5 py-3 shadow-[0_20px_60px_rgba(5,8,7,0.08)]">
              <Search size={18} className="text-on-surface-variant shrink-0" />
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Company name, job title, or keyword..."
                className="placeholder:text-on-surface-variant/45 min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    router.replace(buildUrl({ q: undefined, page: undefined }));
                  }}
                  className="text-on-surface-variant hover:text-foreground shrink-0 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:opacity-80 active:scale-[0.97]"
                aria-label="Search reviews"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Trending company pills */}
          {trendingCompanies.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-on-surface-variant font-mono text-[10px] font-bold tracking-widest uppercase">
                Trending
              </span>
              {trendingCompanies.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => pickTrending(c.name)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    filters.q === c.name
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters + cards */}
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8 md:px-12">
        {/* Filter row */}
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
          {companiesLoading ? (
            <div className="border-outline-variant/40 bg-surface-container-lowest h-9 w-36 animate-pulse rounded-2xl border" />
          ) : (
            <FilterDropdown
              icon={Building2}
              label={
                companyOptions.find((o) => o.value === (filters.companySlug ?? ""))?.label ??
                "All Companies"
              }
              active={!!filters.companySlug}
              value={filters.companySlug ?? ""}
              onChange={(v) => setFilter("companySlug", v)}
              options={companyOptions}
            />
          )}
          <FilterDropdown
            icon={Star}
            label={
              filters.minRating
                ? (RATING_OPTIONS.find((o) => o.value === filters.minRating)?.label ?? "Any Rating")
                : "Any Rating"
            }
            active={!!filters.minRating}
            value={filters.minRating ?? ""}
            onChange={(v) => setFilter("minRating", v)}
            options={RATING_OPTIONS}
          />
          <FilterDropdown
            icon={Calendar}
            label={
              filters.since
                ? (TIME_OPTIONS.find((o) => o.value === filters.since)?.label ?? "Any Time")
                : "Any Time"
            }
            active={!!filters.since}
            value={filters.since ?? ""}
            onChange={(v) => setFilter("since", v)}
            options={TIME_OPTIONS}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-on-surface-variant hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              <X size={11} /> Clear
            </button>
          )}
          <span className="text-on-surface-variant ml-auto font-mono text-[10px] tracking-widest uppercase">
            {hasFilters
              ? `${total} result${total !== 1 ? "s" : ""}`
              : `${totalReviews.toLocaleString()} reviews`}
          </span>
        </div>
        <div className="border-outline-variant/15 -mx-8 mb-4 border-t sm:mb-6 md:-mx-12" />

        {/* Cards */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center sm:py-24">
            <MessageSquare size={40} className="text-on-surface-variant/30 mb-4" />
            <p className="text-on-surface-variant font-medium">No reviews found</p>
          </div>
        ) : (
          <Stagger key={page} className="space-y-3 sm:space-y-6">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <ReviewCard
                  review={item}
                  showKind
                  companyName={item.companyName}
                  companySlug={item.companySlug}
                  companyIndustry={item.companyIndustry}
                  companyLogoKey={item.companyLogoKey}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="mt-6 sm:mt-10">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => router.replace(buildUrl({ page: String(p) }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
