import { Bookmark, ChevronUp, MinusCircle, PlusCircle } from "lucide-react";
import type { MockupCompany } from "@/types/workspace-scene";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

export function PhoneMockup({ company }: { company: MockupCompany }) {
  const logoSrc = company.logoKey && CDN ? `${CDN}/${company.logoKey}` : null;
  const industry = company.industry ?? "Security software";

  return (
    <div className="border-ink bg-ink desk-shadow absolute top-4 left-1/2 h-[585px] w-[300px] -translate-x-1/2 rotate-[8deg] rounded-[2.35rem] border-[11px] p-2 sm:h-[620px] sm:w-[318px]">
      <div className="bg-background h-full overflow-hidden rounded-[1.7rem]">
        <div className="flex items-center justify-between px-6 pt-4 text-[11px] font-bold">
          <span>9:41</span>
          <span className="bg-ink h-5 w-18 rounded-full" />
        </div>
        <div className="px-4 pt-5 pb-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-ink flex h-8 w-8 items-center justify-center rounded-xl text-white">
                <Bookmark size={15} fill="currentColor" />
              </div>
              <span className="text-base font-black">RateMyOrg</span>
            </div>
            <span className="bg-token-blue rounded-full px-3 py-1 text-[11px] font-bold text-white">
              Post
            </span>
          </div>

          <section className="rounded-2xl bg-white p-3.5 shadow-[0_10px_30px_rgba(5,8,7,0.08)]">
            <div className="flex items-center gap-2.5">
              <div className="bg-paper-soft flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-base font-black">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain p-1.5"
                  />
                ) : (
                  "1P"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl leading-tight font-black">{company.name}</p>
                <p className="text-on-surface-variant text-xs font-semibold">{industry}</p>
              </div>
              <div className="text-right">
                <p className="text-token-green-deep text-3xl leading-none font-black">4.2</p>
                <p className="text-on-surface-variant text-xs font-bold">/ 5.0</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[
                ["87%", "Recommend"],
                ["42", "Reviews"],
                ["11", "Interviews"],
              ].map(([value, label]) => (
                <div key={label} className="bg-paper-soft rounded-xl p-2">
                  <p className="text-base font-black">{value}</p>
                  <p className="text-on-surface-variant text-[9px] font-bold">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-border mt-4 flex gap-4 overflow-hidden border-b">
            {["Reviews", "Both", "Interviews"].map((label, index) => (
              <div
                key={label}
                className={`shrink-0 border-b-2 pb-2 text-xs font-bold ${
                  index === 0 ? "border-ink text-ink" : "text-on-surface-variant border-transparent"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <article className="mt-3 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(5,8,7,0.07)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xl leading-tight font-black">Backend Engineer</p>
                <p className="text-on-surface-variant mt-1 text-[11px] font-bold uppercase">
                  Full time · 29 days ago
                </p>
              </div>
              <div className="bg-ink rounded-lg px-3 py-1.5 text-base font-black text-white">
                5.0
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <PlusCircle size={14} className="text-token-green-deep shrink-0" />
                <p className="text-xs font-black uppercase">Pros</p>
              </div>
              <p className="text-on-surface-variant text-xs leading-5">
                1Password is in a build moment that feels electric. Products, leadership, and people
                are lining up, and the momentum is real.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <MinusCircle size={14} className="text-on-surface-variant shrink-0" />
                <p className="text-on-surface-variant text-xs font-black uppercase">Cons</p>
              </div>
              <p className="text-on-surface-variant text-xs leading-5">
                Priorities move quickly, so it suits people who can make an impact at pace.
              </p>
            </div>

            <div className="text-on-surface-variant mt-3 flex items-center gap-1 text-[11px] font-bold uppercase">
              <ChevronUp size={11} />
              Show less
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
