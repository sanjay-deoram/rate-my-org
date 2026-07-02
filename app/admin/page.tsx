import type { Metadata } from "next";
import { Flag, FileText, ShieldAlert } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { PendingCompaniesQueue } from "@/components/pending-companies-queue";

export const metadata: Metadata = {
  title: "Admin Dashboard — RateMyOrg",
  robots: { index: false, follow: false },
};

const comingSoon = [
  {
    icon: Flag,
    label: "Moderation Queue",
    description: "Review flagged content and community reports.",
  },
  {
    icon: FileText,
    label: "Content Removal",
    description: "Delete individual reviews or interviews that violate guidelines.",
  },
  {
    icon: ShieldAlert,
    label: "Abuse Log",
    description: "Browse rejected submissions to identify spam patterns.",
  },
];

export default function AdminPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Top bar */}
      <header className="border-outline-variant/20 bg-surface-container-lowest sticky top-0 z-10 border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-outline font-mono text-[10px] tracking-widest uppercase">
              RateMyOrg
            </span>
            <span className="bg-outline-variant/30 h-3 w-px" />
            <span className="text-sm font-bold tracking-tight">Admin Panel</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      {/* Dashboard */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tighter">Dashboard</h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            Manage content, companies, and platform integrity.
          </p>
        </div>

        {/* Coming-soon cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {comingSoon.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="border-outline-variant/20 bg-surface-container-lowest rounded-xl border p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-surface-container flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon size={18} className="text-on-surface-variant" />
                </div>
                <span className="bg-surface-container text-on-surface-variant rounded-full px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">
                  Coming soon
                </span>
              </div>
              <h2 className="mb-1 font-bold tracking-tight">{label}</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Pending companies queue */}
        <div className="mt-12">
          <PendingCompaniesQueue />
        </div>
      </main>
    </div>
  );
}
