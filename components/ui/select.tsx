"use client";

import * as React from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const SelectRoot = Select.Root;
const SelectPortal = Select.Portal;
const SelectGroup = Select.Group;
const SelectValue = Select.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof Select.Trigger> {
  hasError?: boolean;
}

const SelectTrigger = React.forwardRef<React.ElementRef<typeof Select.Trigger>, SelectTriggerProps>(
  ({ className, children, hasError, ...props }, ref) => (
    <Select.Trigger
      ref={ref}
      className={cn(
        "group border-outline-variant/30 focus:border-primary",
        "flex w-full cursor-pointer items-center justify-between border-b bg-transparent py-4",
        "text-sm font-medium transition-all outline-none focus:ring-0",
        "data-[state=open]:border-primary",
        hasError && "border-destructive",
        className,
      )}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <ChevronDown
          size={16}
          className="text-on-surface-variant shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Select.Icon>
    </Select.Trigger>
  ),
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof Select.Content>,
  React.ComponentPropsWithoutRef<typeof Select.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <Select.Portal>
    <Select.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        "bg-surface-container-lowest text-foreground",
        "relative z-50 min-w-32 overflow-hidden rounded-xl shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1",
        className,
      )}
      {...props}
    >
      <Select.Viewport
        className={cn(
          "p-2",
          position === "popper" &&
            "max-h-[min(24rem,var(--radix-select-content-available-height))]",
        )}
      >
        {children}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
  <Select.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer items-center overflow-hidden select-none",
      "rounded-lg py-2.5 pr-4 pl-8 text-sm font-medium outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {/* Wipe animation background */}
    <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-lg transition-transform duration-300 ease-out group-data-[highlighted]:scale-x-100" />
    <span className="group-data-[highlighted]:text-primary-foreground relative left-2 flex size-3.5 items-center justify-center">
      <Select.ItemIndicator>
        <Check size={14} />
      </Select.ItemIndicator>
    </span>
    <Select.ItemText>
      <span className="group-data-[highlighted]:text-primary-foreground relative transition-colors duration-300">
        {children}
      </span>
    </Select.ItemText>
  </Select.Item>
));
SelectItem.displayName = "SelectItem";

export {
  SelectRoot,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectPortal,
};
