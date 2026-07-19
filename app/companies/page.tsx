import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CompaniesDirectory } from "@/components/companies-directory";
import { DecorativeShapes } from "@/components/decorative-shapes";
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
      <main className="relative min-h-screen overflow-hidden pt-20">
        <DecorativeShapes variant="directory" />
        <section className="relative z-10 mx-auto max-w-5xl px-5 py-20 md:px-12 md:py-24">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <span className="text-on-surface-variant mb-3 block font-mono text-[10px] tracking-widest uppercase">
              Organizational Directory
            </span>
            <h1 className="text-foreground mb-3 text-3xl font-black md:text-5xl">Companies</h1>
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
