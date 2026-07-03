import { BadgeCheck, BriefcaseBusiness } from "lucide-react";

const withCards = [
  ["Confident", "Reviews show the real work"],
  ["Prepared", "Interview rounds are visible"],
  ["Selective", "Tradeoffs are easier to compare"],
  ["Committed", "Candidates know what they accept"],
] as const;

const withoutCards = ["Unclear", "Surprised", "Second guessing", "Churn risk"] as const;

export function SignalMap() {
  return (
    <div className="space-y-4">
      <div className="text-token-blue flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-black">
          <BadgeCheck size={18} />
          With RateMyOrg
        </div>
        <span className="text-sm font-bold">More informed</span>
      </div>
      <div className="border-token-blue bg-token-blue/10 grid overflow-hidden rounded-xl border sm:grid-cols-4">
        {withCards.map(([label, note], i) => (
          <div key={label} className="border-token-blue/20 p-4 sm:border-r sm:last:border-r-0">
            <div className="bg-token-lime mb-6 flex h-9 w-9 items-center justify-center rounded-full font-black">
              {i + 1}
            </div>
            <p className="font-black">{label}</p>
            <p className="text-on-surface-variant mt-2 text-xs leading-5">{note}</p>
          </div>
        ))}
      </div>
      <div className="bg-paper-soft grid overflow-hidden rounded-xl sm:grid-cols-4">
        {withoutCards.map((label) => (
          <div key={label} className="border-border p-4 sm:border-r sm:last:border-r-0">
            <div className="border-outline-variant mb-6 h-9 w-9 rounded-full border" />
            <p className="text-on-surface-variant text-sm font-bold">{label}</p>
          </div>
        ))}
      </div>
      <div className="text-destructive flex items-start gap-2">
        <BriefcaseBusiness size={16} />
        <span className="text-sm font-black">Without shared workplace signal</span>
      </div>
    </div>
  );
}
