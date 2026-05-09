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
      <main
        className="min-h-screen pt-20"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 0%, #e2e2e2 0%, #f3f2f2 40%, #fcf9f8 70%)",
        }}
      >
        <section className="mx-auto max-w-3xl px-8 py-24 md:px-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-on-surface-variant mb-4 block font-mono text-[10px] tracking-[0.2em] uppercase">
              Organizational Directory
            </span>
            <h1 className="text-foreground mb-4 text-5xl font-bold tracking-tighter">Companies</h1>
            <p className="text-on-surface-variant max-w-lg text-base leading-relaxed">
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
