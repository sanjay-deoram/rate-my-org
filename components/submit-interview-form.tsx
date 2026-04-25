"use client";

import { useForm } from "@tanstack/react-form";
import { useState, useRef } from "react";
import { z } from "zod";
import { Search, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTERVIEW_EXPERIENCES, OFFER_OUTCOMES } from "@/lib/schemas/interview";
import { useCompanySearch } from "@/hooks/use-company-search";
import { useSubmitInterview } from "@/hooks/use-submit-interview";
import type { CompanySuggestion } from "@/types/review";
import type { InterviewPostBody } from "@/lib/api/interviews";

function errMsg(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) return String(err.message);
  return "Invalid value";
}

const inputCls =
  "border-outline-variant/20 focus:border-primary placeholder:text-outline-variant w-full border-b bg-transparent py-4 font-medium transition-colors outline-none focus:ring-0";

const DIFFICULTY_LABELS = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"] as const;

const DESCRIPTION_TEMPLATE = `[Interview Process]


[Behavioral]


[Technical]


[More Info]
`;

export function SubmitInterviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchData } = useCompanySearch(debouncedQuery);
  const suggestions = searchData?.items ?? [];

  const submitInterview = useSubmitInterview(() => setSubmitted(true));

  const form = useForm({
    defaultValues: {
      companySlug: "",
      companyName: "",
      roleTitle: "",
      department: "",
      difficulty: 0,
      overallExperience: "" as (typeof INTERVIEW_EXPERIENCES)[number] | "",
      description: DESCRIPTION_TEMPLATE,
      offerReceived: "" as (typeof OFFER_OUTCOMES)[number] | "",
    },
    onSubmit: async ({ value }) => {
      const { companyName: _name, ...postBody } = value;
      await submitInterview.mutateAsync(postBody as InterviewPostBody);
    },
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchQuery(val);
    form.setFieldValue("companySlug", "");
    form.setFieldValue("companyName", "");

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
    setSearchQuery(item.name);
    setShowDropdown(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-tertiary-fixed-dim mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <Shield size={28} className="text-on-tertiary-fixed" />
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Contribution Published</h2>
        <p className="text-on-surface-variant max-w-sm">
          Your interview experience has been added to the archive. Thank you for helping the
          community prepare.
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
      className="space-y-16"
    >
      {/* 01 Organization */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          01. Select Organization
        </label>
        <form.Field
          name="companySlug"
          validators={{ onSubmit: z.string().min(1, "Select a company") }}
        >
          {(field) => (
            <div className="space-y-2">
              <div className="group relative">
                <Search
                  size={20}
                  className="text-outline group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  placeholder="Search for a company..."
                  className={cn(
                    inputCls,
                    "pl-8 text-xl",
                    field.state.meta.errors.length > 0 && "border-destructive",
                  )}
                />
              </div>

              {showDropdown && suggestions.length > 0 && (
                <div className="bg-surface-container-lowest border-outline-variant/20 absolute z-50 mt-1 w-full overflow-hidden rounded-lg border shadow-lg">
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

              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* 02 + 03 Role & Department */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <form.Field
          name="roleTitle"
          validators={{ onSubmit: z.string().min(1, "Role title is required").max(120) }}
        >
          {(field) => (
            <div className="space-y-6">
              <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
                02. Role Title
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

        <form.Field name="department">
          {(field) => (
            <div className="space-y-6">
              <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
                03. Department
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Engineering"
                className={inputCls}
              />
            </div>
          )}
        </form.Field>
      </section>

      {/* 04 Difficulty */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          04. Interview Difficulty
        </label>
        <form.Field
          name="difficulty"
          validators={{ onSubmit: z.number().int().min(1, "Select a difficulty rating").max(5) }}
        >
          {(field) => (
            <div className="space-y-4">
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => field.handleChange(n)}
                    className={cn(
                      "flex h-14 w-14 flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all",
                      field.state.value === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-outline-variant/30 hover:border-primary text-foreground",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {field.state.value > 0 && (
                <p className="text-on-surface-variant font-mono text-xs">
                  {DIFFICULTY_LABELS[field.state.value]}
                </p>
              )}
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* 05 Overall Experience */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          05. Overall Experience
        </label>
        <form.Field
          name="overallExperience"
          validators={{
            onSubmit: z.enum(INTERVIEW_EXPERIENCES, { error: "Select an overall experience" }),
          }}
        >
          {(field) => (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {INTERVIEW_EXPERIENCES.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => field.handleChange(field.state.value === exp ? "" : exp)}
                    className={cn(
                      "rounded-full border px-6 py-3 text-sm font-medium transition-all",
                      field.state.value === exp
                        ? exp === "Great"
                          ? "border-tertiary-fixed-dim bg-tertiary-fixed-dim text-on-tertiary-fixed"
                          : exp === "Negative"
                            ? "border-destructive bg-destructive text-white"
                            : "border-primary bg-primary text-primary-foreground"
                        : "border-outline-variant/30 hover:border-primary text-foreground",
                    )}
                  >
                    {exp}
                  </button>
                ))}
              </div>
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* 06 Interview Description */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
            06. Interview Process
          </label>
          <span className="text-outline-variant font-mono text-[10px]">
            REDACT NAMES &amp; SENSITIVE INFO
          </span>
        </div>
        <form.Field
          name="description"
          validators={{
            onSubmit: z
              .string()
              .min(10, "Please describe the interview process in more detail")
              .max(5000),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <textarea
                rows={10}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={cn(
                  "bg-surface-container-low focus:ring-primary placeholder:text-outline-variant w-full resize-none rounded-lg border-0 p-6 font-mono text-sm leading-relaxed outline-none focus:ring-1",
                  field.state.meta.errors.length > 0 && "ring-destructive ring-1",
                )}
              />
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* 07 Offer Received */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          07. Did You Receive an Offer?
        </label>
        <form.Field
          name="offerReceived"
          validators={{
            onSubmit: z.enum(OFFER_OUTCOMES, { error: "Select an offer outcome" }),
          }}
        >
          {(field) => (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {OFFER_OUTCOMES.map((outcome) => (
                  <button
                    key={outcome}
                    type="button"
                    onClick={() => field.handleChange(field.state.value === outcome ? "" : outcome)}
                    className={cn(
                      "rounded-full border px-6 py-3 text-sm font-medium transition-all",
                      field.state.value === outcome
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-outline-variant/30 hover:border-primary text-foreground",
                    )}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
              {field.state.meta.errors[0] && (
                <p className="text-destructive text-xs">{errMsg(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Submit row */}
      <section className="border-outline-variant/10 flex justify-end border-t pt-8">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || submitInterview.isPending}
              className="from-primary to-primary-container text-primary-foreground w-full rounded-lg bg-gradient-to-b px-12 py-5 text-lg font-bold tracking-tight transition-transform hover:opacity-90 active:scale-95 disabled:opacity-50 md:w-auto"
            >
              {submitInterview.isPending ? "Publishing..." : "Publish Contribution"}
            </button>
          )}
        </form.Subscribe>
      </section>
      {submitInterview.isError && (
        <p className="text-destructive text-center text-sm">{submitInterview.error.message}</p>
      )}
    </form>
  );
}

export function AnonymitySidebar() {
  const steps = [
    {
      num: "01",
      title: "Metadata Scrubbing",
      desc: "Our system automatically strips all hidden identifiers and EXIF data from any uploads or text blocks.",
    },
    {
      num: "02",
      title: "Encrypted Storage",
      desc: "All contributions are stored in a siloed, double-blind database where your identity is never linked to the data.",
    },
    {
      num: "03",
      title: "No Retargeting",
      desc: "We never share your contribution history with third-party advertisers or recruitment agencies.",
    },
  ];

  return (
    <aside className="h-fit space-y-8 lg:sticky lg:top-28 lg:col-span-4">
      <div className="bg-surface-container-low space-y-8 rounded-xl p-10">
        <div className="space-y-2">
          <div className="bg-tertiary-fixed-dim mb-4 flex h-8 w-8 items-center justify-center rounded-full">
            <Shield size={16} className="text-on-tertiary-fixed" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Guarding Your Anonymity</h2>
        </div>

        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6">
              <span className="text-outline-variant font-mono text-sm">{s.num}</span>
              <div className="space-y-1">
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-outline-variant/20 border-t pt-8">
          <a href="#" className="group flex items-center gap-2 text-sm font-bold">
            Review our Trust Charter
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div className="group bg-surface-container relative h-64 overflow-hidden rounded-xl">
        <div className="from-surface-container-high to-inverse-surface absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-700 group-hover:opacity-50" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(27,27,27,0.04)_8px,rgba(27,27,27,0.04)_16px)]" />
        <div className="from-primary/60 absolute inset-0 flex items-end bg-gradient-to-t to-transparent p-8">
          <p className="text-sm font-medium text-white italic">
            &ldquo;The power of collective intelligence lies in secure sharing.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
