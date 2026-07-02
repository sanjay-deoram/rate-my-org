"use client";

import { X, ChevronDown } from "lucide-react";
import { DropdownRoot, DropdownTrigger, DropdownContent } from "@/components/ui/dropdown";

export function FilterTag({
  label,
  active,
  onClear,
  singleSelect = false,
  children,
}: {
  label: string;
  active?: boolean;
  onClear?: () => void;
  singleSelect?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
          }`}
        >
          {label}
          {active && onClear ? (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="hover:bg-primary-foreground/20 -mr-0.5 rounded-full p-0.5 transition-colors"
            >
              <X size={10} />
            </span>
          ) : (
            <ChevronDown
              size={11}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          )}
        </button>
      </DropdownTrigger>
      <DropdownContent align="start" className="min-w-[180px] py-1">
        {singleSelect ? children : <div className="max-h-52 overflow-y-auto py-0">{children}</div>}
      </DropdownContent>
    </DropdownRoot>
  );
}
