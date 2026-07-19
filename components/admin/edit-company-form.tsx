"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { errMsg } from "@/shared/err-msg";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { PendingCompany } from "@/lib/api/admin";

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

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "5,000+"];

const inputCls =
  "border-outline-variant/30 focus:border-primary placeholder:text-on-surface-variant w-full border-b bg-transparent py-2.5 text-base font-medium transition-all outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring";

const labelCls =
  "text-on-surface-variant block text-[10px] font-medium tracking-widest uppercase mb-1";

export interface EditCompanyFormProps {
  company: PendingCompany;
  onSave: (args: { id: string; data: Record<string, string> }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditCompanyForm({ company, onSave, onCancel, isSaving }: EditCompanyFormProps) {
  const form = useForm({
    defaultValues: {
      name: company.name ?? "",
      industry: company.industry ?? "",
      headquarters: company.headquarters ?? "",
      website: company.website ?? "",
      size: company.size ?? "",
      description: company.description ?? "",
    },
    onSubmit: async ({ value }) => {
      const data: Record<string, string> = {};
      if (value.name) data.name = value.name;
      if (value.industry) data.industry = value.industry;
      if (value.headquarters) data.headquarters = value.headquarters;
      if (value.website) data.website = value.website;
      if (value.size) data.size = value.size;
      if (value.description) data.description = value.description;
      onSave({ id: company.id, data });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="border-outline-variant/20 mt-4 space-y-4 border-t pt-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="name" validators={{ onBlur: z.string().min(2, "At least 2 characters") }}>
          {(field) => {
            const hasError = field.state.meta.errors.length > 0;
            return (
              <div>
                <label htmlFor={field.name} className={labelCls}>
                  Company Name
                </label>
                <input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                  className={cn(inputCls, hasError && "border-destructive")}
                  placeholder="Acme Corp"
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

        <form.Field name="industry">
          {(field) => (
            <div>
              <label className={labelCls}>Industry</label>
              <SelectRoot value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                <SelectTrigger onBlur={field.handleBlur}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </div>
          )}
        </form.Field>

        <form.Field name="headquarters" validators={{ onBlur: z.string().min(2, "Required") }}>
          {(field) => {
            const hasError = field.state.meta.errors.length > 0;
            return (
              <div>
                <label htmlFor={field.name} className={labelCls}>
                  Location
                </label>
                <input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                  className={cn(inputCls, hasError && "border-destructive")}
                  placeholder="Toronto, CA"
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

        <form.Field
          name="website"
          validators={{
            onBlur: z.string().refine((v) => v === "" || z.string().url().safeParse(v).success, {
              message: "Enter a valid URL",
            }),
          }}
        >
          {(field) => {
            const hasError = field.state.meta.errors.length > 0;
            return (
              <div>
                <label htmlFor={field.name} className={labelCls}>
                  Website
                </label>
                <input
                  id={field.name}
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                  className={cn(inputCls, hasError && "border-destructive")}
                  placeholder="https://acmecorp.com"
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

        <form.Field name="size">
          {(field) => (
            <div>
              <label className={labelCls}>Company Size</label>
              <SelectRoot value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="description">
        {(field) => (
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
              className={cn(inputCls, "resize-none border-b py-2")}
              placeholder="Brief description of the company…"
            />
          </div>
        )}
      </form.Field>

      <div className="flex items-center gap-2 pt-1">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting || isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Save
            </button>
          )}
        </form.Subscribe>
        <button
          type="button"
          onClick={onCancel}
          className="text-on-surface-variant hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
