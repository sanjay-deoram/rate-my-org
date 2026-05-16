"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X, Building2, Star, MessageSquare, Users } from "lucide-react";
import { useCompanySearch } from "@/hooks/use-company-search";
import { useCompanyBrowse } from "@/hooks/use-company-browse";
import type { CompanySuggestion } from "@/types/review";

const STAT_PILL_VARIANT = {
  amber: "bg-amber-50 text-amber-700",
  neutral: "bg-surface-container text-on-surface-variant",
} as const;

function StatPill({
  label,
  variant,
  children,
}: {
  label: string;
  variant: keyof typeof STAT_PILL_VARIANT;
  children: React.ReactNode;
}) {
  return (
    <div className="group/pill relative">
      <span
        className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white ${STAT_PILL_VARIANT[variant]}`}
      >
        {children}
      </span>
      <div className="bg-foreground pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded px-2 py-1 font-mono text-[10px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover/pill:opacity-100">
        {label}
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: CompanySuggestion }) {
  return (
    <Link
      href={`/orgs/${company.slug}`}
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-xl px-6 py-5"
    >
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />

      <div className="relative shrink-0">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt=""
            className="bg-surface-container h-14 w-14 rounded-lg object-contain p-1 transition-colors duration-300 group-hover:bg-white/10"
          />
        ) : (
          <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-14 w-14 items-center justify-center rounded-lg text-xl font-black transition-colors duration-300 group-hover:bg-white/10">
            {company.name[0]}
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <h3 className="text-foreground group-hover:text-primary-foreground truncate text-base font-bold transition-colors duration-300">
          {company.name}
        </h3>
        <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[11px] tracking-wide transition-colors duration-300">
          {company.slug}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <StatPill label="Rating" variant="amber">
            <Star size={9} className="fill-current" />
            {company.avgRating ?? "—"}
          </StatPill>
          <StatPill label="Reviews" variant="neutral">
            <MessageSquare size={9} />
            {company.reviewCount}
          </StatPill>
          <StatPill label="Interviews" variant="neutral">
            <Users size={9} />
            {company.interviewCount}
          </StatPill>
        </div>
      </div>

      <span className="text-on-surface-variant group-hover:text-primary-foreground relative shrink-0 text-sm font-medium transition-colors duration-300">
        View →
      </span>
    </Link>
  );
}

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
  const companies = dedupeBySlug(active.data?.pages.flatMap((p) => p.items) ?? []);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = active;

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
      <div className="bg-surface-container-lowest border-border/20 mb-8 flex items-center overflow-visible rounded-2xl border shadow-[0_20px_60px_rgba(27,27,27,0.08)]">
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Search size={18} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search companies..."
            className="placeholder:text-on-surface-variant/40 flex-1 bg-transparent py-2 text-sm font-medium outline-none"
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
            className="bg-foreground text-background h-10 rounded-xl px-5 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97]"
          >
            Search
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="mb-6">
          <p className="text-on-surface-variant text-sm">
            {isSearching ? (
              <>
                Showing <span className="text-foreground font-semibold">{companies.length}</span>{" "}
                results for{" "}
                <span className="text-foreground font-semibold">
                  &ldquo;{debouncedQuery}&rdquo;
                </span>
              </>
            ) : (
              <>
                <span className="text-foreground font-semibold">{companies.length}</span>{" "}
                organizations loaded
              </>
            )}
          </p>
        </div>
      )}

      <div className="divide-outline-variant/20 divide-y rounded-2xl bg-white px-6 pt-2 shadow-sm">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} />)}

        {!isLoading && companies.length === 0 && isSearching && (
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
          <CompanyCard key={company.slug} company={company} />
        ))}

        <div ref={sentinelRef} className="h-4" />

        {isFetchingNextPage && <LoadingSkeleton />}
      </div>
    </div>
  );
}
