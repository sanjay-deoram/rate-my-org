"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownRoot = Popover.Root;

const DropdownTrigger = Popover.Trigger;

const DropdownClose = Popover.Close;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, sideOffset = 6, align = "end", ...props }, ref) => (
  <Popover.Portal>
    <Popover.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "bg-surface-container-lowest border-outline-variant/20",
        "z-20 overflow-hidden rounded-xl border shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </Popover.Portal>
));
DropdownContent.displayName = "DropdownContent";

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, active, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "group relative flex w-full cursor-pointer items-center overflow-hidden select-none",
        "rounded-lg py-2.5 pr-4 pl-8 text-sm transition-colors outline-none",
        active ? "text-foreground font-medium" : "text-on-surface-variant",
        className,
      )}
      {...props}
    >
      <div className="bg-primary absolute inset-0 origin-left scale-x-0 rounded-lg transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      <span className="group-focus-visible:text-primary-foreground group-hover:text-primary-foreground absolute left-2 flex size-3.5 items-center justify-center">
        {active && <Check size={14} className="relative" />}
      </span>
      <span className="group-hover:text-primary-foreground group-focus-visible:text-primary-foreground relative transition-colors duration-300">
        {children}
      </span>
    </button>
  ),
);
DropdownItem.displayName = "DropdownItem";

export { DropdownRoot, DropdownTrigger, DropdownClose, DropdownContent, DropdownItem };
