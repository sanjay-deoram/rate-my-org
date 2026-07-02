"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MessageSquare,
  Calendar,
  Building2,
  X,
  Smile,
  Gift,
  ArrowRight,
} from "lucide-react";
import { InterviewCard } from "@/components/interview-card";
import { Pagination } from "@/components/ui/pagination";
import { useCompaniesWithInterviews } from "@/hooks/use-companies-with-interviews";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { DecorativeShapes } from "@/components/decorative-shapes";
import type { InterviewFeedItem } from "@/lib/api/interviews";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Any Experience" },
  { value: "Great", label: "Great" },
  { value: "Neutral", label: "Neutral" },
  { value: "Negative", label: "Negative" },
];

const OFFER_OPTIONS = [
  { value: "", label: "Any Outcome" },
  { value: "Yes", label: "Offer Received" },
  { value: "No", label: "No Offer" },
  { value: "Yes but Declined", label: "Declined Offer" },
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
  experience?: string;
  offerReceived?: string;
  since?: string;
  companySlug?: string;
};

export function InterviewsFeed({
  totalInterviews,
  trendingCompanies,
  items,
  total,
  page,
  totalPages,
  filters,
}: {
  totalInterviews: number;
  trendingCompanies: TrendingCompany[];
  items: InterviewFeedItem[];
  total: number;
  page: number;
  totalPages: number;
  filters: ActiveFilters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState(filters.q ?? "");

  const { data: companiesData, isLoading: companiesLoading } = useCompaniesWithInterviews();
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
    return `/interviews?${sp}`;
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
    router.replace("/interviews");
  }

  const hasFilters =
    filters.q ||
    filters.experience ||
    filters.offerReceived ||
    filters.since ||
    filters.companySlug;

  return (
    <div>
      {/* Grey hero section */}
      <div className="bg-surface-container-low relative w-full overflow-hidden px-8 py-16 md:px-12 md:py-20">
        <DecorativeShapes variant="archive" className="scale-x-[-1]" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-on-surface-variant mb-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
              Explore · {totalInterviews.toLocaleString()}+ Anonymous Interviews
            </p>
            <h1 className="text-foreground text-4xl font-black tracking-tighter md:text-6xl">
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
                placeholder="Company name, role title, or keyword..."
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
                aria-label="Search interviews"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Trending company pills */}
          {trendingCompanies.length > 0 && (
            <div className="flex items-center justify-center gap-3">
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
      <div className="mx-auto max-w-6xl px-8 py-8 md:px-12">
        {/* Filter row */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
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
            icon={Smile}
            label={
              filters.experience
                ? (EXPERIENCE_OPTIONS.find((o) => o.value === filters.experience)?.label ??
                  "Any Experience")
                : "Any Experience"
            }
            active={!!filters.experience}
            value={filters.experience ?? ""}
            onChange={(v) => setFilter("experience", v)}
            options={EXPERIENCE_OPTIONS}
          />
          <FilterDropdown
            icon={Gift}
            label={
              filters.offerReceived
                ? (OFFER_OPTIONS.find((o) => o.value === filters.offerReceived)?.label ??
                  "Any Outcome")
                : "Any Outcome"
            }
            active={!!filters.offerReceived}
            value={filters.offerReceived ?? ""}
            onChange={(v) => setFilter("offerReceived", v)}
            options={OFFER_OPTIONS}
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
              : `${totalInterviews.toLocaleString()} interviews`}
          </span>
        </div>
        <div className="border-outline-variant/15 -mx-8 mb-6 border-t md:-mx-12" />

        {/* Cards */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <MessageSquare size={40} className="text-on-surface-variant/30 mb-4" />
            <p className="text-on-surface-variant font-medium">No interviews found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                showKind
                companyName={item.companyName}
                companySlug={item.companySlug}
                companyLogoKey={item.companyLogoKey}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="mt-10">
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
