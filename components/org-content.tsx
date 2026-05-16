"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { OrgProfile } from "@/lib/queries/orgs";
import type { Tab, Sort, Experience, OfferOutcome, BothItem } from "@/types/org-content";
import { sortReviews, sortInterviews } from "@/lib/org-sort";
import { ReviewCard } from "@/components/review-card";
import { InterviewCard } from "@/components/interview-card";
import { EmptyState } from "@/components/empty-state";
import { OrgFilterBar } from "@/components/org-filter-bar";

export function OrgContent({ data }: { data: OrgProfile }) {
  const { reviews, interviews } = data;

  const [tab, setTab] = useState<Tab>("reviews");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [empTypes, setEmpTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [offerFilter, setOfferFilter] = useState<OfferOutcome[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const reviewTitles = useMemo(
    () => [...new Set(reviews.map((r) => r.jobTitle))].sort(),
    [reviews],
  );
  const interviewTitles = useMemo(
    () => [...new Set(interviews.map((i) => i.roleTitle))].sort(),
    [interviews],
  );
  const availableJobTitles = useMemo(() => {
    if (tab === "reviews") return reviewTitles;
    if (tab === "interviews") return interviewTitles;
    return [...new Set([...reviewTitles, ...interviewTitles])].sort();
  }, [tab, reviewTitles, interviewTitles]);

  const availableEmpTypes = useMemo(
    () => [...new Set(reviews.map((r) => r.employmentType))].sort(),
    [reviews],
  );

  const handleSetTab = (newTab: Tab) => {
    let newSort = sort;
    if (newTab === "reviews" && (sort === "hardest" || sort === "easiest")) newSort = "recent";
    else if (newTab === "interviews" && (sort === "highest" || sort === "lowest"))
      newSort = "recent";
    else if (newTab === "both" && !["recent", "oldest"].includes(sort)) newSort = "recent";
    if (newTab === "both") {
      setMinRating(0);
      setEmpTypes([]);
      setExperience([]);
      setOfferFilter([]);
    }
    if (newTab !== "both") setJobTitles([]);
    setTab(newTab);
    if (newSort !== sort) setSort(newSort);
  };

  const clearFilters = () => {
    setMinRating(0);
    setEmpTypes([]);
    setExperience([]);
    setOfferFilter([]);
    setJobTitles([]);
  };

  const q = query.trim().toLowerCase();

  const filteredReviews = useMemo(() => {
    let items = reviews;
    if (q) items = items.filter((r) => r.jobTitle.toLowerCase().includes(q));
    if (minRating > 0) items = items.filter((r) => r.overallRating >= minRating);
    if (empTypes.length > 0) items = items.filter((r) => empTypes.includes(r.employmentType));
    if (jobTitles.length > 0) items = items.filter((r) => jobTitles.includes(r.jobTitle));
    return sortReviews(items, sort);
  }, [reviews, q, minRating, empTypes, jobTitles, sort]);

  const filteredInterviews = useMemo(() => {
    let items = interviews;
    if (q)
      items = items.filter(
        (i) =>
          i.roleTitle.toLowerCase().includes(q) ||
          (i.department?.toLowerCase().includes(q) ?? false),
      );
    if (experience.length > 0)
      items = items.filter((i) => experience.includes(i.overallExperience as Experience));
    if (offerFilter.length > 0)
      items = items.filter((i) => offerFilter.includes(i.offerReceived as OfferOutcome));
    if (jobTitles.length > 0) items = items.filter((i) => jobTitles.includes(i.roleTitle));
    return sortInterviews(items, sort);
  }, [interviews, q, experience, offerFilter, jobTitles, sort]);

  const bothItems = useMemo<BothItem[]>(() => {
    const combined: BothItem[] = [
      ...filteredReviews.map((r) => ({ ...r, _kind: "review" as const })),
      ...filteredInterviews.map((i) => ({ ...i, _kind: "interview" as const })),
    ];
    return combined.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [filteredReviews, filteredInterviews, sort]);

  const counts = {
    reviews: { result: filteredReviews.length, total: reviews.length },
    interviews: { result: filteredInterviews.length, total: interviews.length },
    both: { result: bothItems.length, total: reviews.length + interviews.length },
  } satisfies Record<Tab, { result: number; total: number }>;

  const activeFilterCount =
    (tab !== "interviews" ? (minRating > 0 ? 1 : 0) + empTypes.length : 0) +
    (tab !== "reviews" ? experience.length + offerFilter.length : 0) +
    jobTitles.length;

  const tabHeadings: Record<Tab, string> = {
    reviews: "Anonymous Feedback",
    interviews: "Interviews",
    both: "All Activity",
  };

  function renderFeed() {
    if (tab === "reviews") {
      if (filteredReviews.length === 0) return <EmptyState query={query} />;
      return (
        <div className="space-y-4">
          {filteredReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      );
    }
    if (tab === "interviews") {
      if (filteredInterviews.length === 0) return <EmptyState query={query} />;
      return (
        <div className="space-y-4">
          {filteredInterviews.map((i) => (
            <InterviewCard key={i.id} interview={i} />
          ))}
        </div>
      );
    }
    if (bothItems.length === 0) return <EmptyState query={query} />;
    return (
      <div className="space-y-4">
        {bothItems.map((item) =>
          item._kind === "review" ? (
            <ReviewCard key={`r-${item.id}`} review={item} showKind />
          ) : (
            <InterviewCard key={`i-${item.id}`} interview={item} showKind />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-8 md:px-12">
      <div className="relative mb-6">
        <Search
          size={16}
          className="text-on-surface-variant pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by job title, role, or department…"
          className="border-outline-variant/30 bg-surface-container-lowest placeholder:text-on-surface-variant/50 focus:border-primary w-full rounded-xl border py-3.5 pr-10 pl-11 text-sm transition-all outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-on-surface-variant hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="border-outline-variant/15 mb-8 flex gap-10 border-b">
        {[
          { value: "reviews" as Tab, label: "Reviews", count: reviews.length },
          { value: "both" as Tab, label: "Both", count: reviews.length + interviews.length },
          { value: "interviews" as Tab, label: "Interviews", count: interviews.length },
        ].map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => handleSetTab(value)}
            className={`-mb-px flex flex-col items-start border-b-2 pb-4 transition-all ${
              tab === value ? "border-foreground" : "border-transparent"
            }`}
          >
            <span
              className={`font-mono text-2xl leading-none font-bold tabular-nums transition-colors ${
                tab === value ? "text-foreground" : "text-outline-variant/40"
              }`}
            >
              {count}
            </span>
            <span
              className={`mt-1 text-[11px] font-semibold tracking-widest uppercase transition-colors ${
                tab === value ? "text-foreground" : "text-on-surface-variant"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <OrgFilterBar
        tab={tab}
        sort={sort}
        setSort={setSort}
        minRating={minRating}
        setMinRating={setMinRating}
        empTypes={empTypes}
        setEmpTypes={setEmpTypes}
        experience={experience}
        setExperience={setExperience}
        offerFilter={offerFilter}
        setOfferFilter={setOfferFilter}
        jobTitles={jobTitles}
        setJobTitles={setJobTitles}
        availableJobTitles={availableJobTitles}
        availableEmpTypes={availableEmpTypes}
        activeFilterCount={activeFilterCount}
        resultCount={counts[tab].result}
        totalCount={counts[tab].total}
        clearFilters={clearFilters}
      />

      <h2 className="mb-8 text-2xl font-bold tracking-tight">{tabHeadings[tab]}</h2>
      {renderFeed()}
    </div>
  );
}
