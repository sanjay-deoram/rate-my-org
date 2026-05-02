"use client";

import { useState, useRef } from "react";
import { Search, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCompanySearch } from "@/hooks/use-company-search";
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchData, isFetching } = useCompanySearch(debouncedQuery);
  const suggestions = searchData?.items ?? [];
  const hasQuery = debouncedQuery.trim().length > 0;
  const noResults = hasQuery && !isFetching && suggestions.length === 0;
  const showList = showDropdown && hasQuery;

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
        <div className="bg-surface-container-lowest border-outline-variant/20 absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border shadow-lg">
          {suggestions.map((item) => (
            <button
              key={item.slug}
              type="button"
              onMouseDown={() => handleSelect(item)}
              className="hover:bg-surface-container-low flex w-full items-center gap-4 px-4 py-3 text-left transition-colors"
            >
              {item.logoUrl ? (
                <img src={item.logoUrl} alt="" className="h-8 w-8 rounded object-contain" />
              ) : (
                <div className="bg-surface-container-highest flex h-8 w-8 items-center justify-center rounded text-xs font-black">
                  {item.name[0]}
                </div>
              )}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}

          {noResults && (
            <div className="text-on-surface-variant px-4 py-3 text-sm">
              No organization found for &ldquo;{debouncedQuery}&rdquo;
            </div>
          )}

          {showAddCompany && (
            <Link
              href="/orgs/add"
              className="border-outline-variant/20 hover:bg-surface-container-low flex w-full items-center gap-4 border-t px-4 py-3 text-left transition-colors"
            >
              <div className="bg-surface-container-highest flex h-8 w-8 items-center justify-center rounded">
                <PlusCircle size={16} className="text-on-surface-variant" />
              </div>
              <span className="text-on-surface-variant text-sm font-medium">Add company</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
