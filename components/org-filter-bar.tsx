"use client";

import { X, ChevronDown } from "lucide-react";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownClose,
} from "@/components/ui/dropdown";
import { formatEmploymentType } from "@/lib/org-display";
import { toggle } from "@/lib/org-sort";
import { SORT_OPTIONS } from "@/constants/org-content";
import type { Tab, Sort, Experience, OfferOutcome } from "@/types/org-content";

function jobTitleLabel(jobTitles: string[]): string {
  if (jobTitles.length === 0) return "Job Title";
  if (jobTitles.length === 1) return jobTitles[0];
  return `${jobTitles.length} titles`;
}

function empTypeLabel(empTypes: string[]): string {
  if (empTypes.length === 0) return "Type";
  if (empTypes.length === 1) return formatEmploymentType(empTypes[0]);
  return `${empTypes.length} types`;
}

function experienceLabel(experience: Experience[]): string {
  if (experience.length === 0) return "Experience";
  if (experience.length === 1) return experience[0];
  return `${experience.length} selected`;
}

function offerLabel(offerFilter: OfferOutcome[]): string {
  if (offerFilter.length === 0) return "Offer";
  if (offerFilter.length === 1) return `Offer: ${offerFilter[0]}`;
  return `${offerFilter.length} selected`;
}

interface OrgFilterBarProps {
  tab: Tab;
  sort: Sort;
  setSort: (s: Sort) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  empTypes: string[];
  setEmpTypes: React.Dispatch<React.SetStateAction<string[]>>;
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  offerFilter: OfferOutcome[];
  setOfferFilter: React.Dispatch<React.SetStateAction<OfferOutcome[]>>;
  jobTitles: string[];
  setJobTitles: React.Dispatch<React.SetStateAction<string[]>>;
  availableJobTitles: string[];
  availableEmpTypes: string[];
  activeFilterCount: number;
  resultCount: number;
  totalCount: number;
  clearFilters: () => void;
}

function SegBtn({
  active,
  first,
  last,
  children,
  ...props
}: {
  active?: boolean;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
        first ? "rounded-l-xl" : ""
      } ${last ? "rounded-r-xl" : ""} ${
        active ? "text-foreground" : "text-on-surface-variant hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ClearX({ onClear }: { onClear: () => void }) {
  return (
    <span
      role="button"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      className="text-on-surface-variant hover:text-foreground transition-colors"
    >
      <X size={10} />
    </span>
  );
}

export function OrgFilterBar({
  tab,
  sort,
  setSort,
  minRating,
  setMinRating,
  empTypes,
  setEmpTypes,
  experience,
  setExperience,
  offerFilter,
  setOfferFilter,
  jobTitles,
  setJobTitles,
  availableJobTitles,
  availableEmpTypes,
  activeFilterCount,
  resultCount,
  totalCount,
  clearFilters,
}: OrgFilterBarProps) {
  const currentSortLabel = SORT_OPTIONS[tab].find((o) => o.value === sort)?.label ?? "Sort";
  const showReviewFilters = tab !== "interviews";
  const showInterviewFilters = tab !== "reviews";

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="border-outline-variant/25 divide-outline-variant/20 bg-surface-container-lowest flex items-center divide-x overflow-hidden rounded-xl border shadow-sm">
        {/* Sort */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <SegBtn first>
              <span className="text-on-surface-variant">↕</span>
              {currentSortLabel}
              <ChevronDown size={10} className="text-on-surface-variant" />
            </SegBtn>
          </DropdownTrigger>
          <DropdownContent align="start" className="min-w-[160px] py-1">
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
          </DropdownContent>
        </DropdownRoot>

        {/* Job Title */}
        {availableJobTitles.length > 0 && (
          <DropdownRoot>
            <DropdownTrigger asChild>
              <SegBtn active={jobTitles.length > 0}>
                {jobTitleLabel(jobTitles)}
                {jobTitles.length > 0 ? (
                  <ClearX onClear={() => setJobTitles([])} />
                ) : (
                  <ChevronDown size={10} className="text-on-surface-variant" />
                )}
              </SegBtn>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-[190px] py-1">
              <div className="max-h-52 overflow-y-auto">
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
              </div>
            </DropdownContent>
          </DropdownRoot>
        )}

        {/* Min Rating — reviews + both */}
        {showReviewFilters && (
          <DropdownRoot>
            <DropdownTrigger asChild>
              <SegBtn active={minRating > 0}>
                {minRating > 0 ? `★ ${minRating}+` : "★ Rating"}
                {minRating > 0 ? (
                  <ClearX onClear={() => setMinRating(0)} />
                ) : (
                  <ChevronDown size={10} className="text-on-surface-variant" />
                )}
              </SegBtn>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-[130px] py-1">
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
            </DropdownContent>
          </DropdownRoot>
        )}

        {/* Emp Type — reviews + both */}
        {showReviewFilters && availableEmpTypes.length > 0 && (
          <DropdownRoot>
            <DropdownTrigger asChild>
              <SegBtn active={empTypes.length > 0} last={!showInterviewFilters}>
                {empTypeLabel(empTypes)}
                {empTypes.length > 0 ? (
                  <ClearX onClear={() => setEmpTypes([])} />
                ) : (
                  <ChevronDown size={10} className="text-on-surface-variant" />
                )}
              </SegBtn>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-[160px] py-1">
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
            </DropdownContent>
          </DropdownRoot>
        )}

        {/* Experience — interviews + both */}
        {showInterviewFilters && (
          <DropdownRoot>
            <DropdownTrigger asChild>
              <SegBtn active={experience.length > 0}>
                {experienceLabel(experience)}
                {experience.length > 0 ? (
                  <ClearX onClear={() => setExperience([])} />
                ) : (
                  <ChevronDown size={10} className="text-on-surface-variant" />
                )}
              </SegBtn>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-[150px] py-1">
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
            </DropdownContent>
          </DropdownRoot>
        )}

        {/* Offer — interviews + both */}
        {showInterviewFilters && (
          <DropdownRoot>
            <DropdownTrigger asChild>
              <SegBtn active={offerFilter.length > 0} last>
                {offerLabel(offerFilter)}
                {offerFilter.length > 0 ? (
                  <ClearX onClear={() => setOfferFilter([])} />
                ) : (
                  <ChevronDown size={10} className="text-on-surface-variant" />
                )}
              </SegBtn>
            </DropdownTrigger>
            <DropdownContent align="start" className="min-w-[170px] py-1">
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
            </DropdownContent>
          </DropdownRoot>
        )}
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-on-surface-variant hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          <X size={11} /> Clear
        </button>
      )}

      <span className="text-on-surface-variant ml-auto font-mono text-xs">
        {resultCount === totalCount ? `${totalCount} total` : `${resultCount} of ${totalCount}`}
      </span>
    </div>
  );
}
