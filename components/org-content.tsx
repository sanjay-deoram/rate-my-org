"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import type { OrgProfile } from "@/lib/queries/orgs";
import type { Tab, Sort, Experience, OfferOutcome, BothItem } from "@/types/org-content";
import { SORT_OPTIONS } from "@/constants/org-content";
import { sortReviews, sortInterviews, toggle } from "@/lib/org-sort";
import { ReviewCard } from "@/components/review-card";
import { InterviewCard } from "@/components/interview-card";
import { EmptyState } from "@/components/empty-state";
import { formatEmploymentType } from "@/lib/org-display";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownClose,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";

// ─── Filter tag dropdown ────────────────────────────────────────────────────

function FilterTag({
  label,
  active,
  onClear,
  singleSelect = false,
  children,
}: {
  label: string;
  active?: boolean;
  onClear?: () => void;
  singleSelect?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
          }`}
        >
          {label}
          {active && onClear ? (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="hover:bg-primary-foreground/20 -mr-0.5 rounded-full p-0.5 transition-colors"
            >
              <X size={10} />
            </span>
          ) : (
            <ChevronDown
              size={11}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          )}
        </button>
      </DropdownTrigger>
      <DropdownContent align="start" className="min-w-[180px] py-1">
        {singleSelect ? children : <div className="max-h-52 overflow-y-auto py-0">{children}</div>}
      </DropdownContent>
    </DropdownRoot>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

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

  // Unique job titles per source, sorted alphabetically
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
    // Clear job titles that don't exist in the new tab's data
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

  const resultCount = (
    {
      reviews: filteredReviews.length,
      interviews: filteredInterviews.length,
      both: bothItems.length,
    } satisfies Record<Tab, number>
  )[tab];

  const totalCount = (
    {
      reviews: reviews.length,
      interviews: interviews.length,
      both: reviews.length + interviews.length,
    } satisfies Record<Tab, number>
  )[tab];

  const activeFilterCount =
    (tab !== "interviews" ? (minRating > 0 ? 1 : 0) + empTypes.length : 0) +
    (tab !== "reviews" ? experience.length + offerFilter.length : 0) +
    jobTitles.length;

  const currentSortLabel = SORT_OPTIONS[tab].find((o) => o.value === sort)?.label ?? "Sort";

  // Job title tag label
  const jobTitleLabel =
    jobTitles.length === 0
      ? "Job Title"
      : jobTitles.length === 1
        ? jobTitles[0]
        : `${jobTitles.length} titles`;

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
      {/* Search */}
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

      {/* Underline tabs */}
      <div className="border-outline-variant/15 mb-5 border-b">
        <div className="flex gap-7">
          {[
            { value: "reviews" as Tab, label: "Reviews", count: reviews.length },
            { value: "both" as Tab, label: "Both", count: reviews.length + interviews.length },
            { value: "interviews" as Tab, label: "Interviews", count: interviews.length },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => handleSetTab(value)}
              className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold tracking-tight transition-all ${
                tab === value
                  ? "border-foreground text-foreground"
                  : "text-on-surface-variant hover:text-foreground border-transparent"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                  tab === value
                    ? "bg-foreground text-background"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter tag bar */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {/* Sort — single-select, closes on pick */}
        <FilterTag label={currentSortLabel} singleSelect>
          {SORT_OPTIONS[tab].map(({ value, label }) => (
            <DropdownClose key={value} asChild>
              <DropdownItem
                className="text-xs"
                active={sort === value}
                onClick={() => setSort(value)}
              >
                {label}
              </DropdownItem>
            </DropdownClose>
          ))}
        </FilterTag>

        {/* Job Title — multi-select, stays open */}
        {availableJobTitles.length > 0 && (
          <FilterTag
            label={jobTitleLabel}
            active={jobTitles.length > 0}
            onClear={() => setJobTitles([])}
          >
            {availableJobTitles.map((title) => (
              <DropdownItem
                key={title}
                className="text-xs"
                active={jobTitles.includes(title)}
                onClick={() => setJobTitles((prev) => toggle(prev, title))}
              >
                {title}
              </DropdownItem>
            ))}
          </FilterTag>
        )}

        {/* Min Rating — single-select, closes on pick */}
        {tab !== "interviews" && (
          <FilterTag
            label={minRating > 0 ? `${minRating}+ stars` : "Min Rating"}
            active={minRating > 0}
            onClear={() => setMinRating(0)}
            singleSelect
          >
            {[
              { value: 0, label: "Any rating" },
              { value: 4, label: "4+ stars" },
              { value: 3, label: "3+ stars" },
              { value: 2, label: "2+ stars" },
            ].map(({ value, label }) => (
              <DropdownClose key={value} asChild>
                <DropdownItem
                  className="text-xs"
                  active={minRating === value}
                  onClick={() => setMinRating(value)}
                >
                  {label}
                </DropdownItem>
              </DropdownClose>
            ))}
          </FilterTag>
        )}

        {/* Emp Type — multi-select, stays open */}
        {tab !== "interviews" && availableEmpTypes.length > 0 && (
          <FilterTag
            label={
              empTypes.length === 0
                ? "Emp. Type"
                : empTypes.length === 1
                  ? formatEmploymentType(empTypes[0])
                  : `${empTypes.length} types`
            }
            active={empTypes.length > 0}
            onClear={() => setEmpTypes([])}
          >
            {availableEmpTypes.map((type) => (
              <DropdownItem
                key={type}
                className="text-xs"
                active={empTypes.includes(type)}
                onClick={() => setEmpTypes((prev) => toggle(prev, type))}
              >
                {formatEmploymentType(type)}
              </DropdownItem>
            ))}
          </FilterTag>
        )}

        {/* Experience — multi-select, stays open */}
        {tab !== "reviews" && (
          <FilterTag
            label={
              experience.length === 0
                ? "Experience"
                : experience.length === 1
                  ? experience[0]
                  : `${experience.length} selected`
            }
            active={experience.length > 0}
            onClear={() => setExperience([])}
          >
            {(["Great", "Neutral", "Negative"] as Experience[]).map((exp) => (
              <DropdownItem
                key={exp}
                className="text-xs"
                active={experience.includes(exp)}
                onClick={() => setExperience((prev) => toggle(prev, exp))}
              >
                {exp}
              </DropdownItem>
            ))}
          </FilterTag>
        )}

        {/* Offer — multi-select, stays open */}
        {tab !== "reviews" && (
          <FilterTag
            label={
              offerFilter.length === 0
                ? "Offer"
                : offerFilter.length === 1
                  ? `Offer: ${offerFilter[0]}`
                  : `${offerFilter.length} selected`
            }
            active={offerFilter.length > 0}
            onClear={() => setOfferFilter([])}
          >
            {(["Yes", "No", "Yes but Declined"] as OfferOutcome[]).map((offer) => (
              <DropdownItem
                key={offer}
                className="text-xs"
                active={offerFilter.includes(offer)}
                onClick={() => setOfferFilter((prev) => toggle(prev, offer))}
              >
                {offer}
              </DropdownItem>
            ))}
          </FilterTag>
        )}

        {/* Clear all — only when filters active */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-on-surface-variant hover:text-foreground hover:bg-surface-container flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <X size={11} />
            Clear all
          </button>
        )}

        <span className="text-on-surface-variant ml-auto font-mono text-xs">
          {resultCount === totalCount ? `${totalCount} total` : `${resultCount} of ${totalCount}`}
        </span>
      </div>

      <h2 className="mb-8 text-2xl font-bold tracking-tight">
        {tab === "reviews"
          ? "Anonymous Feedback"
          : tab === "interviews"
            ? "Interview Reports"
            : "All Activity"}
      </h2>
      {renderFeed()}
    </div>
  );
}
