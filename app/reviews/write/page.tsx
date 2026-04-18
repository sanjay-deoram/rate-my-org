import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WriteReviewForm, IntegritySidebar } from "@/components/write-review-form";

export const metadata: Metadata = {
  title: "Write a Review",
  description: "Anonymously share your organizational experience. No login required.",
};

export default function WriteReviewPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-16 px-8 py-16 pt-32 md:px-12 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <header className="mb-16">
            <h1 className="text-foreground mb-4 text-5xl font-extrabold tracking-tighter">
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
      </main>
      <Footer />
    </>
  );
}
