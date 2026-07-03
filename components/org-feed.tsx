"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import type { OrgProfile } from "@/lib/queries/orgs";
import { difficultyLabel } from "@/lib/org-display";

type Review = OrgProfile["reviews"][number];
type Interview = OrgProfile["interviews"][number];

type Tab = "reviews" | "interviews";
type Sort = "recent" | "oldest";

function formatEmploymentType(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold">{review.jobTitle}</h3>
          <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            {review.jobTitle} • {formatEmploymentType(review.employmentType)} •{" "}
            {timeAgo(new Date(review.createdAt))}
          </p>
        </div>
        <div className="bg-primary text-primary-foreground ml-4 flex shrink-0 items-center gap-1 rounded px-3 py-1">
          <span className="text-sm font-bold">{review.overallRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
              <PlusCircle size={16} className="text-tertiary-fixed-dim" /> Pros
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">{review.pros}</p>
          </div>
          <div>
            <h4 className="text-on-surface-variant mb-3 flex items-center gap-2 text-xs font-black tracking-widest uppercase">
              <MinusCircle size={16} /> Cons
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">{review.cons}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

const EXPERIENCE_BADGE: Record<string, string> = {
  Great: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
  Neutral: "bg-surface-container-high text-on-surface-variant",
  Negative: "bg-destructive text-white",
};

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold">{interview.roleTitle}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {interview.department && (
              <>
                <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                  {interview.department}
                </span>
                <span className="text-outline-variant font-mono text-sm">·</span>
              </>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase ${EXPERIENCE_BADGE[interview.overallExperience] ?? "bg-surface-container-high text-on-surface-variant"}`}
            >
              {interview.overallExperience}
            </span>
            <span className="text-outline-variant font-mono text-sm">·</span>
            <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
              {timeAgo(new Date(interview.createdAt))}
            </span>
          </div>
        </div>
        <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
          <div className="bg-surface-container-high rounded px-3 py-1">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              {difficultyLabel(interview.difficulty)}
            </span>
          </div>
          <span className="text-on-surface-variant font-mono text-xs">
            Offer: {interview.offerReceived}
          </span>
        </div>
      </div>

      <div className="mb-5 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full ${i <= interview.difficulty ? "bg-primary" : "bg-surface-container-highest"}`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {interview.rounds.map((round, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center pt-0.5">
              <div className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold">
                {idx + 1}
              </div>
              {idx < interview.rounds.length - 1 && (
                <div className="bg-outline-variant/20 my-1 w-px flex-1" style={{ minHeight: 16 }} />
              )}
            </div>
            <div className="flex-1 pb-3">
              <span className="border-foreground/20 text-foreground mb-1.5 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                {round.type}
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed">{round.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

interface OrgFeedProps {
  reviews: Review[];
  interviews: Interview[];
}

export function OrgFeed({ reviews, interviews }: OrgFeedProps) {
  const [tab, setTab] = useState<Tab>("reviews");
  const [sort, setSort] = useState<Sort>("recent");

  const sorted = <T extends { createdAt: Date | string }>(items: T[]): T[] =>
    [...items].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "recent" ? -diff : diff;
    });

  const activeReviews = sorted(reviews);
  const activeInterviews = sorted(interviews);
  const isEmpty = tab === "reviews" ? activeReviews.length === 0 : activeInterviews.length === 0;

  return (
    <div className="lg:col-span-8">
      {/* Header with tab + sort controls */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-surface-container-high flex gap-1 rounded-lg p-1">
          {(["reviews", "interviews"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-5 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {t === "reviews"
                ? `Reviews${reviews.length > 0 ? ` (${reviews.length})` : ""}`
                : `Interviews${interviews.length > 0 ? ` (${interviews.length})` : ""}`}
            </button>
          ))}
        </div>

        <div className="bg-surface-container-high flex gap-1 rounded-lg p-1">
          {(["recent", "oldest"] as Sort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-md px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-all ${
                sort === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {s === "recent" ? "Recent" : "Oldest"}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <p className="text-on-surface-variant text-sm">No {tab} yet. Be the first to share!</p>
      ) : (
        <div className="space-y-12">
          {tab === "reviews"
            ? activeReviews.map((r) => <ReviewCard key={r.id} review={r} />)
            : activeInterviews.map((i) => <InterviewCard key={i.id} interview={i} />)}
        </div>
      )}
    </div>
  );
}
