"use client";

import Link from "next/link";
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatEmploymentType, timeAgo } from "@/lib/org-display";
import { useExpandable } from "@/hooks/use-expandable";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

export type ReviewCardData = {
  jobTitle: string;
  employmentType: string;
  createdAt: Date | string;
  overallRating: number;
  pros: string;
  cons: string;
};

type ReviewCardProps = {
  review: ReviewCardData;
  showKind?: boolean;
  companyName?: string;
  companySlug?: string;
  companyIndustry?: string | null;
  companyLogoKey?: string | null;
};

function CompanyLogo({
  logoKey,
  name,
}: {
  logoKey: string | null | undefined;
  name: string | undefined;
}) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);

  if (logoKey) {
    return (
      <img
        src={`${CDN}/${logoKey}`}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="bg-surface-container text-on-surface-variant flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-tight uppercase">
      {initials}
    </div>
  );
}

export function ReviewCard({
  review,
  showKind,
  companyName,
  companySlug,
  companyLogoKey,
}: ReviewCardProps) {
  const { expanded, setExpanded, overflows, scrollHeight, bodyRef, COLLAPSED_HEIGHT } =
    useExpandable();

  return (
    <article className="bg-surface-container-lowest ring-outline-variant/15 rounded-xl p-10 shadow-lg ring-1 shadow-black/[0.06]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {companyLogoKey !== undefined && (
            <CompanyLogo logoKey={companyLogoKey} name={companyName} />
          )}
          <div>
            {companyName && companySlug ? (
              <Link
                href={`/orgs/${companySlug}`}
                className="text-on-surface-variant hover:text-foreground mb-1 block font-mono text-[11px] font-bold tracking-widest uppercase transition-colors"
              >
                {companyName}
              </Link>
            ) : null}
            <h3 className="text-xl leading-tight font-bold">{review.jobTitle}</h3>
            <p className="text-on-surface-variant/70 mt-1 font-mono text-[10px] tracking-widest uppercase">
              {showKind && (
                <>
                  <span className="text-on-surface-variant mb-1 inline-block font-mono text-[11px] font-bold tracking-widest uppercase">
                    Review
                  </span>
                  <span className="text-on-surface-variant mx-1">·</span>
                </>
              )}
              {formatEmploymentType(review.employmentType)} · {timeAgo(new Date(review.createdAt))}
            </p>
          </div>
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
