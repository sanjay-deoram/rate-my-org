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
    return match.some((m) =>
      m === "/" ? pathname === "/" : pathname.startsWith(m)
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="flex items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-foreground shrink-0"
        >
          RateMyOrg
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight flex-1 justify-center">
          {navLinks.map((link) => {
            const active = isActive(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors duration-200",
                  active
                    ? "text-foreground font-bold border-b-2 border-foreground pb-0.5"
                    : "text-on-surface-variant hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/reviews/write"
            className="px-5 py-2 text-sm font-medium text-primary-foreground bg-gradient-to-b from-primary to-primary-container rounded-md shadow-sm transition-all duration-200 active:scale-[0.98] hover:opacity-90"
          >
            Post Review
          </Link>
        </div>
      </div>
    </nav>
  );
}
