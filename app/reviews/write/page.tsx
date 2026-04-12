import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  WriteReviewForm,
  IntegritySidebar,
} from "@/components/write-review-form";

export const metadata: Metadata = {
  title: "Write a Review",
  description:
    "Anonymously share your organizational experience. No login required.",
};

export default function WriteReviewPage() {
  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-8 md:px-12 py-16 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-16 min-h-screen">
        <section className="lg:col-span-8">
          <header className="mb-16">
            <h1 className="text-5xl font-extrabold tracking-tighter text-foreground mb-4">
              Share Your Organizational Experience
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              Your anonymous feedback serves as the definitive record for the
              next generation of talent. Contribute to the archive with
              precision.
            </p>
          </header>
          <WriteReviewForm />
        </section>

        <IntegritySidebar />
      </main>
      <Footer />
    </>
  );
}
