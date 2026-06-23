"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
    <nav className="fixed top-4 left-1/2 z-50 w-[min(1100px,calc(100vw-2rem))] -translate-x-1/2">
      <div
        className={cn(
          "flex items-center gap-4 px-2 transition-all duration-300",
          (scrolled || menuOpen) &&
            "border-border/20 bg-background/75 rounded-full border px-4 py-2 shadow-[0_8px_32px_rgba(27,27,27,0.10)] backdrop-blur-xl",
        )}
      >
        <Link href="/" className="text-foreground shrink-0 text-xl font-black tracking-tighter">
          RateMyOrg
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-1.5 transition-all duration-300",
              scrolled
                ? "bg-surface-container shadow-none"
                : "bg-surface-container-lowest shadow-[0_4px_20px_rgba(27,27,27,0.10)]",
            )}
          >
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

        {/* Desktop CTA */}
        <Link
          href="/reviews/write"
          className="from-primary to-primary-container text-primary-foreground ml-auto hidden shrink-0 rounded-full bg-gradient-to-b px-6 py-2 text-sm font-semibold shadow-md transition-opacity duration-200 hover:opacity-90 active:scale-[0.97] md:block"
        >
          Post Review
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
            className="border-border/20 bg-background/90 mt-3 rounded-3xl border p-3 shadow-[0_8px_32px_rgba(27,27,27,0.12)] backdrop-blur-xl"
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
                      "group relative overflow-hidden rounded-2xl px-5 py-3.5 text-base font-medium transition-colors duration-300",
                      active
                        ? "text-primary-foreground"
                        : "text-on-surface-variant hover:text-primary-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-primary absolute inset-0 origin-left rounded-2xl transition-transform duration-300 ease-out",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/reviews/write"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="from-primary to-primary-container text-primary-foreground mt-2 block rounded-2xl bg-gradient-to-b px-5 py-3.5 text-center text-base font-semibold shadow-md transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Post Review
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
