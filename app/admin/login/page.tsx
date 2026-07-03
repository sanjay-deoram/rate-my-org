import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { AdminLoginForm } from "@/components/admin-login-form";
import { DecorativeShapes } from "@/components/decorative-shapes";

export const metadata: Metadata = {
  title: "Admin — RateMyOrg",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <DecorativeShapes variant="admin" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="text-outline mb-6 font-mono text-xs tracking-widest uppercase">RateMyOrg</p>
          <div className="bg-surface-container-low mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full">
            <Lock size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Administrator Access</h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            Restricted to authorized personnel only.
          </p>
        </div>

        <div className="bg-surface-container-lowest border-outline-variant/20 rounded-xl border p-8">
          <AdminLoginForm />
        </div>

        <p className="text-on-surface-variant mt-6 text-center text-xs">
          This area is not publicly accessible.
        </p>
      </div>
    </main>
  );
}
