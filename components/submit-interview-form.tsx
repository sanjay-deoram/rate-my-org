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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-tertiary-fixed-dim rounded-full flex items-center justify-center mb-6">
          <Shield size={28} className="text-on-tertiary-fixed" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Contribution Published
        </h2>
        <p className="text-on-surface-variant max-w-sm">
          Your interview experience has been added to the archive. Thank you for
          helping the community prepare.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {/* 01 Organization */}
      <section className="space-y-6">
        <label className="block text-sm font-mono uppercase tracking-widest text-on-surface-variant">
          01. Select Organization
        </label>
        <div className="relative group">
          <Search
            size={20}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Search for a company..."
            className="w-full pl-8 py-4 bg-transparent border-b border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors text-xl font-medium placeholder:text-outline-variant outline-none"
          />
        </div>
      </section>

      {/* 02 + 03 Role & Department */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <label className="block text-sm font-mono uppercase tracking-widest text-on-surface-variant">
            02. Role Title
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Product Designer"
            className="w-full py-4 bg-transparent border-b border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors font-medium outline-none placeholder:text-outline-variant"
          />
        </div>
        <div className="space-y-6">
          <label className="block text-sm font-mono uppercase tracking-widest text-on-surface-variant">
            03. Department
          </label>
          <input
            type="text"
            placeholder="e.g. Engineering"
            className="w-full py-4 bg-transparent border-b border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors font-medium outline-none placeholder:text-outline-variant"
          />
        </div>
      </section>

      {/* 04 Category */}
      <section className="space-y-6">
        <label className="block text-sm font-mono uppercase tracking-widest text-on-surface-variant">
          04. Question Category
        </label>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={cn(
                "px-6 py-3 rounded-full border transition-all text-sm font-medium",
                selectedCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-outline-variant/30 hover:border-primary text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 05 The Question */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <label className="block text-sm font-mono uppercase tracking-widest text-on-surface-variant">
            05. The Question
          </label>
          <span className="text-[10px] font-mono text-outline-variant">
            REDACT NAMES &amp; SENSITIVE INFO
          </span>
        </div>
        <textarea
          rows={6}
          placeholder="Describe the specific question or challenge you were presented with..."
          className="w-full p-6 bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-lg text-lg leading-relaxed placeholder:text-outline-variant outline-none resize-none"
        />
      </section>

      {/* Submit row */}
      <section className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-outline-variant/10">
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={anonymous}
            onClick={() => setAnonymous((a) => !a)}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors duration-200",
              anonymous
                ? "bg-tertiary-fixed-dim"
                : "bg-surface-container-highest"
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                anonymous ? "translate-x-6" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-sm font-medium">Post as Anonymous</span>
        </label>

        <button
          type="submit"
          className="w-full md:w-auto px-12 py-5 bg-gradient-to-b from-primary to-primary-container text-primary-foreground rounded-lg font-bold tracking-tight text-lg active:scale-95 transition-transform hover:opacity-90"
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
    <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 h-fit">
      <div className="bg-surface-container-low p-10 rounded-xl space-y-8">
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim flex items-center justify-center mb-4">
            <Shield size={16} className="text-on-tertiary-fixed" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Guarding Your Anonymity
          </h2>
        </div>

        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6">
              <span className="font-mono text-outline-variant text-sm">
                {s.num}
              </span>
              <div className="space-y-1">
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-outline-variant/20">
          <a
            href="#"
            className="text-sm font-bold flex items-center gap-2 group"
          >
            Review our Trust Charter
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>

      {/* Decorative editorial block */}
      <div className="h-64 rounded-xl overflow-hidden relative group bg-surface-container">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-inverse-surface opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(27,27,27,0.04)_8px,rgba(27,27,27,0.04)_16px)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
          <p className="text-white text-sm font-medium italic">
            &ldquo;The power of collective intelligence lies in secure
            sharing.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
