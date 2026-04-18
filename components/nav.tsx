"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Browse Orgs", href: "/", match: ["/", "/orgs"] },
  { label: "Reviews", href: "/reviews/write", match: ["/reviews"] },
  { label: "Interviews", href: "/interviews/submit", match: ["/interviews"] },
  { label: "Salaries", href: "/salaries", match: ["/salaries"] },
  { label: "Search", href: "/search", match: ["/search"] },
];

export function Nav() {
  const pathname = usePathname();

  function isActive(match: string[]) {
    return match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
  }

  return (
    <nav className="bg-background/95 border-border/40 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center px-8 py-4">
        <Link href="/" className="text-foreground shrink-0 text-xl font-black tracking-tighter">
          RateMyOrg
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium tracking-tight md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors duration-200",
                  active
                    ? "text-foreground border-foreground border-b-2 pb-0.5 font-bold"
                    : "text-on-surface-variant hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/reviews/write"
            className="text-primary-foreground from-primary to-primary-container rounded-md bg-gradient-to-b px-5 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Post Review
          </Link>
        </div>
      </div>
    </nav>
  );
}
