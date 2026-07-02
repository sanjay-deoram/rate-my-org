import Link from "next/link";
import { X, CheckCircle } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DecorativeShapes } from "@/components/decorative-shapes";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-background relative min-h-screen overflow-hidden pt-20">
        <DecorativeShapes variant="about" />
        {/* Hero */}
        <section className="relative z-10 flex min-h-[60vh] flex-col justify-center px-8 pt-32 pb-24 md:px-12">
          <div className="ml-[clamp(0rem,8vw,10rem)] max-w-4xl">
            <p className="mb-6 font-mono text-xs tracking-widest uppercase opacity-60">
              Authority: Absolute. Status: Operational.
            </p>
            <h1 className="mb-8 text-7xl leading-[0.9] font-black tracking-tighter md:text-8xl">
              The Archive <br /> of Truth.
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-xl leading-relaxed md:text-2xl">
              RateMyOrg is the digital curator of the modern workspace. We preserve the honest voice
              of the professional, unedited and uninfluenced by corporate interests.
            </p>
          </div>
        </section>

        {/* The Difference */}
        <section className="bg-background relative z-10 px-8 py-32 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-20 ml-[clamp(0rem,8vw,10rem)]">
              <h2 className="mb-4 text-5xl font-bold tracking-tight">The Difference</h2>
              <p className="text-on-surface-variant text-lg">A binary comparison of integrity.</p>
            </div>
            <div className="border-outline-variant/30 grid grid-cols-1 border md:grid-cols-2">
              {/* Glassdoor */}
              <div className="bg-surface-container border-outline-variant/30 flex flex-col border-b p-12 md:border-r md:border-b-0 lg:p-20">
                <span className="text-on-surface-variant mb-8 font-mono text-xs tracking-widest uppercase">
                  Status Quo
                </span>
                <h3 className="mb-12 text-4xl font-bold">Glassdoor</h3>
                <ul className="space-y-10">
                  <li className="flex items-start gap-4">
                    <X className="text-error mt-0.5 shrink-0" size={22} />
                    <div>
                      <span className="block font-bold">Removable Reviews</span>
                      <p className="text-on-surface-variant mt-1">
                        Employers can flag and request removal of critical sentiment.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <X className="text-error mt-0.5 shrink-0" size={22} />
                    <div>
                      <span className="block font-bold">Paid Influence</span>
                      <p className="text-on-surface-variant mt-1">
                        Premium profiles allow companies to bury negative feedback.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <X className="text-error mt-0.5 shrink-0" size={22} />
                    <div>
                      <span className="block font-bold">Compromised Identity</span>
                      <p className="text-on-surface-variant mt-1">
                        User data is stored and potentially exposed to legal subpoenas.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* RateMyOrg */}
              <div className="bg-primary text-on-primary flex flex-col p-12 lg:p-20">
                <span className="mb-8 font-mono text-xs tracking-widest text-white uppercase">
                  The Alternative
                </span>
                <h3 className="mb-12 text-4xl font-bold text-white">RateMyOrg</h3>
                <ul className="space-y-10">
                  <li className="flex items-start gap-4">
                    <CheckCircle
                      className="fill-tertiary-fixed-dim text-primary mt-0.5 shrink-0"
                      size={22}
                    />
                    <div>
                      <span className="block font-bold text-white">Permanent Record</span>
                      <p className="mt-1 text-white/70">
                        Zero tolerance for review removal. The truth is never deleted.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle
                      className="fill-tertiary-fixed-dim text-primary mt-0.5 shrink-0"
                      size={22}
                    />
                    <div>
                      <span className="block font-bold text-white">No Paid Ratings</span>
                      <p className="mt-1 text-white/70">
                        We have no business portal. Companies cannot buy a better score.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle
                      className="fill-tertiary-fixed-dim text-primary mt-0.5 shrink-0"
                      size={22}
                    />
                    <div>
                      <span className="block font-bold text-white">True Anonymity</span>
                      <p className="mt-1 text-white/70">
                        We don&apos;t store what we can&apos;t protect. Radical fragmentation by
                        design.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Anonymity Protocol */}
        <section className="bg-surface-container-low relative z-10 overflow-hidden px-8 py-32 md:px-12">
          <div
            aria-hidden
            className="bg-token-lime/60 absolute right-10 bottom-10 hidden h-28 w-72 rotate-[4deg] rounded-[1rem] lg:block"
          />
          <div className="mx-auto ml-[clamp(0rem,8vw,10rem)] max-w-[1600px]">
            <div className="max-w-3xl">
              <h2 className="mb-8 text-4xl font-bold tracking-tighter">Anonymity Protocol</h2>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div>
                  <h4 className="mb-4 font-mono text-xs tracking-widest uppercase opacity-60">
                    01 / Vapor-Trace
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    Employment is verified via single-use encrypted tokens. Once verified, the link
                    is destroyed. We store zero personal identifiers.
                  </p>
                </div>
                <div>
                  <h4 className="mb-4 font-mono text-xs tracking-widest uppercase opacity-60">
                    02 / Safe Harbor
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    Headquartered in a jurisdiction with absolute whistleblower protection. We do
                    not comply with corporate subpoenas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background relative z-10 px-8 py-48 text-center md:px-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-5xl font-black tracking-tighter md:text-7xl">
              Contribute to the Ledger.
            </h2>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/reviews/write"
                className="from-primary to-primary-container rounded-lg bg-gradient-to-b px-10 py-5 font-bold tracking-tight text-white transition-transform active:scale-95"
              >
                Submit a Review
              </Link>
              <Link
                href="/companies"
                className="bg-surface-container-highest text-on-surface hover:bg-surface-container-high rounded-lg px-10 py-5 font-bold tracking-tight transition-all active:scale-95"
              >
                Explore the Archive
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
