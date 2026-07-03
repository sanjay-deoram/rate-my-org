"use client";

import Link from "next/link";
import { BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import { difficultyLabel, timeAgo } from "@/lib/org-display";

export type InterviewCardData = {
  roleTitle: string;
  department?: string | null;
  difficulty: number;
  overallExperience: string;
  rounds: Array<{ type: string; notes: string }>;
  offerReceived: string;
  createdAt: Date | string;
};
import { EXPERIENCE_BADGE, OFFER_BADGE } from "@/constants/org-content";
import { useExpandable } from "@/hooks/use-expandable";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

function CompanyLogo({
  logoKey,
  name,
}: {
  logoKey: string | null | undefined;
  name: string | undefined;
}) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);

  if (logoKey) {
    return (
      <img
        src={`${CDN}/${logoKey}`}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <div className="bg-surface-container text-on-surface-variant flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-tight uppercase">
      {initials}
    </div>
  );
}

export function InterviewCard({
  interview,
  showKind,
  companyName,
  companySlug,
  companyLogoKey,
}: {
  interview: InterviewCardData;
  showKind?: boolean;
  companyName?: string;
  companySlug?: string;
  companyLogoKey?: string | null;
}) {
  const { expanded, setExpanded, overflows, maxHeight, bodyRef, onTransitionEnd } = useExpandable();

  const difficultyBadge = (
    <div className="bg-surface-container-high rounded px-2 py-0.5">
      <span className="font-mono text-xs font-bold tracking-widest uppercase">
        {difficultyLabel(interview.difficulty)}
      </span>
    </div>
  );

  const offerBadge = (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 ${OFFER_BADGE[interview.offerReceived] ?? "bg-surface-container-high text-on-surface-variant"}`}
    >
      <BadgeCheck size={14} className="fill-current" />
      <span className="text-[10px] font-bold tracking-wider uppercase">
        Offer: {interview.offerReceived}
      </span>
    </div>
  );

  return (
    <article className="bg-surface-container-lowest ring-outline-variant/15 rounded-xl p-5 shadow-lg ring-1 shadow-black/[0.06] sm:p-8 lg:p-10">
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 items-start gap-3">
          {companyLogoKey !== undefined && (
            <CompanyLogo logoKey={companyLogoKey} name={companyName} />
          )}
          <div className="min-w-0">
            {companyName && companySlug ? (
              <Link
                href={`/orgs/${companySlug}`}
                className="text-on-surface-variant hover:text-foreground mb-1 block font-mono text-[11px] font-bold tracking-widest uppercase transition-colors"
              >
                {companyName}
              </Link>
            ) : showKind ? (
              <span className="text-on-surface-variant mb-2 inline-block font-mono text-[10px] tracking-widest uppercase">
                Interview
              </span>
            ) : null}
            <h3 className="mb-1 text-lg font-bold sm:text-xl">{interview.roleTitle}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase ${EXPERIENCE_BADGE[interview.overallExperience] ?? "bg-surface-container-high text-on-surface-variant"}`}
              >
                {interview.overallExperience}
              </span>
              <span className="text-outline-variant font-mono text-sm">·</span>
              <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                {timeAgo(new Date(interview.createdAt))}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4 hidden shrink-0 flex-col items-end gap-1 sm:flex">
          {difficultyBadge}
          {offerBadge}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 sm:hidden">
        {difficultyBadge}
        {offerBadge}
      </div>

      <div className="relative">
        <div
          ref={bodyRef}
          onTransitionEnd={onTransitionEnd}
          style={{
            maxHeight,
            transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="overflow-hidden"
        >
          <div className="mb-5 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full ${i <= interview.difficulty ? "bg-primary" : "bg-surface-container-highest"}`}
              />
            ))}
          </div>
          <div className="space-y-3">
            {interview.rounds.map((round, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center pt-0.5">
                  <div className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  {idx < interview.rounds.length - 1 && (
                    <div
                      className="bg-outline-variant/20 my-1 w-px flex-1"
                      style={{ minHeight: 16 }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <span className="border-foreground/20 text-foreground mb-1.5 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                    {round.type}
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                    {round.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!expanded && overflows && (
          <div className="from-surface-container-lowest pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent" />
        )}
      </div>

      {overflows && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-on-surface-variant hover:text-foreground mt-4 flex items-center gap-1 font-mono text-xs tracking-widest uppercase transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={13} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={13} /> Read more
            </>
          )}
        </button>
      )}
    </article>
  );
}
