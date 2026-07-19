"use client";

import { useState, useRef, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanySearch } from "@/hooks/use-company-search";
import { AddOrganizationModal } from "@/components/add-organization-modal";
import type { CompanySuggestion } from "@/types/review";

const inputCls =
  "placeholder:text-on-surface-variant w-full bg-transparent py-3 text-base font-semibold transition-all outline-none focus:ring-0";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useCompanySearch(debouncedQuery);

  const suggestions = data?.pages.flatMap((p) => p.items) ?? [];
  const hasQuery = debouncedQuery.trim().length > 0;
  const noResults = hasQuery && !isFetching && !isError && suggestions.length === 0;
  const showList = showDropdown && hasQuery;

  // Total keyboard-navigable options: suggestions plus the trailing "Add company" row.
  const optionCount = suggestions.length + (showAddCompany ? 1 : 0);

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
    setActiveIndex(-1);
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

  function openAddCompanyModal() {
    setShowDropdown(false);
    setIsModalOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList || optionCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % optionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + optionCount) % optionCount);
    } else if (e.key === "Enter") {
      if (activeIndex < 0) return;
      e.preventDefault();
      if (activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else {
        openAddCompanyModal();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  function handleContainerBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setShowDropdown(false);
    }
  }

  return (
    <div ref={containerRef} className={wrapperClassName} onBlur={handleContainerBlur}>
      <div
        className={cn(
          "group border-border bg-surface-container-lowest focus-within:ring-ring/30 focus-within:ring-offset-background relative flex items-center rounded-full border px-5 py-1 shadow-[0_20px_60px_rgba(5,8,7,0.08)] focus-within:ring-2 focus-within:ring-offset-2",
          hasError && "border-destructive",
        )}
      >
        <Search
          size={18}
          className="text-on-surface-variant group-focus-within:text-primary shrink-0 transition-colors"
        />
        <input
          type="text"
          role="combobox"
          aria-label={placeholder}
          aria-expanded={showList}
          aria-controls="company-search-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `company-search-option-${activeIndex}` : undefined
          }
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => hasQuery && setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            inputCls,
            "ml-3 min-w-0 flex-1",
            inputSize === "lg" && "text-lg",
            noUnderline && "border-b-0",
          )}
        />
      </div>

      {showList && (
        <div className="border-border bg-surface-container-lowest absolute top-full left-0 z-200 mt-3 w-full overflow-hidden rounded-[1.25rem] border shadow-xl">
          <div
            id="company-search-listbox"
            role="listbox"
            ref={scrollContainerRef}
            className="max-h-64 overflow-y-auto overscroll-contain p-2"
          >
            {isFetching &&
              suggestions.length === 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="bg-surface-container-high h-8 w-8 animate-pulse rounded-lg" />
                  <div className="bg-surface-container-high h-4 w-40 animate-pulse rounded" />
                </div>
              ))}

            {suggestions.map((item, i) => (
              <button
                key={item.slug}
                id={`company-search-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                type="button"
                onMouseDown={() => handleSelect(item)}
                className={cn(
                  "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl px-4 py-3 text-left",
                  i === activeIndex && "bg-surface-container",
                )}
              >
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt=""
                    className="relative h-8 w-8 rounded-lg object-contain transition-opacity duration-300 group-hover:opacity-80"
                  />
                ) : (
                  <div className="bg-surface-container-highest group-hover:text-primary-foreground relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-colors duration-300 group-hover:bg-white/20">
                    {item.name[0]}
                  </div>
                )}
                <span className="group-hover:text-primary-foreground relative font-semibold transition-colors duration-300">
                  {item.name}
                </span>
              </button>
            ))}

            {isFetchingNextPage && (
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="bg-surface-container-high h-8 w-8 animate-pulse rounded-lg" />
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
                id={`company-search-option-${suggestions.length}`}
                role="option"
                aria-selected={activeIndex === suggestions.length}
                type="button"
                onMouseDown={openAddCompanyModal}
                className={cn(
                  "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl px-4 py-3 text-left",
                  activeIndex === suggestions.length && "bg-surface-container",
                )}
              >
                <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <div className="bg-surface-container-highest relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-white/20">
                  <PlusCircle
                    size={16}
                    className="text-on-surface-variant group-hover:text-primary-foreground transition-colors duration-300"
                  />
                </div>
                <span className="text-on-surface-variant group-hover:text-primary-foreground relative text-sm font-semibold transition-colors duration-300">
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
