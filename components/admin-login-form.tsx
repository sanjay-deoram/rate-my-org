"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { errMsg } from "@/shared/err-msg";

const inputCls =
  "border-outline-variant/30 focus:border-primary focus-visible:border-b-2 placeholder:text-on-surface-variant w-full border-b bg-transparent py-4 font-medium transition-all outline-none";

export function AdminLoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value.password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setServerError(data.error ?? "Authentication failed");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <form.Field
        name="password"
        validators={{ onSubmit: z.string().min(1, "Password is required") }}
      >
        {(field) => {
          const hasError = field.state.meta.errors.length > 0;
          return (
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-on-surface-variant block font-mono text-xs tracking-widest uppercase"
              >
                Administrator Password
              </label>
              <input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="••••••••••••"
                autoComplete="current-password"
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? `${field.name}-error` : undefined}
                className={cn(inputCls, hasError && "border-destructive")}
              />
              {field.state.meta.errors[0] && (
                <p id={`${field.name}-error`} role="alert" className="text-destructive text-xs">
                  {errMsg(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {serverError && (
        <div className="bg-destructive/10 flex items-center gap-2 rounded-lg px-4 py-3">
          <ShieldAlert size={16} className="text-destructive shrink-0" />
          <p className="text-destructive text-sm">{serverError}</p>
        </div>
      )}

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="from-primary to-primary-container text-primary-foreground w-full rounded-md bg-linear-to-b px-8 py-4 font-bold tracking-tight transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Access Panel"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
