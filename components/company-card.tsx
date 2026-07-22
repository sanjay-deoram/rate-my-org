import Link from "next/link";
import type { CompanySuggestion } from "@/types/review";
import { StarRatingDisplay } from "@/components/star-rating-display";

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      aria-label={`${label}: ${value}`}
      className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3"
    >
      <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">
        {label}
      </span>
      <span
        className={`text-lg font-black tabular-nums ${
          highlight ? "text-tertiary-fixed-dim" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function CompanyCard({ company }: { company: CompanySuggestion }) {
  const rating = company.avgRating;
  const ratingHigh = rating !== null && rating >= 4;

  return (
    <Link
      href={`/orgs/${company.slug}`}
      className="focus-visible:ring-ring/30 focus-visible:ring-offset-background border-outline-variant bg-surface-container-lowest group hover:border-foreground block overflow-hidden rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex flex-col md:flex-row">
        <div className="group-hover:bg-surface-container-low flex min-w-0 flex-1 items-center gap-3 p-4 transition-colors duration-200 md:gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt=""
              className="bg-surface-container h-10 w-10 shrink-0 rounded-md object-contain p-1 md:h-12 md:w-12"
            />
          ) : (
            <div className="bg-surface-container text-on-surface-variant flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-base font-black md:h-12 md:w-12 md:text-lg">
              {company.name[0]}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-foreground truncate text-base font-black tracking-tight md:text-lg">
              {company.name}
            </h3>
            <p className="text-on-surface-variant truncate font-mono text-[10px] tracking-widest uppercase">
              {company.slug}
            </p>
            <StarRatingDisplay rating={rating} className="mt-2" />
          </div>
        </div>

        <div className="border-outline-variant flex border-t border-dashed md:w-[40%] md:border-t-0 md:border-l">
          <Stat label="Rating" value={rating ?? "—"} highlight={ratingHigh} />
          <div className="bg-outline-variant w-px" />
          <Stat label="Reviews" value={company.reviewCount} />
          <div className="bg-outline-variant w-px" />
          <Stat label="Interviews" value={company.interviewCount} />
        </div>
      </div>
    </Link>
  );
}
