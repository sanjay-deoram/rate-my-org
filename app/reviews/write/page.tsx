import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WriteReviewForm, IntegritySidebar } from "@/components/write-review-form";
import { DecorativeShapes } from "@/components/decorative-shapes";

export const metadata: Metadata = {
  title: "Write a Review",
  description: "Anonymously share your organizational experience. No login required.",
};

export default function WriteReviewPage() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen overflow-hidden">
        <DecorativeShapes variant="form" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-12 pt-28 md:px-12 md:py-16 md:pt-32 lg:grid-cols-12 lg:gap-16">
          <section className="min-w-0 lg:col-span-8">
            <header className="mb-16">
              <h1 className="text-foreground mb-4 text-4xl font-extrabold sm:text-5xl">
                Share Your Organizational Experience
              </h1>
              <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                Your anonymous feedback serves as the definitive record for the next generation of
                talent. Contribute to the archive with precision.
              </p>
            </header>
            <WriteReviewForm />
          </section>

          <IntegritySidebar />
        </div>
      </main>
      <Footer />
    </>
  );
}
