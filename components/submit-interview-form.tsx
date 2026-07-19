"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { Shield, ArrowRight, Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INTERVIEW_EXPERIENCES,
  OFFER_OUTCOMES,
  ROUND_TYPES,
  roundSchema,
  type RoundType,
} from "@/lib/schemas/interview";
import { useSubmitInterview } from "@/hooks/use-submit-interview";
import type { CompanySuggestion } from "@/types/review";
import type { InterviewPostBody } from "@/lib/api/interviews";
import { errMsg } from "@/shared/err-msg";
import { CompanySearchInput } from "@/components/company-search-input";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownClose,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { DIFFICULTY_LABELS } from "@/lib/org-display";

const inputCls =
  "border-outline-variant/20 focus:border-primary placeholder:text-outline-variant w-full border-b bg-transparent py-4 font-medium transition-colors outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring";

export function SubmitInterviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const submitInterview = useSubmitInterview(() => setSubmitted(true));

  const form = useForm({
    defaultValues: {
      companySlug: "",
      companyName: "",
      roleTitle: "",
      department: "",
      difficulty: 0,
      overallExperience: "" as (typeof INTERVIEW_EXPERIENCES)[number] | "",
      rounds: [{ type: "Phone Screen" as RoundType, notes: "" }],
      offerReceived: "" as (typeof OFFER_OUTCOMES)[number] | "",
    },
    onSubmit: async ({ value }) => {
      const { companyName: _name, ...postBody } = value;
      await submitInterview.mutateAsync(postBody as InterviewPostBody);
    },
  });

  function handleSelectCompany(item: CompanySuggestion) {
    form.setFieldValue("companySlug", item.slug);
    form.setFieldValue("companyName", item.name);
  }

  function handleSearchClear() {
    form.setFieldValue("companySlug", "");
    form.setFieldValue("companyName", "");
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
      className="space-y-20"
    >
      {/* Step 01 — Organization */}
      <section className="space-y-6" id="step-1">
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
              <CompanySearchInput
                onSelect={handleSelectCompany}
                onInputChange={handleSearchClear}
                showAddCompany
                hasError={field.state.meta.errors.length > 0}
                placeholder="Search for a company..."
                inputSize="lg"
              />
              {field.state.meta.errors[0] && (
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Step 02 — Role & Department */}
      <section className="space-y-10" id="step-2">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 02</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Role &amp; Department</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <form.Field
            name="roleTitle"
            validators={{ onSubmit: z.string().min(1, "Role title is required").max(120) }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <div className="space-y-6">
                  <label
                    htmlFor={field.name}
                    className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase"
                  >
                    Role Title
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Senior Product Designer"
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? `${field.name}-error` : undefined}
                    className={cn(inputCls, hasError && "border-destructive")}
                  />
                  {field.state.meta.errors[0] && (
                    <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                      {errMsg(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="department">
            {(field) => (
              <div className="space-y-6">
                <label
                  htmlFor={field.name}
                  className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase"
                >
                  Department
                </label>
                <input
                  id={field.name}
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
        </div>
      </section>

      {/* Step 03 — Difficulty */}
      <section className="space-y-6" id="step-3">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 03</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Interview Difficulty</h2>
        <form.Field
          name="difficulty"
          validators={{ onSubmit: z.number().int().min(1, "Select a difficulty rating").max(5) }}
        >
          {(field) => (
            <div className="space-y-4">
              <div className="flex gap-3" role="radiogroup" aria-label="Interview Difficulty">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={field.state.value === n}
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
                <p className="text-on-surface-variant text-sm">
                  {DIFFICULTY_LABELS[field.state.value]}
                </p>
              )}
              {field.state.meta.errors[0] && (
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Step 04 — Overall Experience */}
      <section className="space-y-6" id="step-4">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 04</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Overall Experience</h2>
        <form.Field
          name="overallExperience"
          validators={{
            onSubmit: z.enum(INTERVIEW_EXPERIENCES, { error: "Select an overall experience" }),
          }}
        >
          {(field) => (
            <div className="space-y-4">
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label="Overall Experience"
              >
                {INTERVIEW_EXPERIENCES.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    role="radio"
                    aria-checked={field.state.value === exp}
                    onClick={() => field.handleChange(field.state.value === exp ? "" : exp)}
                    className={cn(
                      "rounded-full border px-5 py-3 text-sm font-medium transition-colors sm:px-6",
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
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Step 05 — Interview Rounds */}
      <section className="space-y-6" id="step-5">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 05</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Interview Rounds</h2>
        <form.Field
          name="rounds"
          validators={{
            onSubmit: z.array(roundSchema).min(1, "Add at least one round"),
          }}
        >
          {(field) => (
            <div className="space-y-3">
              {field.state.value.map((round, idx) => (
                <div key={idx} className="bg-surface-container-low space-y-3 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-outline font-mono text-xs tracking-widest uppercase">
                        Round {idx + 1}
                      </span>
                      <DropdownRoot>
                        <DropdownTrigger className="bg-surface-container-lowest border-outline-variant/20 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold outline-none">
                          {round.type}
                          <ChevronDown size={11} className="text-outline-variant" />
                        </DropdownTrigger>
                        <DropdownContent align="start">
                          {ROUND_TYPES.map((t) => (
                            <DropdownClose key={t} asChild>
                              <DropdownItem
                                active={round.type === t}
                                onClick={() => {
                                  const updated = [...field.state.value];
                                  updated[idx] = { ...updated[idx], type: t };
                                  field.handleChange(updated);
                                }}
                              >
                                {t}
                              </DropdownItem>
                            </DropdownClose>
                          ))}
                        </DropdownContent>
                      </DropdownRoot>
                    </div>
                    {field.state.value.length > 1 && (
                      <button
                        type="button"
                        onClick={() => field.removeValue(idx)}
                        className="text-outline-variant hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={round.notes}
                    onChange={(e) => {
                      const updated = [...field.state.value];
                      updated[idx] = { ...updated[idx], notes: e.target.value };
                      field.handleChange(updated);
                    }}
                    placeholder="Describe what happened in this round..."
                    className="bg-surface-container-lowest placeholder:text-outline-variant focus:ring-primary w-full resize-none rounded-lg border-0 p-3 leading-relaxed outline-none focus:ring-1"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => field.pushValue({ type: "Technical" as RoundType, notes: "" })}
                className="border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-foreground flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-5 py-3 text-sm font-medium transition-all"
              >
                <Plus size={16} /> Add Round
              </button>
              {field.state.meta.errors[0] && (
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Step 06 — Offer */}
      <section className="space-y-6" id="step-6">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 06</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Did You Receive an Offer?</h2>
        <form.Field
          name="offerReceived"
          validators={{
            onSubmit: z.enum(OFFER_OUTCOMES, { error: "Select an offer outcome" }),
          }}
        >
          {(field) => (
            <div className="space-y-4">
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label="Did You Receive an Offer?"
              >
                {OFFER_OUTCOMES.map((outcome) => (
                  <button
                    key={outcome}
                    type="button"
                    role="radio"
                    aria-checked={field.state.value === outcome}
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
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </section>

      {/* Submit row */}
      <section className="border-outline-variant/10 flex justify-end border-t pt-10">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || submitInterview.isPending}
              className="bg-token-blue w-full rounded-xl px-8 py-4 font-bold text-white shadow-md transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50 md:w-auto md:px-12"
            >
              {submitInterview.isPending ? "Submitting…" : "Submit Interview"}
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
      <div className="bg-surface-container-low space-y-8 rounded-xl p-6 sm:p-8 lg:p-10">
        <div className="space-y-2">
          <div className="bg-tertiary-fixed-dim mb-4 flex h-8 w-8 items-center justify-center rounded-full">
            <Shield size={16} className="text-on-tertiary-fixed" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Guarding Your Anonymity</h2>
        </div>

        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6">
              <span className="text-outline shrink-0 font-mono text-xs tracking-widest tabular-nums">
                {s.num}
              </span>
              <div className="min-w-0 space-y-1">
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
        <div className="from-surface-container-high to-inverse-surface absolute inset-0 bg-linear-to-br opacity-30 transition-opacity duration-700 group-hover:opacity-50" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(27,27,27,0.04)_8px,rgba(27,27,27,0.04)_16px)]" />
        <div className="from-primary/60 absolute inset-0 flex items-end bg-linear-to-t to-transparent p-8">
          <p className="text-sm font-medium text-white italic">
            &ldquo;The power of collective intelligence lies in secure sharing.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
