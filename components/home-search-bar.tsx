"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Building2, ArrowRight } from "lucide-react";
import { useCompanySearch } from "@/hooks/use-company-search";
import type { CompanySuggestion } from "@/types/review";

function CompanyCard({
  company,
  id,
  active,
}: {
  company: CompanySuggestion;
  id?: string;
  active?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      id={id}
      role="option"
      aria-selected={active}
      type="button"
      onClick={() => router.push(`/orgs/${company.slug}`)}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-xl px-4 py-4 text-left ${active ? "bg-surface-container" : ""}`}
    >
      {/* Primary wipe background */}
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />

      <div className="relative shrink-0">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt=""
            className="bg-surface-container h-12 w-12 rounded-lg object-contain p-1 transition-colors duration-300 group-hover:bg-white/10"
          />
        ) : (
          <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg text-lg font-black transition-colors duration-300 group-hover:bg-white/10">
            {company.name[0]}
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <h3 className="text-foreground group-hover:text-primary-foreground truncate text-base font-bold transition-colors duration-300">
          {company.name}
        </h3>
        <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[11px] tracking-widest uppercase transition-colors duration-300">
          {company.slug}
        </p>
      </div>

      <span className="text-on-surface-variant group-hover:text-primary-foreground relative shrink-0 text-sm font-bold transition-colors duration-300">
        View →
      </span>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-5 py-5">
      <div className="bg-surface-container-high h-12 w-12 animate-pulse rounded-lg" />
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

export function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isSearching = debouncedQuery.trim().length > 0;
  const search = useCompanySearch(debouncedQuery);

  const companies = dedupeBySlug(search.data?.pages.flatMap((p) => p.items) ?? []);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = search;

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
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 250);
  }

  function clearSearch() {
    setQuery("");
    setDebouncedQuery("");
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearching || companies.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % companies.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + companies.length) % companies.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < companies.length) {
        e.preventDefault();
        router.push(`/orgs/${companies[activeIndex].slug}`);
      }
    } else if (e.key === "Escape") {
      clearSearch();
    }
  }

  return (
    <div className="relative">
      {/* Search bar */}
      <div className="border-border bg-surface-container-lowest focus-within:ring-ring mb-0 flex items-center overflow-visible rounded-full border shadow-[0_20px_60px_rgba(5,8,7,0.08)] focus-within:ring-2">
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Search size={18} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            role="combobox"
            aria-label="Search for a company, role, or culture tag"
            aria-expanded={isSearching}
            aria-controls="home-search-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `home-search-option-${activeIndex}` : undefined
            }
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a company, role, or culture tag..."
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

      {/* Inline results */}
      {isSearching && (
        <div className="border-border absolute right-0 left-0 z-50 mt-3 rounded-[1.25rem] border bg-white p-3 shadow-xl">
          <div
            id="home-search-listbox"
            role="listbox"
            className="divide-outline-variant/20 max-h-[360px] divide-y overflow-y-auto"
          >
            {isLoading && Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)}

            {!isLoading && companies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 size={36} className="text-on-surface-variant/30 mb-4" />
                <p className="text-on-surface-variant font-medium">
                  No companies found for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <Link
                  href="/orgs/add"
                  className="bg-primary text-primary-foreground mt-5 rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
                >
                  Add organization
                </Link>
              </div>
            )}

            {companies.map((company, i) => (
              <CompanyCard
                key={company.slug}
                id={`home-search-option-${i}`}
                active={i === activeIndex}
                company={company}
              />
            ))}

            <div ref={sentinelRef} className="h-4" />

            {isFetchingNextPage && <LoadingSkeleton />}
          </div>

          {/* Result count at bottom */}
          {!isLoading && companies.length > 0 && (
            <div className="border-outline-variant/20 border-t py-4">
              <p className="text-on-surface-variant text-sm">
                Showing <span className="text-foreground font-semibold">{companies.length}</span>{" "}
                results for{" "}
                <span className="text-foreground font-semibold">
                  &ldquo;{debouncedQuery}&rdquo;
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
