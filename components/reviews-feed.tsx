"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, MessageSquare, Star, Calendar, X } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { useReviewsBrowse } from "@/hooks/use-reviews-browse";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownClose,
} from "@/components/ui/dropdown";
import type { LucideIcon } from "lucide-react";

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

function FilterDropdown({
  icon: Icon,
  label,
  active,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm font-medium shadow-sm transition-colors ${
            active
              ? "border-primary/40 bg-primary/5 text-foreground"
              : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
          }`}
        >
          <Icon size={13} className="shrink-0" />
          {label}
          <ChevronDown size={11} className="text-foreground/40 shrink-0" />
        </button>
      </DropdownTrigger>
      <DropdownContent align="start" className="min-w-[150px] py-1">
        {options.map((o) => (
          <DropdownClose key={o.value} asChild>
            <DropdownItem
              className="text-xs"
              active={value === o.value}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </DropdownItem>
          </DropdownClose>
        ))}
      </DropdownContent>
    </DropdownRoot>
  );
}

type TrendingCompany = { name: string; slug: string };

export function ReviewsFeed({
  totalReviews,
  trendingCompanies,
}: {
  totalReviews: number;
  trendingCompanies: TrendingCompany[];
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minRating, setMinRating] = useState("");
  const [since, setSince] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useReviewsBrowse({
    q: debouncedQuery || undefined,
    sort: "recent",
    minRating: minRating ? parseInt(minRating) : undefined,
    since: since || undefined,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const handleSentinel = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleSentinel, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleSentinel]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDebouncedQuery(query);
  }

  function pickTrending(companyName: string) {
    setQuery(companyName);
    setDebouncedQuery(companyName);
  }

  const hasFilters = debouncedQuery || minRating || since;
  const resultCount = items.length;

  return (
    <div>
      {/* Grey hero section */}
      <div className="bg-surface-container-low w-full px-8 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-on-surface-variant mb-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
              Explore · {totalReviews.toLocaleString()}+ Anonymous Reviews
            </p>
            <h1 className="text-foreground text-4xl font-black tracking-tighter md:text-6xl">
              Search the archive
            </h1>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="bg-surface-container-lowest border-outline-variant/20 mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border px-5 py-3 shadow-[0_8px_30px_rgba(27,27,27,0.07)] transition-shadow focus-within:shadow-[0_8px_30px_rgba(27,27,27,0.13)]">
              <Search size={16} className="text-on-surface-variant shrink-0" />
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Company name, job title, or keyword..."
                className="placeholder:text-on-surface-variant/40 flex-1 bg-transparent text-sm font-medium outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground shrink-0 rounded-xl px-5 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
              >
                Search
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
                    debouncedQuery === c.name
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
      <div className="mx-auto max-w-5xl px-8 py-8 md:px-12">
        {/* Filter row */}
        <div className="border-outline-variant/15 mb-6 flex flex-wrap items-center gap-2 border-b pb-4">
          <FilterDropdown
            icon={Star}
            label={
              minRating
                ? `${RATING_OPTIONS.find((o) => o.value === minRating)?.label ?? "Any Rating"}`
                : "Any Rating"
            }
            active={!!minRating}
            value={minRating}
            onChange={setMinRating}
            options={RATING_OPTIONS}
          />
          <FilterDropdown
            icon={Calendar}
            label={
              since
                ? `${TIME_OPTIONS.find((o) => o.value === since)?.label ?? "Any Time"}`
                : "Any Time"
            }
            active={!!since}
            value={since}
            onChange={setSince}
            options={TIME_OPTIONS}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
                setMinRating("");
                setSince("");
              }}
              className="text-on-surface-variant hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              <X size={11} /> Clear
            </button>
          )}
          {!isLoading && (
            <span className="text-on-surface-variant ml-auto font-mono text-[10px] tracking-widest uppercase">
              {hasFilters
                ? `${resultCount}${hasNextPage ? "+" : ""} result${resultCount !== 1 ? "s" : ""}`
                : `${totalReviews.toLocaleString()} reviews`}
            </span>
          )}
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest h-64 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <MessageSquare size={40} className="text-on-surface-variant/30 mb-4" />
            <p className="text-on-surface-variant font-medium">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <ReviewCard
                key={item.id}
                review={item}
                showKind
                companyName={item.companyName}
                companySlug={item.companySlug}
                companyIndustry={item.companyIndustry}
                companyLogoKey={item.companyLogoKey}
              />
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="mt-8 flex justify-center">
            <div className="bg-surface-container h-1.5 w-24 animate-pulse rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
