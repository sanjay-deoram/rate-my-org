import { BadgeCheck } from "lucide-react";
import type { Interview } from "@/types/org-content";
import { difficultyLabel, timeAgo } from "@/lib/org-display";
import { EXPERIENCE_BADGE } from "@/constants/org-content";

export function InterviewCard({
  interview,
  showKind,
}: {
  interview: Interview;
  showKind?: boolean;
}) {
  return (
    <article className="bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 transition-colors duration-500">
      <div className="mb-6 flex items-start justify-between">
        <div>
          {showKind && (
            <span className="text-on-surface-variant mb-2 inline-block font-mono text-[10px] tracking-widest uppercase">
              Interview
            </span>
          )}
          <h3 className="mb-1 text-xl font-bold">{interview.roleTitle}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {interview.department && (
              <>
                <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                  {interview.department}
                </span>
                <span className="text-outline-variant font-mono text-sm">·</span>
              </>
            )}
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
        <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
          <div className="bg-surface-container-high rounded px-3 py-1">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              {difficultyLabel(interview.difficulty)}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#d1fadf] px-3 py-1 text-[#00632d]">
            <BadgeCheck size={14} className="fill-current" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Offer: {interview.offerReceived}
            </span>
          </div>
        </div>
      </div>
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
                <div className="bg-outline-variant/20 my-1 w-px flex-1" style={{ minHeight: 16 }} />
              )}
            </div>
            <div className="flex-1 pb-3">
              <span className="border-foreground/20 text-foreground mb-1.5 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                {round.type}
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed">{round.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
