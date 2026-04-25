"use client";

import { useState, useRef } from "react";
import { Search, ShieldCheck, Lock, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPLOYMENT_TYPES = [
  ["full_time", "Full Time"],
  ["part_time", "Part Time"],
  ["temporary", "Temporary"],
  ["contract", "Contract"],
  ["seasonal", "Seasonal"],
  ["self_employed", "Self Employed"],
  ["per_diem", "Per Diem"],
  ["reserve", "Reserve"],
  ["freelance", "Freelance"],
  ["apprenticeship", "Apprenticeship"],
] as const;

const EMPLOYMENT_STATUSES = [
  { value: "current_employee" as const, label: "Current Employee" },
  { value: "former_employee" as const, label: "Former Employee" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

type CompanySuggestion = { slug: string; name: string; logoUrl: string | null };

interface ReviewFormState {
  companySlug: string;
  companyName: string;
  companyLogoUrl: string | null;
  overallRating: number;
  employmentStatus: "current_employee" | "former_employee" | "";
  formerYear: number | null;
  employmentType: string;
  jobTitle: string;
  headline: string;
  pros: string;
  cons: string;
  adviceToManagement: string;
}

type FormErrors = Partial<Record<keyof ReviewFormState, string>>;

const INITIAL_STATE: ReviewFormState = {
  companySlug: "",
  companyName: "",
  companyLogoUrl: null,
  overallRating: 0,
  employmentStatus: "",
  formerYear: null,
  employmentType: "",
  jobTitle: "",
  headline: "",
  pros: "",
  cons: "",
  adviceToManagement: "",
};

function validate(form: ReviewFormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.companySlug) errs.companySlug = "Select a company";
  if (form.overallRating === 0) errs.overallRating = "Select a rating";
  if (!form.employmentStatus) errs.employmentStatus = "Select your employment status";
  if (form.employmentStatus === "former_employee" && !form.formerYear)
    errs.formerYear = "Select the year you left";
  if (!form.employmentType) errs.employmentType = "Select employment type";
  if (!form.jobTitle.trim()) errs.jobTitle = "Job title is required";
  if (!form.headline.trim()) errs.headline = "Headline is required";
  if (!form.pros.trim()) errs.pros = "Pros are required";
  if (!form.cons.trim()) errs.cons = "Cons are required";
  if (!form.adviceToManagement.trim()) errs.adviceToManagement = "Advice is required";
  return errs;
}

type StarRatingProps = {
  value: number;
  onChange: (v: number) => void;
};

function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const display = hoverRating || value;

  return (
    <div className="flex gap-3" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="transition-transform duration-100 hover:scale-110 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-10 w-10 transition-all duration-150"
            style={{
              fill: star <= display ? "var(--color-tertiary-fixed-dim)" : "none",
              stroke:
                star <= display
                  ? "var(--color-tertiary-fixed-dim)"
                  : "color-mix(in srgb, var(--color-outline-variant) 50%, transparent)",
              strokeWidth: 1.5,
            }}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full border-b bg-transparent py-4 font-medium transition-all outline-none focus:ring-0";

const textareaCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full resize-none border-b bg-transparent py-4 text-lg leading-relaxed transition-all outline-none focus:ring-0";

export function WriteReviewForm() {
  const [form, setForm] = useState<ReviewFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Company search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setForm((f) => ({ ...f, companySlug: "", companyName: "", companyLogoUrl: null }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/companies?search=${encodeURIComponent(val)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.items);
        setShowDropdown(true);
      }
    }, 500);
  }

  function handleSelectCompany(item: CompanySuggestion) {
    setForm((f) => ({
      ...f,
      companySlug: item.slug,
      companyName: item.name,
      companyLogoUrl: item.logoUrl,
    }));
    setQuery(item.name);
    setShowDropdown(false);
    setErrors((e) => ({ ...e, companySlug: undefined }));
  }

  function set<K extends keyof ReviewFormState>(key: K, value: ReviewFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companySlug: form.companySlug,
          overallRating: form.overallRating,
          employmentStatus: form.employmentStatus,
          formerYear: form.formerYear,
          employmentType: form.employmentType,
          jobTitle: form.jobTitle,
          headline: form.headline,
          pros: form.pros,
          cons: form.cons,
          adviceToManagement: form.adviceToManagement,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrors({ companySlug: data.error ?? "Submission failed. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-tertiary-fixed-dim mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <ShieldCheck size={28} className="text-on-tertiary-fixed" />
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Review Published</h2>
        <p className="text-on-surface-variant max-w-sm">
          Your anonymous contribution has been added to the archive. Thank you for helping the
          community.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-20">
      {/* Step 01 — Organization */}
      <div className="space-y-6" id="step-1">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 01</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Search</h2>

        <div className="relative">
          <div className="group relative">
            <Search
              size={20}
              className="text-on-surface-variant group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
            />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search for a company or institution..."
              className={cn(inputCls, "pl-8 text-lg", errors.companySlug && "border-destructive")}
            />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="bg-surface-container-lowest border-outline-variant/20 absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border shadow-lg">
              {suggestions.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onMouseDown={() => handleSelectCompany(item)}
                  className="hover:bg-surface-container-low flex w-full items-center gap-4 px-4 py-3 text-left transition-colors"
                >
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt="" className="h-8 w-8 rounded object-contain" />
                  ) : (
                    <div className="bg-surface-container-highest flex h-8 w-8 items-center justify-center rounded text-xs font-black">
                      {item.name[0]}
                    </div>
                  )}
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.companySlug && <p className="text-destructive text-xs">{errors.companySlug}</p>}
      </div>

      {/* Step 02 — Your Role */}
      <div className="space-y-10" id="step-2">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 02</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Your Role</h2>

        <div className="space-y-4">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Overall Rating
          </label>
          <StarRating value={form.overallRating} onChange={(v) => set("overallRating", v)} />
          {errors.overallRating && (
            <p className="text-destructive text-xs">{errors.overallRating}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Employment Status
          </label>
          <div className="flex flex-wrap gap-4">
            {EMPLOYMENT_STATUSES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  set("employmentStatus", value);
                  if (value === "current_employee") set("formerYear", null);
                }}
                className={cn(
                  "rounded-full border px-6 py-3 text-sm font-medium transition-all",
                  form.employmentStatus === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-outline-variant/30 hover:border-primary text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.employmentStatus && (
            <p className="text-destructive text-xs">{errors.employmentStatus}</p>
          )}
        </div>

        {form.employmentStatus === "former_employee" && (
          <div className="space-y-2">
            <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
              Year You Left
            </label>
            <div className="relative">
              <select
                value={form.formerYear ?? ""}
                onChange={(e) => set("formerYear", e.target.value ? Number(e.target.value) : null)}
                className={cn(
                  inputCls,
                  "cursor-pointer appearance-none pr-8",
                  errors.formerYear && "border-destructive",
                )}
              >
                <option value="">Select year...</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="text-on-surface-variant pointer-events-none absolute top-1/2 right-0 -translate-y-1/2"
              />
            </div>
            {errors.formerYear && <p className="text-destructive text-xs">{errors.formerYear}</p>}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Employment Type
          </label>
          <div className="relative">
            <select
              value={form.employmentType}
              onChange={(e) => set("employmentType", e.target.value)}
              className={cn(
                inputCls,
                "cursor-pointer appearance-none pr-8",
                errors.employmentType && "border-destructive",
              )}
            >
              <option value="">Select type...</option>
              {EMPLOYMENT_TYPES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="text-on-surface-variant pointer-events-none absolute top-1/2 right-0 -translate-y-1/2"
            />
          </div>
          {errors.employmentType && (
            <p className="text-destructive text-xs">{errors.employmentType}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Job Title
          </label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className={cn(inputCls, errors.jobTitle && "border-destructive")}
          />
          {errors.jobTitle && <p className="text-destructive text-xs">{errors.jobTitle}</p>}
        </div>
      </div>

      {/* Step 03 — Your Review */}
      <div className="space-y-10" id="step-3">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 03</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Your Review</h2>

        <div className="space-y-2">
          <input
            type="text"
            value={form.headline}
            onChange={(e) => set("headline", e.target.value)}
            placeholder="Review Headline"
            className={cn(inputCls, "text-xl font-bold", errors.headline && "border-destructive")}
          />
          {errors.headline && <p className="text-destructive text-xs">{errors.headline}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Pros
          </label>
          <textarea
            value={form.pros}
            onChange={(e) => set("pros", e.target.value)}
            placeholder="What did you enjoy about working here?"
            rows={4}
            className={cn(textareaCls, errors.pros && "border-destructive")}
          />
          {errors.pros && <p className="text-destructive text-xs">{errors.pros}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Cons
          </label>
          <textarea
            value={form.cons}
            onChange={(e) => set("cons", e.target.value)}
            placeholder="What could be improved?"
            rows={4}
            className={cn(textareaCls, errors.cons && "border-destructive")}
          />
          {errors.cons && <p className="text-destructive text-xs">{errors.cons}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
            Advice to Management
          </label>
          <textarea
            value={form.adviceToManagement}
            onChange={(e) => set("adviceToManagement", e.target.value)}
            placeholder="What advice would you give to leadership?"
            rows={4}
            className={cn(textareaCls, errors.adviceToManagement && "border-destructive")}
          />
          {errors.adviceToManagement && (
            <p className="text-destructive text-xs">{errors.adviceToManagement}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="border-outline-variant/10 flex flex-col items-center justify-between gap-8 border-t pt-10 md:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="from-primary to-primary-container text-primary-foreground w-full rounded-md bg-gradient-to-b px-12 py-4 font-bold tracking-tight transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 md:w-auto"
        >
          {submitting ? "Publishing..." : "Publish Review"}
        </button>
      </div>
    </form>
  );
}

export function IntegritySidebar() {
  return (
    <aside className="h-fit lg:sticky lg:top-28 lg:col-span-4">
      <div className="bg-surface-container-low space-y-8 rounded-xl p-10">
        <div className="space-y-2">
          <h3 className="text-outline font-mono text-sm tracking-widest uppercase">
            Archive Standards
          </h3>
          <h2 className="text-2xl font-black tracking-tighter">The Integrity Protocol</h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-primary" />
              <h4 className="text-sm font-bold tracking-tight uppercase">Verified Sentiment</h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Every entry is cross-referenced with institutional data to ensure the archive
              maintains its editorial authority.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-primary" />
              <h4 className="text-sm font-bold tracking-tight uppercase">Encrypted Identity</h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Your data is hashed at the point of entry. Not even the curators can trace the origin
              of a review.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-primary" />
              <h4 className="text-sm font-bold tracking-tight uppercase">Community Impact</h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Transparent organizations yield better results. Your feedback fuels the macro-shift in
              workspace culture.
            </p>
          </div>
        </div>

        <div className="border-outline-variant/20 mt-8 border-t pt-8">
          <div className="bg-surface-container-lowest flex items-center gap-4 rounded-lg p-4">
            <div className="bg-surface-container-highest flex h-10 w-10 items-center justify-center rounded-full text-sm font-black">
              TC
            </div>
            <div>
              <p className="text-xs font-bold tracking-tighter uppercase">The Curator</p>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase">
                Editorial Access
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-container text-primary-foreground group relative mt-8 overflow-hidden rounded-xl p-10">
        <div className="relative z-10 space-y-4">
          <h3 className="text-lg leading-tight font-bold">Need corporate assistance?</h3>
          <p className="text-on-primary-container text-sm">
            Request a verified institutional audit for your organization.
          </p>
          <button className="border-on-primary-container/50 border-b pb-1 text-xs font-bold tracking-widest uppercase transition-opacity group-hover:opacity-70">
            Contact Registry
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 transition-opacity group-hover:opacity-20">
          <Globe size={160} />
        </div>
      </div>
    </aside>
  );
}
