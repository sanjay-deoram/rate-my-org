"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground flex h-8 w-8 items-center justify-center rounded-xl border transition-colors disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9"
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span key={`ellipsis-${idx}`} className="text-on-surface-variant px-1 text-xs">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border font-mono text-[11px] font-bold transition-colors sm:h-9 sm:w-9 ${
              page === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground flex h-8 w-8 items-center justify-center rounded-xl border transition-colors disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
