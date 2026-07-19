"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X, Building2, Star, MessageSquare, Users, ArrowRight } from "lucide-react";
import { useCompanySearch } from "@/hooks/use-company-search";
import { FadeIn } from "@/components/motion-primitives";
import { useCompanyBrowse } from "@/hooks/use-company-browse";
import type { CompanySuggestion } from "@/types/review";

const STAT_PILL_VARIANT = {
  amber: "bg-[#3be366]/10 text-[#3be366]",
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
      className="group relative isolate flex items-center gap-3 overflow-hidden rounded-xl px-4 py-4 md:gap-5 md:px-6 md:py-5"
    >
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />

      <div className="relative shrink-0">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt=""
            className="bg-surface-container h-10 w-10 rounded-lg object-contain p-1 transition-colors duration-300 group-hover:bg-white/10 md:h-14 md:w-14"
          />
        ) : (
          <div className="bg-surface-container text-on-surface-variant group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg text-base font-black transition-colors duration-300 group-hover:bg-white/10 md:h-14 md:w-14 md:text-xl">
            {company.name[0]}
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <h3 className="text-foreground group-hover:text-primary-foreground truncate text-sm font-bold transition-colors duration-300 md:text-base">
          {company.name}
        </h3>
        <p className="text-on-surface-variant group-hover:text-primary-foreground/50 font-mono text-[10px] tracking-wide transition-colors duration-300 md:text-[11px]">
          {company.slug}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
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

      <ArrowRight
        size={16}
        className="text-on-surface-variant group-hover:text-primary-foreground relative shrink-0 transition-colors duration-300"
      />
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
      <div className="border-border bg-surface-container-lowest mb-8 flex items-center overflow-visible rounded-full border shadow-[0_20px_60px_rgba(5,8,7,0.08)]">
        <div className="flex flex-1 items-center gap-3 px-5 py-3">
          <Search size={18} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search companies..."
            className="placeholder:text-on-surface-variant/45 min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none"
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
        className={`divide-outline-variant/20 divide-y rounded-2xl bg-white px-3 pt-2 shadow-sm transition-opacity duration-200 sm:px-6 ${isSearchTransitioning ? "opacity-40" : "opacity-100"}`}
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
