import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { RatingTrend } from "@/types/homepage";
import type { LeaderboardEntry } from "@/types/workspace-scene";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

function fmtRating(raw: string | null): string | null {
  if (!raw) return null;
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return null;
  return (Math.round(n * 10) / 10).toFixed(1);
}

function ratingColor(avgRating: string | null): string {
  if (!avgRating) return "";
  return parseFloat(avgRating) >= 2.5 ? "text-token-green-deep" : "text-destructive";
}

function TrendIcon({ trend, className }: { trend: RatingTrend; className?: string }) {
  if (trend === "up") return <TrendingUp size={13} className={className} />;
  if (trend === "down") return <TrendingDown size={13} className={className} />;
  return null;
}

export function TopRatedCard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="border-border overflow-hidden rounded-xl border bg-white">
      <div className="bg-ink flex items-center justify-between px-5 py-4 text-white">
        <span className="text-xs font-bold">Top rated organizations</span>
        <span className="text-xs font-bold text-white/60">Score</span>
      </div>

      {leaderboard.length === 0 ? (
        <p className="text-on-surface-variant px-5 py-8 text-sm">No rated companies yet.</p>
      ) : (
        <div>
          {leaderboard.map((company, i) => {
            const logoSrc = company.logoKey && CDN ? `${CDN}/${company.logoKey}` : null;
            const rating = fmtRating(company.avgRating);

            return (
              <Link
                key={company.slug}
                href={`/orgs/${company.slug}`}
                className="group border-border hover:bg-token-lime/35 flex min-h-20 items-center gap-4 border-b px-5 py-4 transition last:border-b-0"
              >
                <span className="text-on-surface-variant w-6 shrink-0 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="bg-paper-soft flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-base font-black">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{company.name}</p>
                  <p className="text-on-surface-variant truncate text-xs">
                    {company.industry ?? "Organization profile"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {rating ? (
                    <>
                      <TrendIcon
                        trend={company.ratingTrend}
                        className={ratingColor(company.avgRating)}
                      />
                      <span className={`font-black tabular-nums ${ratingColor(company.avgRating)}`}>
                        {rating}
                      </span>
                    </>
                  ) : (
                    <span className="text-on-surface-variant text-xs">New</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
