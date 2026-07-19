"use client";

import { useState } from "react";
import { Building2, Check, Loader2 } from "lucide-react";
import { useAdminPendingCompanies } from "@/hooks/use-admin-companies";
import { CompanyCard } from "@/components/admin/company-card";

export function PendingCompaniesQueue() {
  const { data, isLoading, isError, error } = useAdminPendingCompanies();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-surface-container flex h-10 w-10 items-center justify-center rounded-lg">
          <Building2 size={18} className="text-on-surface-variant" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">Company Management</h2>
            {data && data.length > 0 && (
              <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase">
                {data.length} pending
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-sm">
            Review, edit, and approve or reject submitted companies.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="border-outline-variant/20 rounded-xl border p-8 text-center">
          <Loader2 size={20} className="text-on-surface-variant mx-auto animate-spin" />
          <p className="text-on-surface-variant mt-3 text-sm">Loading pending companies…</p>
        </div>
      )}

      {isError && (
        <div className="border-outline-variant/20 rounded-xl border p-8 text-center">
          <p className="text-destructive text-sm">
            {(error as Error).message ?? "Failed to load pending companies."}
          </p>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="border-outline-variant/20 rounded-xl border p-8 text-center">
          <Check size={20} className="text-on-surface-variant mx-auto mb-3 opacity-40" />
          <p className="text-on-surface-variant text-sm">No pending companies — queue is clear.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isExpanded={expandedId === company.id}
              onToggleExpand={() => toggleExpand(company.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
