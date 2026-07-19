"use client";

import React from "react";
import { motion } from "framer-motion";
import type { RecentReviewEntry } from "@/lib/queries/homepage";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

function truncate(str: string, max: number) {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

function ReviewCard({ review }: { review: RecentReviewEntry }) {
  const logoSrc = review.companyLogoKey && CDN ? `${CDN}/${review.companyLogoKey}` : null;

  return (
    <div className="border-border bg-surface-container-lowest soft-shadow w-full max-w-xs rounded-[1.25rem] border p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="bg-surface-container flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
          {logoSrc ? (
            <img src={logoSrc} alt={review.companyName} className="h-full w-full object-contain" />
          ) : (
            <span className="text-primary text-sm leading-none font-black">
              {review.companyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-5 font-black">{review.companyName}</span>
          <span className="text-on-surface-variant text-xs leading-5 opacity-70">
            {review.jobTitle}
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{truncate(review.summary || review.headline, 160)}</p>
      <div className="bg-token-lime/60 text-token-green-deep mt-5 inline-flex rounded-full px-3 py-1 text-xs font-black">
        {review.overallRating.toFixed(1)} rating
      </div>
    </div>
  );
}

// One copy of a column must be taller than the viewport, otherwise the
// scroll runs out of content before the -50% loop point and the next cards
// appear to "pop" instead of rising from the bottom. Tile the cards until a
// single copy has enough of them to overflow the viewport at any card height.
const MIN_CARDS_PER_COPY = 6;

function ReviewsColumn({
  reviews,
  duration = 15,
  className,
}: {
  reviews: RecentReviewEntry[];
  duration?: number;
  className?: string;
}) {
  if (reviews.length === 0) return null;

  const filled =
    reviews.length >= MIN_CARDS_PER_COPY
      ? reviews
      : Array.from({ length: MIN_CARDS_PER_COPY }, (_, i) => reviews[i % reviews.length]);

  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[0, 1].map((key) => (
          <React.Fragment key={key}>
            {filled.map((review, i) => (
              <ReviewCard key={`${key}-${i}-${review.id}`} review={review} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function HomeReviews({ reviews }: { reviews: RecentReviewEntry[] }) {
  if (reviews.length === 0) return null;

  const third = Math.ceil(reviews.length / 3);
  const col1 = reviews.slice(0, third);
  const col2 = reviews.slice(third, third * 2);
  const col3 = reviews.slice(third * 2);

  return (
    <section className="bg-background relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[620px] flex-col items-center justify-center"
        >
          <p className="text-on-surface-variant text-xs font-bold">From the community</p>
          <h2 className="mt-3 text-center text-3xl leading-tight font-black sm:text-4xl md:text-6xl">
            Real workplace notes from people who have been inside
          </h2>
          <p className="text-on-surface-variant mt-5 text-center leading-relaxed">
            Anonymous, unfiltered feedback from people who&apos;ve been there. No spin, no PR
            polish.
          </p>
        </motion.div>

        <div
          className="mt-12 flex h-[720px] justify-center gap-6 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          <ReviewsColumn reviews={col1} duration={18} />
          <ReviewsColumn reviews={col2} duration={22} className="hidden md:block" />
          <ReviewsColumn reviews={col3} duration={20} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
