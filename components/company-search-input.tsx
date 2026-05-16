"use client";

import { useState, useRef, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanySearch } from "@/hooks/use-company-search";
import { AddOrganizationModal } from "@/components/add-organization-modal";
import type { CompanySuggestion } from "@/types/review";

const inputCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full border-b bg-transparent py-4 font-medium transition-all outline-none focus:ring-0";

type Props = {
  onSelect: (company: CompanySuggestion) => void;
  onInputChange?: () => void;
  showAddCompany?: boolean;
  hasError?: boolean;
  placeholder?: string;
  inputSize?: "default" | "lg";
  noUnderline?: boolean;
  wrapperClassName?: string;
};

export function CompanySearchInput({
  onSelect,
  onInputChange,
  showAddCompany = false,
  hasError = false,
  placeholder = "Search for a company or institution...",
  inputSize = "default",
  noUnderline = false,
  wrapperClassName = "relative",
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useCompanySearch(debouncedQuery);

  const suggestions = data?.pages.flatMap((p) => p.items) ?? [];
  const hasQuery = debouncedQuery.trim().length > 0;
  const noResults = hasQuery && !isFetching && !isError && suggestions.length === 0;
  const showList = showDropdown && hasQuery;

  // Observe sentinel relative to the scroll container, not the viewport.
  // Without `root`, the IO fires as soon as the sentinel enters the viewport
  // (i.e. on mount), loading every page immediately instead of on scroll.
  useEffect(() => {
    const el = sentinelRef.current;
    const container = scrollContainerRef.current;
    if (!el || !container || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { root: container, threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    onInputChange?.();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setDebouncedQuery("");
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setShowDropdown(true);
    }, 200);
  }

  function handleSelect(item: CompanySuggestion) {
    setInputValue(item.name);
    setShowDropdown(false);
    onSelect(item);
  }

  return (
    <div className={wrapperClassName}>
      <div className="group relative">
        <Search
          size={20}
          className="text-on-surface-variant group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onFocus={() => hasQuery && setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            inputCls,
            "pl-8",
            inputSize === "lg" && "text-lg",
            noUnderline && "border-b-0",
            hasError && "border-destructive",
          )}
        />
      </div>

      {showList && (
        <div className="bg-surface-container-lowest border-outline-variant/20 absolute top-full left-0 z-200 mt-1 w-full overflow-hidden rounded-lg border shadow-lg">
          <div ref={scrollContainerRef} className="max-h-64 overflow-y-auto overscroll-contain p-2">
            {isFetching &&
              suggestions.length === 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="bg-surface-container-high h-8 w-8 animate-pulse rounded" />
                  <div className="bg-surface-container-high h-4 w-40 animate-pulse rounded" />
                </div>
              ))}

            {suggestions.map((item) => (
              <button
                key={item.slug}
                type="button"
                onMouseDown={() => handleSelect(item)}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-lg px-4 py-3 text-left"
              >
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-lg transition-transform duration-300 ease-out group-hover:scale-x-100" />
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt=""
                    className="relative h-8 w-8 rounded object-contain transition-opacity duration-300 group-hover:opacity-80"
                  />
                ) : (
                  <div className="bg-surface-container-highest group-hover:text-primary-foreground relative flex h-8 w-8 items-center justify-center rounded text-xs font-black transition-colors duration-300 group-hover:bg-white/20">
                    {item.name[0]}
                  </div>
                )}
                <span className="group-hover:text-primary-foreground relative font-medium transition-colors duration-300">
                  {item.name}
                </span>
              </button>
            ))}

            {isFetchingNextPage && (
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="bg-surface-container-high h-8 w-8 animate-pulse rounded" />
                <div className="bg-surface-container-high h-4 w-32 animate-pulse rounded" />
              </div>
            )}

            <div ref={sentinelRef} className="h-1" />

            {isError && (
              <div className="text-destructive px-4 py-3 text-sm">
                Failed to load results. Try again.
              </div>
            )}

            {noResults && (
              <div className="text-on-surface-variant px-4 py-3 text-sm">
                No organization found for &ldquo;{debouncedQuery}&rdquo;
              </div>
            )}
          </div>

          {showAddCompany && (
            <div className="border-outline-variant/20 border-t px-2 pt-1 pb-2">
              <button
                type="button"
                onMouseDown={() => {
                  setShowDropdown(false);
                  setIsModalOpen(true);
                }}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-lg px-4 py-3 text-left"
              >
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <div className="bg-surface-container-highest relative flex h-8 w-8 items-center justify-center rounded transition-colors duration-300 group-hover:bg-white/20">
                  <PlusCircle
                    size={16}
                    className="text-on-surface-variant group-hover:text-primary-foreground transition-colors duration-300"
                  />
                </div>
                <span className="text-on-surface-variant group-hover:text-primary-foreground relative text-sm font-medium transition-colors duration-300">
                  Add company
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <AddOrganizationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialName={inputValue}
        onCompanyCreated={(company) => {
          setInputValue(company.name);
          setShowDropdown(false);
          onSelect({
            slug: company.slug,
            name: company.name,
            logoUrl: null,
            reviewCount: 0,
            interviewCount: 0,
            avgRating: null,
          });
        }}
      />
    </div>
  );
}
