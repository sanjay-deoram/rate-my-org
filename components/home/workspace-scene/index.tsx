import { Building2, ClipboardList, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { PhoneMockup } from "./phone-mockup";
import { StatTile } from "./stat-tile";
import { TopRatedCard } from "./top-rated-card";
import type { WorkspaceSceneProps } from "@/types/workspace-scene";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function WorkspaceScene({ stats, leaderboard, mockupCompany }: WorkspaceSceneProps) {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="bg-token-blue/80 absolute top-6 left-1/2 z-10 hidden h-32 w-32 -translate-x-[520px] rotate-[-12deg] rounded-[1.25rem] lg:block" />
      <div className="absolute top-44 left-1/2 z-10 hidden h-44 w-44 -translate-x-[410px] rotate-[8deg] rounded-full bg-white shadow-xl lg:block" />
      <div className="bg-ink absolute top-60 left-1/2 z-30 hidden h-12 w-28 -translate-x-[345px] rotate-[-18deg] rounded-md lg:block" />
      <div className="bg-ink desk-shadow absolute top-36 left-1/2 z-20 hidden h-52 w-72 -translate-x-[190px] rotate-[-9deg] rounded-[1rem] p-8 text-white lg:block">
        <p className="text-xs text-white/45">RateMyOrg</p>
        <p className="mt-9 text-4xl leading-none font-black">Culture Signal Playbook</p>
      </div>

      <div className="relative z-30 mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="border-border bg-card desk-shadow rounded-[1.5rem] border p-5 md:p-7 lg:rotate-[1.5deg]">
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">Live index</p>
              <h2 className="text-2xl font-black">Workplace pulse</h2>
            </div>
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full">
              <ShieldCheck size={17} />
            </div>
          </div>
          <div className="grid gap-3 py-5 sm:grid-cols-3">
            <StatTile
              icon={MessageSquareText}
              label="Reviews"
              value={formatCount(stats.totalReviews)}
            />
            <StatTile
              icon={Building2}
              label="Companies"
              value={formatCount(stats.totalCompanies)}
            />
            <StatTile
              icon={ClipboardList}
              label="Interviews"
              value={formatCount(stats.totalInterviews)}
            />
          </div>
          <TopRatedCard leaderboard={leaderboard} />
        </div>

        <div className="relative min-h-[610px] lg:min-h-[640px]">
          <PhoneMockup company={mockupCompany} />
          <div className="border-border bg-card soft-shadow absolute right-0 bottom-6 left-2 rounded-[1.25rem] border p-5 sm:right-4 sm:left-20 lg:-right-4 lg:bottom-10 lg:left-24">
            <div className="flex items-center gap-3">
              <div className="bg-token-lime text-on-tertiary-fixed flex h-10 w-10 items-center justify-center rounded-full">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-black">No login wall</p>
                <p className="text-on-surface-variant text-sm">
                  Review, rate, or share interview notes fast.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-10 right-5 hidden h-24 w-24 rounded-full border-[18px] border-black/10 sm:block" />
        </div>
      </div>
    </div>
  );
}

export { SignalMap } from "./signal-map";
