"use client";

import { useForm } from "@tanstack/react-form";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useCreateCompany } from "@/hooks/use-create-company";
import { errMsg } from "@/shared/err-msg";
import type { CreatedCompany } from "@/lib/api/companies";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Retail & E-commerce",
  "Manufacturing",
  "Education",
  "Media & Entertainment",
  "Government & Public Sector",
  "Non-profit",
  "Consulting & Professional Services",
  "Real Estate",
  "Transportation & Logistics",
  "Food & Beverage",
  "Energy & Utilities",
  "Telecommunications",
  "Other",
];

const inputCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant/40 w-full border-b bg-transparent py-3 font-medium transition-all outline-none focus:ring-0 text-sm";

const labelCls = "text-on-surface-variant block text-xs font-medium tracking-widest uppercase mb-1";

interface AddOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyCreated: (company: Pick<CreatedCompany, "slug" | "name">) => void;
  initialName?: string;
}

export function AddOrganizationModal({
  open,
  onOpenChange,
  onCompanyCreated,
  initialName = "",
}: AddOrganizationModalProps) {
  const createCompany = useCreateCompany((company: CreatedCompany) => {
    onCompanyCreated({ slug: company.slug, name: company.name });
    onOpenChange(false);
  });

  const form = useForm({
    defaultValues: {
      name: initialName,
      headquarters: "",
      industry: "",
      website: "",
    },
    onSubmit: async ({ value }) => {
      await createCompany.mutateAsync({
        name: value.name,
        headquarters: value.headquarters,
        industry: value.industry,
        website: value.website || undefined,
      });
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      createCompany.reset();
    }
    onOpenChange(next);
  }

  const serverError =
    createCompany.isError && createCompany.error ? (createCompany.error as Error).message : null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-400 bg-black/50" />
        <Dialog.Content
          className={cn(
            "bg-surface-container-lowest fixed top-1/2 left-1/2 z-400 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-8 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Dialog.Title className="text-foreground text-xl font-black tracking-tight">
                Add Organization
              </Dialog.Title>
              <Dialog.Description className="text-on-surface-variant mt-1 text-sm">
                Can&apos;t find it? Add it — it&apos;ll be reviewed before going live.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-on-surface-variant hover:text-foreground -mt-1 -mr-2 rounded-lg p-2 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Company Name */}
            <form.Field
              name="name"
              validators={{ onBlur: z.string().min(2, "Name must be at least 2 characters") }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelCls}>
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Acme Corp"
                    className={cn(
                      inputCls,
                      field.state.meta.errors.length > 0 && "border-destructive",
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive mt-1 text-xs">
                      {errMsg(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Industry */}
            <form.Field
              name="industry"
              validators={{ onBlur: z.string().min(1, "Please select an industry") }}
            >
              {(field) => (
                <div>
                  <label className={labelCls}>
                    Industry <span className="text-destructive">*</span>
                  </label>
                  <SelectRoot
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                  >
                    <SelectTrigger
                      hasError={field.state.meta.errors.length > 0}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive mt-1 text-xs">
                      {errMsg(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Location */}
            <form.Field
              name="headquarters"
              validators={{ onBlur: z.string().min(2, "Location is required") }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelCls}>
                    Location <span className="text-destructive">*</span>
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Toronto, CA"
                    className={cn(
                      inputCls,
                      field.state.meta.errors.length > 0 && "border-destructive",
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive mt-1 text-xs">
                      {errMsg(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Website */}
            <form.Field
              name="website"
              validators={{
                onBlur: z
                  .string()
                  .refine((v) => v === "" || z.string().url().safeParse(v).success, {
                    message: "Enter a valid URL",
                  }),
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelCls}>
                    Website <span className="text-on-surface-variant/50">(optional)</span>
                  </label>
                  <input
                    id={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="https://acmecorp.com"
                    className={cn(
                      inputCls,
                      field.state.meta.errors.length > 0 && "border-destructive",
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive mt-1 text-xs">
                      {errMsg(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {serverError && <p className="text-destructive rounded-lg text-sm">{serverError}</p>}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createCompany.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 w-full rounded-xl py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting || createCompany.isPending ? "Adding…" : "Add Organization"}
                </button>
              )}
            </form.Subscribe>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
