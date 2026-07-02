import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SubmitInterviewForm, AnonymitySidebar } from "@/components/submit-interview-form";
import { DecorativeShapes } from "@/components/decorative-shapes";

export const metadata: Metadata = {
  title: "Submit Interview Questions",
  description: "Share interview questions anonymously to help others prepare. No login required.",
};

export default function SubmitInterviewPage() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen overflow-hidden">
        <DecorativeShapes variant="form" className="scale-x-[-1]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 space-y-12 lg:col-span-8">
              <header className="space-y-4">
                <h1 className="text-foreground mb-4 text-4xl font-extrabold sm:text-5xl">
                  Document Your
                  <br />
                  Interview Experience
                </h1>
                <p className="text-on-surface-variant max-w-xl text-lg">
                  Help the community by providing high-fidelity details about organizational
                  recruitment processes.
                </p>
              </header>
              <SubmitInterviewForm />
            </div>

            <AnonymitySidebar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
