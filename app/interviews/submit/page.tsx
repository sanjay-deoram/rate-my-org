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
        <div className="relative z-10 mx-auto max-w-7xl px-8 pt-32 pb-24 md:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <header className="space-y-4">
                <h1 className="text-foreground mb-4 text-5xl font-extrabold tracking-tighter">
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
