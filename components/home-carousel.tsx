"use client";

import { useRef } from "react";
import Link from "next/link";
import type { TopRatedCompany } from "@/types/homepage";

interface HomeCarouselProps {
  companies: TopRatedCompany[];
}

export function HomeCarousel({ companies }: HomeCarouselProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const filtered = companies.filter((c) => c.latestHeadline?.trim());

  if (filtered.length === 0) return null;

  const items = [...filtered, ...filtered];

  function handleMouseEnter() {
    if (stripRef.current) {
      stripRef.current.style.animationPlayState = "paused";
    }
  }

  function handleMouseLeave() {
    if (stripRef.current) {
      stripRef.current.style.animationPlayState = "running";
    }
  }

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-strip {
          animation: carousel-scroll 35s linear infinite;
        }
      `}</style>

      <div ref={stripRef} className="carousel-strip flex">
        {items.map((company, index) => (
          <CarouselCard key={`${company.slug}-${index}`} company={company} />
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ company }: { company: TopRatedCompany }) {
  const { slug, name, industry, logoKey, avgRating, reviewCount, latestHeadline } = company;
  const cdnBase = process.env.NEXT_PUBLIC_LOGO_CDN;
  const logoSrc = logoKey && cdnBase ? `${cdnBase}/${logoKey}` : null;

  return (
    <div className="bg-surface-container-lowest border-surface-container-highest mr-4 flex min-w-[300px] flex-col gap-3 rounded-xl border p-6">
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className="bg-surface-container flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {logoSrc ? (
            <img src={logoSrc} alt={`${name} logo`} className="h-full w-full object-contain" />
          ) : (
            <span className="text-primary text-lg leading-none font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-primary truncate leading-tight font-bold">{name}</p>
          {industry && <p className="text-on-surface-variant truncate text-xs">{industry}</p>}
        </div>
        {avgRating && (
          <div className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#3be366]/15 px-2 py-0.5 text-xs font-semibold text-[#1a8a3d]">
            <span>★</span>
            <span>{parseFloat(avgRating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Quote */}
      <p className="text-on-surface-variant line-clamp-2 flex-1 text-sm italic">
        {latestHeadline ?? "No reviews yet"}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-on-surface-variant text-xs">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
        <Link href={`/orgs/${slug}`} className="text-primary text-xs font-bold hover:underline">
          View profile →
        </Link>
      </div>
    </div>
  );
}
