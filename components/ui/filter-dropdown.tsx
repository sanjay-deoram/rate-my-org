"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownClose,
} from "@/components/ui/dropdown";
import type { LucideIcon } from "lucide-react";

export function FilterDropdown({
  icon: Icon,
  label,
  active,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-medium shadow-sm transition-colors sm:px-3.5 sm:py-2 sm:text-sm ${
            active
              ? "border-primary/40 bg-primary/5 text-foreground"
              : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-foreground"
          }`}
        >
          <Icon size={13} className="shrink-0" />
          {label}
          <ChevronDown size={11} className="text-foreground/40 shrink-0" />
        </button>
      </DropdownTrigger>
      <DropdownContent align="start" className="min-w-[150px] py-1">
        <div className="scrollbar-design max-h-[180px] overflow-y-auto">
          {options.map((o) => (
            <DropdownClose key={o.value} asChild>
              <DropdownItem
                className="text-xs"
                active={value === o.value}
                onClick={() => onChange(o.value)}
              >
                {o.label}
              </DropdownItem>
            </DropdownClose>
          ))}
        </div>
      </DropdownContent>
    </DropdownRoot>
  );
}
