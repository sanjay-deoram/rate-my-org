"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";
import type { OrgProfile } from "@/lib/queries/orgs";
import type { Tab, Sort, Experience, OfferOutcome, BothItem } from "@/types/org-content";
import { sortReviews, sortInterviews } from "@/lib/org-sort";
import { ReviewCard } from "@/components/review-card";
import { InterviewCard } from "@/components/interview-card";
import { EmptyState } from "@/components/empty-state";
import { OrgFilterBar } from "@/components/org-filter-bar";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

function ShareFab({ company }: { company: OrgProfile["company"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.4 }}
      className="fixed right-4 bottom-4 z-50 flex flex-col-reverse items-end gap-2 sm:right-8 sm:bottom-8 sm:gap-2.5"
    >
      <Link
        href={`/reviews/write?company=${company.slug}`}
        className="bg-token-blue flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl transition-opacity duration-200 hover:opacity-90 active:scale-[0.98] sm:px-5 sm:py-3.5"
      >
        <MessageSquare size={15} />
        Write a Review
      </Link>
      <Link
        href={`/interviews/submit?company=${company.slug}`}
        className="border-border bg-card hover:border-primary text-foreground flex items-center gap-2.5 rounded-full border py-2 pr-4 pl-3.5 text-sm font-bold shadow-lg transition-colors active:scale-[0.98] sm:py-2.5 sm:pr-5 sm:pl-4"
      >
        <BookOpen size={15} />
        Submit Interview
      </Link>
    </motion.div>
  );
}

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
        <Stagger key="reviews" className="space-y-3 sm:space-y-4">
          {filteredReviews.map((r) => (
            <StaggerItem key={r.id}>
              <ReviewCard review={r} />
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    if (tab === "interviews") {
      if (filteredInterviews.length === 0) return <EmptyState query={query} />;
      return (
        <Stagger key="interviews" className="space-y-3 sm:space-y-4">
          {filteredInterviews.map((i) => (
            <StaggerItem key={i.id}>
              <InterviewCard interview={i} />
            </StaggerItem>
          ))}
        </Stagger>
      );
    }
    if (bothItems.length === 0) return <EmptyState query={query} />;
    return (
      <Stagger key="both" className="space-y-3 sm:space-y-4">
        {bothItems.map((item) => (
          <StaggerItem key={item._kind === "review" ? `r-${item.id}` : `i-${item.id}`}>
            {item._kind === "review" ? (
              <ReviewCard review={item} showKind />
            ) : (
              <InterviewCard interview={item} showKind />
            )}
          </StaggerItem>
        ))}
      </Stagger>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-12">
      <div className="border-border bg-surface-container-lowest focus-within:ring-ring mb-4 flex items-center rounded-full border px-4 py-2.5 shadow-[0_20px_60px_rgba(5,8,7,0.08)] focus-within:ring-2 sm:mb-6 sm:px-5 sm:py-3">
        <Search size={18} className="text-on-surface-variant pointer-events-none shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by job title, role, or department…"
          aria-label="Search reviews and interviews"
          className="placeholder:text-on-surface-variant ml-3 min-w-0 flex-1 bg-transparent py-2 text-base font-semibold outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-on-surface-variant hover:text-foreground shrink-0 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="scrollbar-design border-outline-variant/15 mb-5 flex gap-5 overflow-x-auto border-b sm:mb-8 sm:gap-8">
        {[
          { value: "reviews" as Tab, label: "Reviews", count: reviews.length },
          { value: "both" as Tab, label: "Both", count: reviews.length + interviews.length },
          { value: "interviews" as Tab, label: "Interviews", count: interviews.length },
        ].map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => handleSetTab(value)}
            className="relative -mb-px flex shrink-0 flex-col items-start pb-3 sm:pb-4"
          >
            {tab === value && (
              <motion.div
                layoutId="org-tab-underline"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className="bg-foreground absolute inset-x-0 bottom-0 h-0.5"
              />
            )}
            <span
              className={`font-mono text-xl leading-none font-bold tabular-nums transition-colors sm:text-2xl ${
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

      <h2 className="mb-5 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">
        {tabHeadings[tab]}
      </h2>
      {renderFeed()}

      <ShareFab company={data.company} />
    </div>
  );
}
