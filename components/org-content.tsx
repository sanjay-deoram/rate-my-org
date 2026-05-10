"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle, Check, BadgeCheck } from "lucide-react";
import type { OrgProfile } from "@/lib/queries/orgs";
import {
  difficultyLabel,
  formatEmploymentType,
  sortItemsByCreatedAt,
  timeAgo,
} from "@/lib/org-display";

type Review = OrgProfile["reviews"][number];
type Interview = OrgProfile["interviews"][number];
type Tab = "reviews" | "interviews";
type Sort = "recent" | "oldest";

function RadioRow({
  checked,
  label,
  count,
  onClick,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 py-2 text-left"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
            checked
              ? "bg-primary border-primary"
              : "border-outline-variant/40 bg-surface-container-low"
          }`}
        >
          {checked && <Check size={10} strokeWidth={3} className="text-primary-foreground" />}
        </div>
        <span
          className={`text-sm font-medium ${checked ? "text-foreground" : "text-on-surface-variant"}`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-on-surface-variant font-mono text-xs">{count}</span>
      )}
    </button>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold">{review.jobTitle}</h3>
          <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            {formatEmploymentType(review.employmentType)} • {timeAgo(new Date(review.createdAt))}
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
    </article>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold">{interview.roleTitle}</h3>
          <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
            {interview.department ? `${interview.department} • ` : ""}
            {interview.overallExperience} Experience • {timeAgo(new Date(interview.createdAt))}
          </p>
        </div>
        <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
          <div className="bg-surface-container-high rounded px-3 py-1">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              {difficultyLabel(interview.difficulty)}
            </span>
          </div>
          <span className="text-on-surface-variant font-mono text-xs"></span>
          <div className="flex items-center gap-2 rounded-full bg-[#d1fadf] px-3 py-1 text-[#00632d]">
            <BadgeCheck size={14} className="fill-current" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Offer: {interview.offerReceived}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${
                i <= interview.difficulty ? "bg-primary" : "bg-surface-container-highest"
              }`}
            />
          ))}
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
          {interview.description}
        </p>
      </div>
    </article>
  );
}

export function OrgContent({ data }: { data: OrgProfile }) {
  const { company, stats, reviews, interviews } = data;

  const [tab, setTab] = useState<Tab>("reviews");
  const [sort, setSort] = useState<Sort>("recent");

  const activeItems =
    tab === "reviews"
      ? sortItemsByCreatedAt(reviews, sort)
      : sortItemsByCreatedAt(interviews, sort);

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 md:px-12 lg:grid-cols-12">
      {/* Left sidebar */}
      <div className="space-y-6 lg:col-span-4">
        {/* Interview Difficulty */}
        <div className="bg-surface-container-lowest border-outline-variant/10 rounded-xl border p-8 shadow-sm">
          <h3 className="mb-4 font-bold">Interview Difficulty</h3>
          {stats.interviewCount > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <span className="font-mono text-4xl font-black">{stats.avgDifficultyLabel}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded-full ${
                        i <= stats.avgDifficultyLevel
                          ? "bg-primary"
                          : "bg-surface-container-highest"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">
                Based on {stats.interviewCount} interview
                {stats.interviewCount !== 1 ? "s" : ""} submitted by candidates.
              </p>
            </>
          ) : (
            <p className="text-on-surface-variant text-sm">No interview reports yet.</p>
          )}
        </div>

        {/* Filter controls */}
        <div className="bg-surface-container-lowest border-outline-variant/10 rounded-xl border p-8 shadow-sm">
          <h3 className="mb-5 font-bold">Filter</h3>

          <div className="space-y-1">
            <p className="text-on-surface-variant mb-2 font-mono text-xs tracking-widest uppercase">
              Content
            </p>
            <RadioRow
              checked={tab === "reviews"}
              label="Reviews"
              count={reviews.length}
              onClick={() => setTab("reviews")}
            />
            <RadioRow
              checked={tab === "interviews"}
              label="Interviews"
              count={interviews.length}
              onClick={() => setTab("interviews")}
            />
          </div>

          <div className="border-outline-variant/20 mt-6 space-y-1 border-t pt-6">
            <p className="text-on-surface-variant mb-2 font-mono text-xs tracking-widest uppercase">
              Sort By
            </p>
            <RadioRow
              checked={sort === "recent"}
              label="Most Recent"
              onClick={() => setSort("recent")}
            />
            <RadioRow
              checked={sort === "oldest"}
              label="Oldest First"
              onClick={() => setSort("oldest")}
            />
          </div>
        </div>

        {/* About */}
        {(company.headquarters || company.size || company.founded || company.industry) && (
          <div className="bg-surface-container-lowest border-outline-variant/10 rounded-xl border p-8 shadow-sm">
            <h3 className="mb-4 font-bold">About</h3>
            <dl className="space-y-3 text-sm">
              {company.headquarters && (
                <div>
                  <dt className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                    HQ
                  </dt>
                  <dd className="mt-1">{company.headquarters}</dd>
                </div>
              )}
              {company.size && (
                <div>
                  <dt className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                    Size
                  </dt>
                  <dd className="mt-1">{company.size} employees</dd>
                </div>
              )}
              {company.founded && (
                <div>
                  <dt className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                    Founded
                  </dt>
                  <dd className="mt-1">{company.founded}</dd>
                </div>
              )}
              {company.industry && (
                <div>
                  <dt className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                    Industry
                  </dt>
                  <dd className="mt-1">{company.industry}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* Right: feed */}
      <div className="lg:col-span-8">
        <h2 className="mb-10 text-2xl font-bold tracking-tight">
          {tab === "reviews" ? "Anonymous Feedback" : "Interview Reports"}
        </h2>

        {activeItems.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No {tab} yet. Be the first to share!</p>
        ) : (
          <div className="space-y-12">
            {tab === "reviews"
              ? (activeItems as Review[]).map((r) => <ReviewCard key={r.id} review={r} />)
              : (activeItems as Interview[]).map((i) => <InterviewCard key={i.id} interview={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
