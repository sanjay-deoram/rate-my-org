import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  SubmitInterviewForm,
  AnonymitySidebar,
} from "@/components/submit-interview-form";

export const metadata: Metadata = {
  title: "Submit Interview Questions",
  description:
    "Share interview questions anonymously to help others prepare. No login required.",
};

export default function SubmitInterviewPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 px-8 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <header className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Contribution Portal
              </span>
              <h1 className="text-5xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                Document Your
                <br />
                Interview Experience
              </h1>
              <p className="text-on-surface-variant text-lg max-w-xl">
                Help the community by providing high-fidelity details about
                organizational recruitment processes.
              </p>
            </header>
            <SubmitInterviewForm />
          </div>

          <AnonymitySidebar />
        </div>
      </main>
      <Footer />
    </>
  );
}
