"use client";

import Link from "next/link";
import { BadgeCheck, ChevronDown } from "lucide-react";
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
import { useExpandable } from "@/hooks/use-expandable";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

const EXPERIENCE_DOT: Record<string, string> = {
  Great: "bg-tertiary-fixed-dim",
  Neutral: "bg-on-surface-variant",
  Negative: "bg-destructive",
};

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

  return (
    <article className="bg-surface-container-lowest ring-outline-variant/15 rounded-xl p-6 shadow-lg ring-1 shadow-black/[0.06] sm:p-10 lg:p-12">
      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        {companyLogoKey !== undefined && (
          <CompanyLogo logoKey={companyLogoKey} name={companyName} />
        )}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            {companyName && companySlug ? (
              <Link
                href={`/orgs/${companySlug}`}
                className="text-on-surface-variant hover:text-foreground font-mono text-[11px] font-bold tracking-widest uppercase transition-colors"
              >
                {companyName}
              </Link>
            ) : showKind ? (
              <span className="text-on-surface-variant font-mono text-[11px] font-bold tracking-widest uppercase">
                Interview
              </span>
            ) : null}
            <h3 className="mt-1 text-xl leading-tight font-black tracking-tight sm:text-2xl">
              {interview.roleTitle}
            </h3>
            {interview.department && (
              <p className="text-on-surface-variant mt-1 text-sm font-medium">
                {interview.department}
              </p>
            )}
          </div>
          <span className="text-on-surface-variant shrink-0 text-sm">
            {timeAgo(new Date(interview.createdAt))}
          </span>
        </div>
      </div>

      <div className="border-outline-variant/20 mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-y py-3 sm:mb-9">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${EXPERIENCE_DOT[interview.overallExperience] ?? "bg-on-surface-variant"}`}
          />
          <span className="text-sm font-bold">{interview.overallExperience} experience</span>
        </div>
        <span className="text-outline-variant hidden sm:inline">/</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-3 w-1 rounded-full ${i <= interview.difficulty ? "bg-primary" : "bg-surface-container-highest"}`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm font-bold">{difficultyLabel(interview.difficulty)}</span>
        </div>
        <span className="text-outline-variant hidden sm:inline">/</span>
        <div className="flex items-center gap-1.5">
          <BadgeCheck size={15} className="text-on-surface-variant" />
          <span className="text-sm font-bold">Offer: {interview.offerReceived}</span>
        </div>
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
          <div className="divide-outline-variant/15 divide-y">
            {interview.rounds.map((round, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 first:pt-0 sm:grid-cols-[3rem_1fr]"
              >
                <span className="text-outline-variant font-mono text-xs font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="mb-2 text-sm font-black tracking-wide uppercase">{round.type}</p>
                  <p className="text-on-surface-variant text-[15px] leading-relaxed whitespace-pre-wrap">
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
          className="text-on-surface-variant hover:text-foreground mt-4 flex items-center gap-1 text-sm font-bold transition-colors"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  );
}
