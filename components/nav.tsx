"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Companies", href: "/companies", match: ["/companies", "/orgs"] },
  { label: "Reviews", href: "/reviews/write", match: ["/reviews"] },
  { label: "Interviews", href: "/interviews/submit", match: ["/interviews"] },
];

export function Nav() {
  const pathname = usePathname();

  function isActive(match: string[]) {
    return match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
  }

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[min(1100px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="flex items-center gap-4 px-2">
        <Link href="/" className="text-foreground shrink-0 text-xl font-black tracking-tighter">
          RateMyOrg
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="bg-surface-container-lowest flex items-center gap-0.5 rounded-full px-1.5 py-1.5 shadow-[0_4px_20px_rgba(27,27,27,0.10)]">
            {navLinks.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative overflow-hidden rounded-full px-5 py-1.5 text-sm font-medium transition-colors duration-300",
                    active
                      ? "text-primary-foreground"
                      : "text-on-surface-variant hover:text-primary-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "bg-primary absolute inset-0 origin-left rounded-full shadow-sm transition-transform duration-300 ease-out",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href="/reviews/write"
          className="from-primary to-primary-container text-primary-foreground ml-auto shrink-0 rounded-full bg-gradient-to-b px-6 py-2 text-sm font-semibold shadow-md transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
        >
          Post Review
        </Link>
      </div>
    </nav>
  );
}
