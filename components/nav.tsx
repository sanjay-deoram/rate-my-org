"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Companies", href: "/companies", match: ["/companies", "/orgs"] },
  { label: "Reviews", href: "/reviews", match: ["/reviews"] },
  { label: "Interviews", href: "/interviews", match: ["/interviews"] },
  { label: "About", href: "/about", match: ["/about"] },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(match: string[]) {
    return match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
  }

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[min(1120px,calc(100vw-1.5rem))] -translate-x-1/2">
      <div
        className={cn(
          "flex items-center gap-4 rounded-full px-3 py-2 transition-all duration-300",
          (scrolled || menuOpen) &&
            "border-border bg-background/85 border shadow-[0_8px_32px_rgba(5,8,7,0.10)] backdrop-blur-xl",
        )}
      >
        <Link href="/" className="text-foreground flex shrink-0 items-center gap-2">
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
            <Bookmark size={16} fill="currentColor" />
          </span>
          <span className="hidden text-base font-black sm:block">RateMyOrg</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-1.5 transition-all duration-300",
              scrolled
                ? "bg-surface-container shadow-none"
                : "border-border bg-surface-container-lowest border shadow-[0_4px_20px_rgba(5,8,7,0.06)]",
            )}
          >
            {navLinks.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative overflow-hidden rounded-full px-5 py-2 text-sm font-bold transition-colors duration-300",
                    active
                      ? "text-primary-foreground"
                      : "text-on-surface-variant hover:text-primary-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "bg-primary absolute inset-0 origin-left rounded-full transition-transform duration-300 ease-out",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop CTA */}
        <Link
          href="/reviews/write"
          className="bg-token-blue ml-auto hidden h-10 shrink-0 items-center rounded-full px-5 text-sm font-bold text-white shadow-md transition-opacity duration-200 hover:opacity-90 active:scale-[0.97] md:flex"
        >
          Post review
        </Link>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            "text-foreground ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors md:hidden",
            !scrolled && !menuOpen && "bg-surface-container-lowest shadow-sm",
          )}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden">
          <div
            className="border-border bg-background/95 mt-3 rounded-[1.25rem] border p-3 shadow-[0_8px_32px_rgba(5,8,7,0.12)] backdrop-blur-xl"
            role="menu"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.match);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl px-5 py-3.5 text-base font-bold transition-colors duration-300",
                      active
                        ? "text-primary-foreground"
                        : "text-on-surface-variant hover:text-primary-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-primary absolute inset-0 origin-left rounded-xl transition-transform duration-300 ease-out",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/reviews/write"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="bg-token-blue block rounded-xl px-4 py-3.5 text-center text-base font-bold text-white shadow-md transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                Post Review
              </Link>
              <Link
                href="/interviews/submit"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="border-border text-foreground hover:border-primary block rounded-xl border px-4 py-3.5 text-center text-base font-bold transition-colors duration-200 active:scale-[0.98]"
              >
                Post Interview
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
