"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X, Building2, ArrowRight } from "lucide-react";
import { useCompanySearch } from "@/hooks/use-company-search";
import { FadeIn } from "@/components/motion-primitives";
import { useCompanyBrowse } from "@/hooks/use-company-browse";
import type { CompanySuggestion } from "@/types/review";
import { CompanyCard } from "@/components/company-card";

function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-5 py-5">
      <div className="bg-surface-container-high h-14 w-14 animate-pulse rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="bg-surface-container-high h-4 w-40 animate-pulse rounded" />
        <div className="bg-surface-container-high h-3 w-24 animate-pulse rounded" />
      </div>
    </div>
  );
}

function dedupeBySlug(items: CompanySuggestion[]): CompanySuggestion[] {
  const seen = new Set<string>();
  return items.filter((c) => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
}

export function CompaniesDirectory() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isSearching = debouncedQuery.trim().length > 0;

  const browse = useCompanyBrowse();
  const search = useCompanySearch(debouncedQuery);

  const active = isSearching ? search : browse;

  // While search is in-flight (no data yet), keep browse cards visible so there's
  // no abrupt blank → skeleton → results flash.
  const isSearchTransitioning = isSearching && search.isLoading && !search.data;
  const isInitialLoad = browse.isLoading && !browse.data;

  const companies = dedupeBySlug(
    isSearchTransitioning
      ? (browse.data?.pages.flatMap((p) => p.items) ?? [])
      : (active.data?.pages.flatMap((p) => p.items) ?? []),
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = active;

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 250);
  }

  function clearSearch() {
    setQuery("");
    setDebouncedQuery("");
  }

  return (
    <div>
      <div className="border-border bg-surface-container-lowest focus-within:ring-ring/30 focus-within:ring-offset-background mb-8 flex items-center overflow-visible rounded-full border shadow-[0_20px_60px_rgba(5,8,7,0.08)] focus-within:ring-2 focus-within:ring-offset-2">
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Search size={18} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            aria-label="Search companies"
            value={query}
            onChange={handleChange}
            placeholder="Search companies..."
            className="placeholder:text-on-surface-variant min-w-0 flex-1 bg-transparent py-2 text-base font-semibold outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-on-surface-variant hover:text-foreground shrink-0 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center pr-3">
          <button
            type="button"
            className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full transition-all hover:opacity-80 active:scale-[0.97]"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        className={`space-y-3 transition-opacity duration-200 ${isSearchTransitioning ? "opacity-40" : "opacity-100"}`}
      >
        {isInitialLoad && Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} />)}

        {!isInitialLoad && !isSearchTransitioning && companies.length === 0 && isSearching && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Building2 size={40} className="text-on-surface-variant/30 mb-4" />
            <p className="text-on-surface-variant font-medium">
              No companies found for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <Link
              href="/orgs/add"
              className="bg-primary text-primary-foreground mt-5 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            >
              Add organization
            </Link>
          </div>
        )}

        {companies.map((company) => (
          <FadeIn key={company.slug}>
            <CompanyCard company={company} />
          </FadeIn>
        ))}

        <div ref={sentinelRef} className="h-4" />

        {!isSearchTransitioning && isFetchingNextPage && <LoadingSkeleton />}
      </div>
    </div>
  );
}
