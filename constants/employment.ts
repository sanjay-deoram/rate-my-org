export const EMPLOYMENT_TYPE_VALUES = [
  "full_time",
  "part_time",
  "temporary",
  "contract",
  "seasonal",
  "self_employed",
  "per_diem",
  "reserve",
  "freelance",
  "apprenticeship",
] as const;

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPE_VALUES)[number];

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentTypeValue; label: string }[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "temporary", label: "Temporary" },
  { value: "contract", label: "Contract" },
  { value: "seasonal", label: "Seasonal" },
  { value: "self_employed", label: "Self Employed" },
  { value: "per_diem", label: "Per Diem" },
  { value: "reserve", label: "Reserve" },
  { value: "freelance", label: "Freelance" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "current_employee" as const, label: "Current Employee" },
  { value: "former_employee" as const, label: "Former Employee" },
];

export type EmploymentStatusValue = (typeof EMPLOYMENT_STATUS_OPTIONS)[number]["value"];

export const CURRENT_YEAR = new Date().getFullYear();
export const FORMER_YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
