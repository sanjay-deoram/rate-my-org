"use client";

import { useForm } from "@tanstack/react-form";
import { useState, useRef } from "react";
import { z } from "zod";
import { Search, ShieldCheck, Lock, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EMPLOYMENT_TYPE_VALUES,
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  FORMER_YEARS,
  type EmploymentTypeValue,
} from "@/constants/employment";
import { useCompanySearch } from "@/hooks/use-company-search";
import { useSubmitReview } from "@/hooks/use-submit-review";
import type { ReviewPostBody, CompanySuggestion } from "@/types/review";

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

function errMsg(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) return String(err.message);
  return "Invalid value";
}

const inputCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full border-b bg-transparent py-4 font-medium transition-all outline-none focus:ring-0";

const textareaCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full resize-none border-b bg-transparent py-4 text-lg leading-relaxed transition-all outline-none focus:ring-0";

export function WriteReviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchData } = useCompanySearch(debouncedQuery);
  const suggestions = searchData?.items ?? [];

  const submitReview = useSubmitReview(() => setSubmitted(true));

  const form = useForm({
    defaultValues: {
      companySlug: "",
      companyName: "",
      companyLogoUrl: null as string | null,
      overallRating: 0,
      employmentStatus: "" as "current_employee" | "former_employee" | "",
      formerYear: null as number | null,
      employmentType: "" as EmploymentTypeValue | "",
      jobTitle: "",
      headline: "",
      pros: "",
      cons: "",
      adviceToManagement: "",
    },
    onSubmit: async ({ value }) => {
      const { companyName: _name, companyLogoUrl: _logo, ...postBody } = value;
      await submitReview.mutateAsync(postBody as ReviewPostBody);
    },
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchQuery(val);
    form.setFieldValue("companySlug", "");
    form.setFieldValue("companyName", "");
    form.setFieldValue("companyLogoUrl", null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setShowDropdown(true);
    }, 500);
  }

  function handleSelectCompany(item: CompanySuggestion) {
    form.setFieldValue("companySlug", item.slug);
    form.setFieldValue("companyName", item.name);
    form.setFieldValue("companyLogoUrl", item.logoUrl);
    setSearchQuery(item.name);
    setShowDropdown(false);
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-20"
    >
      {/* Step 01 — Organization */}
      <div className="space-y-6" id="step-1">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 01</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Search</h2>

        <form.Field
          name="companySlug"
          validators={{ onSubmit: z.string().min(1, "Select a company") }}
        >
          {(field) => (
            <div className="space-y-2">
              <div className="relative">
                <div className="group relative">
                  <Search
                    size={20}
                    className="text-on-surface-variant group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                    placeholder="Search for a company or institution..."
                    className={cn(
                      inputCls,
                      "pl-8 text-lg",
                      field.state.meta.errors.length > 0 && "border-destructive",
                    )}
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
                          <img
                            src={item.logoUrl}
                            alt=""
                            className="h-8 w-8 rounded object-contain"
                          />
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
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Step 02 — Your Role */}
      <div className="space-y-10" id="step-2">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 02</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Your Role</h2>

        <form.Field
          name="overallRating"
          validators={{ onSubmit: z.number().int().min(1, "Select a rating").max(5) }}
        >
          {(field) => (
            <div className="space-y-4">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Overall Rating
              </label>
              <StarRating value={field.state.value} onChange={(v) => field.handleChange(v)} />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="employmentStatus"
          validators={{
            onSubmit: z.enum(["current_employee", "former_employee"], {
              error: "Select your employment status",
            }),
          }}
        >
          {(field) => (
            <div className="space-y-4">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Employment Status
              </label>
              <div className="flex flex-wrap gap-4">
                {EMPLOYMENT_STATUS_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      field.handleChange(value);
                      if (value === "current_employee") {
                        form.setFieldValue("formerYear", null);
                      }
                    }}
                    className={cn(
                      "rounded-full border px-6 py-3 text-sm font-medium transition-all",
                      field.state.value === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-outline-variant/30 hover:border-primary text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.values.employmentStatus}>
          {(employmentStatus) =>
            employmentStatus === "former_employee" ? (
              <form.Field
                name="formerYear"
                validators={{
                  onSubmit: z
                    .number({ error: "Select the year you left" })
                    .int()
                    .min(1950)
                    .max(new Date().getFullYear()),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                      Year You Left
                    </label>
                    <div className="relative">
                      <select
                        value={field.state.value ?? ""}
                        onChange={(e) =>
                          field.handleChange(e.target.value ? Number(e.target.value) : null)
                        }
                        onBlur={field.handleBlur}
                        className={cn(
                          inputCls,
                          "cursor-pointer appearance-none pr-8",
                          field.state.meta.errors.length > 0 && "border-destructive",
                        )}
                      >
                        <option value="">Select year...</option>
                        {FORMER_YEARS.map((y) => (
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
                    {field.state.meta.errors[0] && (
                      <p className="text-destructive text-xs">
                        {errMsg(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            ) : null
          }
        </form.Subscribe>

        <form.Field
          name="employmentType"
          validators={{
            onSubmit: z.enum(EMPLOYMENT_TYPE_VALUES, { error: "Select employment type" }),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Employment Type
              </label>
              <div className="relative">
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as EmploymentTypeValue)}
                  onBlur={field.handleBlur}
                  className={cn(
                    inputCls,
                    "cursor-pointer appearance-none pr-8",
                    field.state.meta.errors.length > 0 && "border-destructive",
                  )}
                >
                  <option value="">Select type...</option>
                  {EMPLOYMENT_TYPE_OPTIONS.map(({ value, label }) => (
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
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="jobTitle"
          validators={{ onSubmit: z.string().min(1, "Job title is required").max(120) }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Job Title
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Senior Product Designer"
                className={cn(inputCls, field.state.meta.errors.length > 0 && "border-destructive")}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Step 03 — Your Review */}
      <div className="space-y-10" id="step-3">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 03</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Your Review</h2>

        <form.Field
          name="headline"
          validators={{ onSubmit: z.string().min(1, "Headline is required").max(200) }}
        >
          {(field) => (
            <div className="space-y-2">
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Review Headline"
                className={cn(
                  inputCls,
                  "text-xl font-bold",
                  field.state.meta.errors.length > 0 && "border-destructive",
                )}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="pros"
          validators={{ onSubmit: z.string().min(1, "Pros are required").max(5000) }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Pros
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="What did you enjoy about working here?"
                rows={4}
                className={cn(
                  textareaCls,
                  field.state.meta.errors.length > 0 && "border-destructive",
                )}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="cons"
          validators={{ onSubmit: z.string().min(1, "Cons are required").max(5000) }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Cons
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="What could be improved?"
                rows={4}
                className={cn(
                  textareaCls,
                  field.state.meta.errors.length > 0 && "border-destructive",
                )}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="adviceToManagement"
          validators={{ onSubmit: z.string().min(1, "Advice is required").max(5000) }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase">
                Advice to Management
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="What advice would you give to leadership?"
                rows={4}
                className={cn(
                  textareaCls,
                  field.state.meta.errors.length > 0 && "border-destructive",
                )}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Submit */}
      <div className="border-outline-variant/10 flex flex-col items-center justify-between gap-8 border-t pt-10 md:flex-row">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || submitReview.isPending}
              className="from-primary to-primary-container text-primary-foreground w-full rounded-md bg-gradient-to-b px-12 py-4 font-bold tracking-tight transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 md:w-auto"
            >
              {submitReview.isPending ? "Publishing..." : "Publish Review"}
            </button>
          )}
        </form.Subscribe>
        {submitReview.isError && (
          <p className="text-destructive text-sm">{submitReview.error.message}</p>
        )}
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
