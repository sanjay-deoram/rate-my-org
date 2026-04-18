import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SubmitInterviewForm, AnonymitySidebar } from "@/components/submit-interview-form";

export const metadata: Metadata = {
  title: "Submit Interview Questions",
  description: "Share interview questions anonymously to help others prepare. No login required.",
};

export default function SubmitInterviewPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-7xl px-8 pt-32 pb-24 md:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <header className="space-y-4">
              <span className="text-on-surface-variant font-mono text-xs tracking-[0.2em] uppercase">
                Contribution Portal
              </span>
              <h1 className="text-foreground text-5xl leading-tight font-bold tracking-[-0.04em]">
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
      </main>
      <Footer />
    </>
  );
}
