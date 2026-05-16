import { PlusCircle, MinusCircle } from "lucide-react";
import type { Review } from "@/types/org-content";
import { formatEmploymentType, timeAgo } from "@/lib/org-display";

export function ReviewCard({ review, showKind }: { review: Review; showKind?: boolean }) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
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
    </article>
  );
}
