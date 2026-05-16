"use client";

import { PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Review } from "@/types/org-content";
import { formatEmploymentType, timeAgo } from "@/lib/org-display";
import { useExpandable } from "@/hooks/use-expandable";

export function ReviewCard({ review, showKind }: { review: Review; showKind?: boolean }) {
  const { expanded, setExpanded, overflows, scrollHeight, bodyRef, COLLAPSED_HEIGHT } =
    useExpandable();

  return (
    <article className="bg-surface-container-lowest ring-outline-variant/15 rounded-xl p-10 shadow-lg ring-1 shadow-black/[0.06]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          {showKind && (
            <span className="text-on-surface-variant mb-2 inline-block font-mono text-[10px] tracking-widest uppercase">
              Review
            </span>
          )}
          <h3 className="mb-1 text-xl font-bold">{review.jobTitle}</h3>
          <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            {formatEmploymentType(review.employmentType)} • {timeAgo(new Date(review.createdAt))}
          </p>
        </div>
        <div className="bg-primary text-primary-foreground ml-4 flex shrink-0 items-center rounded px-3 py-1">
          <span className="text-sm font-bold">{review.overallRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="relative">
        <div
          ref={bodyRef}
          style={{
            maxHeight: expanded ? scrollHeight : COLLAPSED_HEIGHT,
            transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                <PlusCircle size={16} className="text-tertiary-fixed-dim" /> Pros
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                {review.pros}
              </p>
            </div>
            <div>
              <h4 className="text-on-surface-variant mb-3 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                <MinusCircle size={16} /> Cons
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                {review.cons}
              </p>
            </div>
          </div>
        </div>

        {!expanded && overflows && (
          <div className="from-surface-container-lowest pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent" />
        )}
      </div>

      {overflows && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-on-surface-variant hover:text-foreground mt-4 flex items-center gap-1 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={13} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={13} /> Read more
            </>
          )}
        </button>
      )}
    </article>
  );
}
