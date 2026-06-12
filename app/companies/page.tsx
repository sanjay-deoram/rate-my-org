import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CompaniesDirectory } from "@/components/companies-directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies — RateMyOrg",
  description:
    "Search through thousands of curated workplace reports, structural analyses, and anonymous employee testimonies.",
};

export default function CompaniesPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-20">
        <section className="mx-auto max-w-5xl px-8 py-12 md:px-12 md:py-24">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <span className="text-on-surface-variant mb-3 block font-mono text-[10px] tracking-[0.2em] uppercase">
              Organizational Directory
            </span>
            <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tighter md:text-5xl">
              Companies
            </h1>
            <p className="text-on-surface-variant max-w-lg text-sm leading-relaxed md:text-base">
              Search through curated workplace reports, structural analyses, and anonymous employee
              testimonies.
            </p>
          </div>

          <CompaniesDirectory />
        </section>
      </main>
      <Footer />
    </>
  );
}
