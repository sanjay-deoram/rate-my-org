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
import { INDUSTRIES } from "@/constants";

const inputCls =
  "border-outline-variant/30 focus:border-primary focus-visible:border-b-2 placeholder:text-on-surface-variant w-full border-b bg-transparent py-3 font-medium transition-all outline-none text-base";

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
            "bg-surface-container-lowest fixed top-1/2 left-1/2 z-400 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-xl sm:p-8",
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
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
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
                      aria-invalid={hasError || undefined}
                      aria-describedby={hasError ? `${field.name}-error` : undefined}
                      className={cn(inputCls, hasError && "border-destructive")}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-destructive mt-1 text-xs"
                      >
                        {errMsg(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Industry */}
            <form.Field
              name="industry"
              validators={{ onBlur: z.string().min(1, "Please select an industry") }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <div>
                    <label htmlFor={field.name} className={labelCls}>
                      Industry <span className="text-destructive">*</span>
                    </label>
                    <SelectRoot
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val)}
                    >
                      <SelectTrigger
                        id={field.name}
                        hasError={hasError}
                        onBlur={field.handleBlur}
                        aria-invalid={hasError || undefined}
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
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
                      <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-destructive mt-1 text-xs"
                      >
                        {errMsg(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Location */}
            <form.Field
              name="headquarters"
              validators={{ onBlur: z.string().min(2, "Location is required") }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
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
                      aria-invalid={hasError || undefined}
                      aria-describedby={hasError ? `${field.name}-error` : undefined}
                      className={cn(inputCls, hasError && "border-destructive")}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-destructive mt-1 text-xs"
                      >
                        {errMsg(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                );
              }}
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
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
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
                      aria-invalid={hasError || undefined}
                      aria-describedby={hasError ? `${field.name}-error` : undefined}
                      className={cn(inputCls, hasError && "border-destructive")}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-destructive mt-1 text-xs"
                      >
                        {errMsg(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                );
              }}
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
