"use client";

import { useState } from "react";
import { Search, ShieldCheck, Lock, Globe } from "lucide-react";

type RatingSliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

function RatingSlider({ label, value, onChange }: RatingSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-semibold tracking-tight uppercase">
          {label}
        </label>
        <span className="font-mono text-sm text-on-surface-variant">
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}

export function WriteReviewForm() {
  const [ratings, setRatings] = useState({
    workLifeBalance: 7.5,
    careerGrowth: 7.5,
    compensation: 7.5,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-tertiary-fixed-dim rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={28} className="text-on-tertiary-fixed" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Review Published
        </h2>
        <p className="text-on-surface-variant max-w-sm">
          Your anonymous contribution has been added to the archive. Thank you
          for helping the community.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-20">
      {/* Step 01 */}
      <div className="space-y-6" id="step-1">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-mono text-xs text-outline tracking-widest uppercase">
            Step 01
          </span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Organization Search
        </h2>
        <div className="relative group">
          <Search
            size={20}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Search for a company or institution..."
            className="w-full pl-8 py-4 bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-lg transition-all outline-none font-medium placeholder:font-normal placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      {/* Step 02 */}
      <div className="space-y-10" id="step-2">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-mono text-xs text-outline tracking-widest uppercase">
            Step 02
          </span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Quantitative Ratings
        </h2>
        <div className="grid gap-12">
          <RatingSlider
            label="Work-Life Balance"
            value={ratings.workLifeBalance}
            onChange={(v) => setRatings((r) => ({ ...r, workLifeBalance: v }))}
          />
          <RatingSlider
            label="Career Growth"
            value={ratings.careerGrowth}
            onChange={(v) => setRatings((r) => ({ ...r, careerGrowth: v }))}
          />
          <RatingSlider
            label="Compensation"
            value={ratings.compensation}
            onChange={(v) => setRatings((r) => ({ ...r, compensation: v }))}
          />
        </div>
      </div>

      {/* Step 03 */}
      <div className="space-y-10" id="step-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-mono text-xs text-outline tracking-widest uppercase">
            Step 03
          </span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Qualitative Review
        </h2>
        <div className="space-y-8">
          <input
            type="text"
            placeholder="Review Headline"
            className="w-full py-2 bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-xl font-bold transition-all outline-none placeholder:text-on-surface-variant/40"
          />
          <textarea
            placeholder="Detailed Experience"
            rows={6}
            className="w-full py-4 bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-lg leading-relaxed transition-all outline-none resize-none placeholder:text-on-surface-variant/40"
          />
        </div>
      </div>

      {/* Submit row */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-outline-variant/10">
        <button
          type="submit"
          className="w-full md:w-auto px-12 py-4 bg-gradient-to-b from-primary to-primary-container text-primary-foreground rounded-md font-bold tracking-tight hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Publish Review
        </button>
      </div>
    </form>
  );
}

export function IntegritySidebar() {
  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
      <div className="bg-surface-container-low p-10 space-y-8 rounded-xl">
        <div className="space-y-2">
          <h3 className="text-sm font-mono tracking-widest text-outline uppercase">
            Archive Standards
          </h3>
          <h2 className="text-2xl font-black tracking-tighter">
            The Integrity Protocol
          </h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-tight">
                Verified Sentiment
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Every entry is cross-referenced with institutional data to ensure
              the archive maintains its editorial authority.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-tight">
                Encrypted Identity
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Your data is hashed at the point of entry. Not even the curators
              can trace the origin of a review.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-tight">
                Community Impact
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Transparent organizations yield better results. Your feedback
              fuels the macro-shift in workspace culture.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-outline-variant/20">
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-lg">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-sm">
              TC
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter">
                The Curator
              </p>
              <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
                Editorial Access
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-10 bg-primary-container text-primary-foreground rounded-xl relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <h3 className="text-lg font-bold leading-tight">
            Need corporate assistance?
          </h3>
          <p className="text-on-primary-container text-sm">
            Request a verified institutional audit for your organization.
          </p>
          <button className="text-xs font-bold uppercase tracking-widest border-b border-on-primary-container/50 pb-1 group-hover:opacity-70 transition-opacity">
            Contact Registry
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <Globe size={160} />
        </div>
      </div>
    </aside>
  );
}
