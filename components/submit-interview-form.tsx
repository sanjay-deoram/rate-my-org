"use client";

import { useState } from "react";
import { Search, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "Technical",
  "Behavioral",
  "System Design",
  "Cultural Fit",
  "Whiteboard",
] as const;

type Category = (typeof categories)[number];

export function SubmitInterviewForm() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
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
    <form onSubmit={handleSubmit} className="space-y-16">
      {/* 01 Organization */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          01. Select Organization
        </label>
        <div className="group relative">
          <Search
            size={20}
            className="text-outline group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
          />
          <input
            type="text"
            placeholder="Search for a company..."
            className="border-outline-variant/20 focus:border-primary placeholder:text-outline-variant w-full border-b bg-transparent py-4 pl-8 text-xl font-medium transition-colors outline-none focus:ring-0"
          />
        </div>
      </section>

      {/* 02 + 03 Role & Department */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
            02. Role Title
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Product Designer"
            className="border-outline-variant/20 focus:border-primary placeholder:text-outline-variant w-full border-b bg-transparent py-4 font-medium transition-colors outline-none focus:ring-0"
          />
        </div>
        <div className="space-y-6">
          <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
            03. Department
          </label>
          <input
            type="text"
            placeholder="e.g. Engineering"
            className="border-outline-variant/20 focus:border-primary placeholder:text-outline-variant w-full border-b bg-transparent py-4 font-medium transition-colors outline-none focus:ring-0"
          />
        </div>
      </section>

      {/* 04 Category */}
      <section className="space-y-6">
        <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
          04. Question Category
        </label>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={cn(
                "rounded-full border px-6 py-3 text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-outline-variant/30 hover:border-primary text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 05 The Question */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <label className="text-on-surface-variant block font-mono text-sm tracking-widest uppercase">
            05. The Question
          </label>
          <span className="text-outline-variant font-mono text-[10px]">
            REDACT NAMES &amp; SENSITIVE INFO
          </span>
        </div>
        <textarea
          rows={6}
          placeholder="Describe the specific question or challenge you were presented with..."
          className="bg-surface-container-low focus:ring-primary placeholder:text-outline-variant w-full resize-none rounded-lg border-0 p-6 text-lg leading-relaxed outline-none focus:ring-1"
        />
      </section>

      {/* Submit row */}
      <section className="border-outline-variant/10 flex flex-col items-center justify-between gap-8 border-t pt-8 md:flex-row">
        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={anonymous}
            onClick={() => setAnonymous((a) => !a)}
            className={cn(
              "relative h-6 w-12 rounded-full transition-colors duration-200",
              anonymous ? "bg-tertiary-fixed-dim" : "bg-surface-container-highest",
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                anonymous ? "translate-x-6" : "translate-x-0",
              )}
            />
          </button>
          <span className="text-sm font-medium">Post as Anonymous</span>
        </label>

        <button
          type="submit"
          className="from-primary to-primary-container text-primary-foreground w-full rounded-lg bg-gradient-to-b px-12 py-5 text-lg font-bold tracking-tight transition-transform hover:opacity-90 active:scale-95 md:w-auto"
        >
          Publish Contribution
        </button>
      </section>
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

      {/* Decorative editorial block */}
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
