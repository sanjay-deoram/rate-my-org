"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { TopRatedCompany } from "@/types/homepage";

interface HomeCarouselProps {
  companies: TopRatedCompany[];
}

export function HomeCarousel({ companies }: HomeCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const filtered = companies.filter((c) => c.latestHeadline?.trim());

  // Tile to at least 15 items so Embla always has enough snap positions
  const MIN_ITEMS = 15;
  const items =
    filtered.length === 0
      ? []
      : Array.from({ length: Math.ceil(MIN_ITEMS / filtered.length) }, (_, i) =>
          filtered.map((c, j) => ({ ...c, _key: `${i}-${j}` })),
        ).flat();

  useEffect(() => {
    if (!api || paused) return;

    const timer = setTimeout(() => {
      api.scrollNext();
      setCurrent((c) => c + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [api, current, paused]);

  if (items.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {items.map((company) => (
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4" key={company._key}>
              <CarouselCard company={company} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function CarouselCard({ company }: { company: TopRatedCompany }) {
  const { slug, name, industry, logoKey, avgRating, reviewCount, latestHeadline } = company;
  const cdnBase = process.env.NEXT_PUBLIC_LOGO_CDN;
  const logoSrc = logoKey && cdnBase ? `${cdnBase}/${logoKey}` : null;

  return (
    <div className="bg-surface-container-lowest border-surface-container-highest flex h-full flex-col gap-3 rounded-xl border p-6">
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

      <p className="text-on-surface-variant line-clamp-2 flex-1 text-sm italic">
        {latestHeadline ?? "No reviews yet"}
      </p>

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
