import type { Tab, Sort } from "@/types/org-content";

export const SORT_OPTIONS: Record<Tab, { value: Sort; label: string }[]> = {
  reviews: [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Rating" },
    { value: "lowest", label: "Lowest Rating" },
  ],
  interviews: [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "hardest", label: "Most Difficult" },
    { value: "easiest", label: "Easiest" },
  ],
  both: [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
  ],
};

export const EXPERIENCE_BADGE: Record<string, string> = {
  Great: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
  Neutral: "bg-surface-container-high text-on-surface-variant",
  Negative: "bg-destructive text-white",
};
