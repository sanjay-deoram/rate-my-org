"use client";

import { useState, useRef } from "react";
import { AlertDialog } from "radix-ui";
import {
  Building2,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Upload,
  Loader2,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { timeAgo } from "@/lib/org-display";
import {
  useApproveCompany,
  useRejectCompany,
  useUpdateCompany,
  useUploadCompanyLogo,
} from "@/hooks/use-admin-companies";
import { EditCompanyForm } from "@/components/admin/edit-company-form";
import type { PendingCompany } from "@/lib/api/admin";

const CDN = process.env.NEXT_PUBLIC_LOGO_CDN ?? "";

function logoUrl(key: string) {
  return `${CDN}/${key}`;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
  return (
    <div className="bg-surface-container flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold tracking-tight uppercase">
      {letters}
    </div>
  );
}

interface CompanyCardProps {
  company: PendingCompany;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function CompanyCard({ company, isExpanded, onToggleExpand }: CompanyCardProps) {
  const approve = useApproveCompany();
  const reject = useRejectCompany();
  const update = useUpdateCompany();
  const uploadLogo = useUploadCompanyLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogo.mutate({ id: company.id, file });
    e.target.value = "";
  }

  const actionError =
    approve.error?.message ??
    reject.error?.message ??
    update.error?.message ??
    uploadLogo.error?.message ??
    null;

  return (
    <article className="border-outline-variant/20 bg-surface-container-lowest rounded-xl border p-5">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {company.logoKey ? (
            <img
              src={logoUrl(company.logoKey)}
              alt={company.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <Initials name={company.name} />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLogo.isPending}
            title="Upload logo"
            className="bg-primary text-primary-foreground absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {uploadLogo.isPending ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Upload size={10} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleLogoChange}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold tracking-tight">{company.name}</h3>
          <div className="text-on-surface-variant mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {company.industry && (
              <span className="flex items-center gap-1">
                <Building2 size={11} />
                {company.industry}
              </span>
            )}
            {company.headquarters && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {company.headquarters}
              </span>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Globe size={11} />
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
          <div className="text-on-surface-variant mt-2 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />
              {company.reviewCount} review{company.reviewCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={11} />
              {company.interviewCount} interview{company.interviewCount !== 1 ? "s" : ""}
            </span>
            <span className="text-on-surface-variant/60">
              {timeAgo(new Date(company.createdAt))}
            </span>
          </div>
        </div>
      </div>

      {actionError && <p className="text-destructive mt-3 text-xs">{actionError}</p>}

      {isExpanded && (
        <EditCompanyForm
          company={company}
          onSave={({ id, data }) => update.mutate({ id, data }, { onSuccess: onToggleExpand })}
          onCancel={onToggleExpand}
          isSaving={update.isPending}
        />
      )}

      <div className="border-outline-variant/20 mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-on-surface-variant hover:text-foreground border-outline-variant/30 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
        >
          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {isExpanded ? "Close" : "Edit"}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => approve.mutate(company.id)}
            disabled={approve.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-[#3be366] px-3 py-1.5 text-xs font-semibold text-[#030303] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {approve.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Approve
          </button>

          <AlertDialog.Root open={rejectOpen} onOpenChange={setRejectOpen}>
            <AlertDialog.Trigger asChild>
              <button
                type="button"
                disabled={reject.isPending}
                className="text-destructive border-destructive/30 hover:bg-destructive/5 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reject.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                Reject
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-400 bg-black/50" />
              <AlertDialog.Content className="bg-surface-container-lowest data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-400 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-xl">
                <AlertDialog.Title className="text-foreground font-black tracking-tight">
                  Reject &ldquo;{company.name}&rdquo;?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                  This permanently deletes the company and all{" "}
                  {company.reviewCount + company.interviewCount > 0
                    ? `${company.reviewCount + company.interviewCount} linked submission(s)`
                    : "linked submissions"}
                  . This cannot be undone.
                </AlertDialog.Description>
                <div className="mt-5 flex justify-end gap-2">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      type="button"
                      onClick={() => reject.mutate(company.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      Delete permanently
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </article>
  );
}
