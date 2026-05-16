"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { OrgProfile } from "@/lib/queries/orgs";
import type { Tab, Sort, Experience, OfferOutcome, BothItem } from "@/types/org-content";
import { SORT_OPTIONS } from "@/constants/org-content";
import { sortReviews, sortInterviews, toggle } from "@/lib/org-sort";
import { useDropdown } from "@/hooks/use-dropdown";
import { ReviewCard } from "@/components/review-card";
import { InterviewCard } from "@/components/interview-card";
import { EmptyState } from "@/components/empty-state";
import { formatEmploymentType } from "@/lib/org-display";

export function OrgContent({ data }: { data: OrgProfile }) {
  const { reviews, interviews } = data;

  const [tab, setTab] = useState<Tab>("reviews");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [empTypes, setEmpTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [offerFilter, setOfferFilter] = useState<OfferOutcome[]>([]);

  const { open: sortOpen, setOpen: setSortOpen, ref: sortRef } = useDropdown();
  const { open: filterOpen, setOpen: setFilterOpen, ref: filterRef } = useDropdown();

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
    setTab(newTab);
    if (newSort !== sort) setSort(newSort);
  };

  const q = query.trim().toLowerCase();

  const filteredReviews = useMemo(() => {
    let items = reviews;
    if (q) items = items.filter((r) => r.jobTitle.toLowerCase().includes(q));
    if (minRating > 0) items = items.filter((r) => r.overallRating >= minRating);
    if (empTypes.length > 0) items = items.filter((r) => empTypes.includes(r.employmentType));
    return sortReviews(items, sort);
  }, [reviews, q, minRating, empTypes, sort]);

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
    return sortInterviews(items, sort);
  }, [interviews, q, experience, offerFilter, sort]);

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

  const resultCount =
    tab === "reviews"
      ? filteredReviews.length
      : tab === "interviews"
        ? filteredInterviews.length
        : bothItems.length;

  const totalCount =
    tab === "reviews"
      ? reviews.length
      : tab === "interviews"
        ? interviews.length
        : reviews.length + interviews.length;

  const activeFilterCount =
    (tab === "reviews" ? (minRating > 0 ? 1 : 0) + empTypes.length : 0) +
    (tab === "interviews" ? experience.length + offerFilter.length : 0);

  const currentSortLabel = SORT_OPTIONS[tab].find((o) => o.value === sort)?.label ?? "Sort";

  const clearFilters = () => {
    setMinRating(0);
    setEmpTypes([]);
    setExperience([]);
    setOfferFilter([]);
  };

  const feedTitle =
    tab === "reviews"
      ? "Anonymous Feedback"
      : tab === "interviews"
        ? "Interview Reports"
        : "All Activity";

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

      {/* Controls row */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Tab pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "reviews", label: "Reviews", count: reviews.length },
              { value: "both", label: "Both", count: reviews.length + interviews.length },
              { value: "interviews", label: "Interviews", count: interviews.length },
            ] as const
          ).map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => handleSetTab(value)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                tab === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-foreground"
              }`}
            >
              {label}
              <span
                className={`font-mono text-xs ${tab === value ? "text-primary-foreground/70" : "text-on-surface-variant"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setSortOpen(!sortOpen);
                setFilterOpen(false);
              }}
              className="border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors"
            >
              {currentSortLabel}
              <ChevronDown
                size={14}
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            {sortOpen && (
              <div className="border-outline-variant/20 bg-surface-container-lowest absolute top-full right-0 z-20 mt-1.5 min-w-[160px] rounded-xl border py-1 shadow-lg">
                {SORT_OPTIONS[tab].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSort(value);
                      setSortOpen(false);
                    }}
                    className={`hover:bg-surface-container-low flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                      sort === value ? "text-foreground font-medium" : "text-on-surface-variant"
                    }`}
                  >
                    {label}
                    {sort === value && (
                      <span className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setFilterOpen(!filterOpen);
                setSortOpen(false);
              }}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                activeFilterCount > 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary-foreground text-primary flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {filterOpen && (
              <div className="border-outline-variant/20 bg-surface-container-lowest absolute top-full left-0 z-20 mt-1.5 w-72 rounded-xl border p-5 shadow-lg sm:right-0 sm:left-auto">
                {activeFilterCount > 0 && (
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">
                      {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                    </span>
                    <button
                      onClick={clearFilters}
                      className="bg-surface-container text-on-surface-variant hover:bg-destructive flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-medium tracking-widest uppercase transition-colors hover:text-white"
                    >
                      <X size={10} />
                      Clear
                    </button>
                  </div>
                )}

                {tab === "reviews" && (
                  <>
                    <p className="text-on-surface-variant mb-2 font-mono text-[10px] tracking-widest uppercase">
                      Min Rating
                    </p>
                    <div className="mb-4 flex gap-1.5">
                      {(
                        [
                          { value: 0, label: "Any" },
                          { value: 4, label: "4+" },
                          { value: 3, label: "3+" },
                          { value: 2, label: "2+" },
                        ] as const
                      ).map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setMinRating(value)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            minRating === value
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {availableEmpTypes.length > 0 && (
                      <>
                        <p className="text-on-surface-variant mb-2 font-mono text-[10px] tracking-widest uppercase">
                          Employment Type
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {availableEmpTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setEmpTypes((prev) => toggle(prev, type))}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                empTypes.includes(type)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                              }`}
                            >
                              {formatEmploymentType(type)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {tab === "interviews" && (
                  <>
                    <p className="text-on-surface-variant mb-2 font-mono text-[10px] tracking-widest uppercase">
                      Experience
                    </p>
                    <div className="mb-4 flex gap-1.5">
                      {(["Great", "Neutral", "Negative"] as Experience[]).map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExperience((prev) => toggle(prev, exp))}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            experience.includes(exp)
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>

                    <p className="text-on-surface-variant mb-2 font-mono text-[10px] tracking-widest uppercase">
                      Offer Received
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(["Yes", "No", "Yes but Declined"] as OfferOutcome[]).map((offer) => (
                        <button
                          key={offer}
                          onClick={() => setOfferFilter((prev) => toggle(prev, offer))}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            offerFilter.includes(offer)
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                        >
                          {offer}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {tab === "both" && (
                  <p className="text-on-surface-variant text-sm">
                    Switch to Reviews or Interviews to apply filters.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Result count */}
          <span className="text-on-surface-variant font-mono text-xs">
            {resultCount === totalCount ? `${totalCount} total` : `${resultCount} of ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Feed header */}
      <h2 className="mb-8 text-2xl font-bold tracking-tight">{feedTitle}</h2>

      {/* Feed */}
      {tab === "reviews" ? (
        filteredReviews.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="space-y-12">
            {filteredReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )
      ) : tab === "interviews" ? (
        filteredInterviews.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="space-y-12">
            {filteredInterviews.map((i) => (
              <InterviewCard key={i.id} interview={i} />
            ))}
          </div>
        )
      ) : bothItems.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="space-y-12">
          {bothItems.map((item) =>
            item._kind === "review" ? (
              <ReviewCard key={`r-${item.id}`} review={item} showKind />
            ) : (
              <InterviewCard key={`i-${item.id}`} interview={item} showKind />
            ),
          )}
        </div>
      )}
    </div>
  );
}
