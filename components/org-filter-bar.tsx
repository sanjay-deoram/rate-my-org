"use client";

import { X } from "lucide-react";
import { FilterTag } from "@/components/filter-tag";
import { DropdownClose, DropdownItem } from "@/components/ui/dropdown";
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
  if (empTypes.length === 0) return "Emp. Type";
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

  return (
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
          label={jobTitleLabel(jobTitles)}
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
          label={empTypeLabel(empTypes)}
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
          label={experienceLabel(experience)}
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
          label={offerLabel(offerFilter)}
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
  );
}
