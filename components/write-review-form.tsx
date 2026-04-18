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
      <div className="flex items-end justify-between">
        <label className="text-sm font-semibold tracking-tight uppercase">{label}</label>
        <span className="text-on-surface-variant font-mono text-sm">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="bg-surface-container-highest [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary h-1 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
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
      {/* Step 01 */}
      <div className="space-y-6" id="step-1">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 01</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Search</h2>
        <div className="group relative">
          <Search
            size={20}
            className="text-on-surface-variant group-focus-within:text-primary absolute top-1/2 left-0 -translate-y-1/2 transition-colors"
          />
          <input
            type="text"
            placeholder="Search for a company or institution..."
            className="border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/50 w-full border-b bg-transparent py-4 pl-8 text-lg font-medium transition-all outline-none placeholder:font-normal focus:ring-0"
          />
        </div>
      </div>

      {/* Step 02 */}
      <div className="space-y-10" id="step-2">
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 02</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Quantitative Ratings</h2>
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
        <div className="mb-2 flex items-center gap-4">
          <span className="text-outline font-mono text-xs tracking-widest uppercase">Step 03</span>
          <div className="bg-outline-variant/20 h-px flex-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Qualitative Review</h2>
        <div className="space-y-8">
          <input
            type="text"
            placeholder="Review Headline"
            className="border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full border-b bg-transparent py-2 text-xl font-bold transition-all outline-none focus:ring-0"
          />
          <textarea
            placeholder="Detailed Experience"
            rows={6}
            className="border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full resize-none border-b bg-transparent py-4 text-lg leading-relaxed transition-all outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Submit row */}
      <div className="border-outline-variant/10 flex flex-col items-center justify-between gap-8 border-t pt-10 md:flex-row">
        <button
          type="submit"
          className="from-primary to-primary-container text-primary-foreground w-full rounded-md bg-gradient-to-b px-12 py-4 font-bold tracking-tight transition-all hover:opacity-90 active:scale-[0.98] md:w-auto"
        >
          Publish Review
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
