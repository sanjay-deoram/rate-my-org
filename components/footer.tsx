import Link from "next/link";

const footerLinks = [
  { label: "Companies", href: "/companies" },
  { label: "Reviews", href: "/reviews" },
  { label: "Interviews", href: "/interviews" },
  { label: "About", href: "/about" },
];

export function Footer() {
  return (
    <footer className="border-border bg-surface-container-low mt-auto border-t py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-2 md:px-8">
        <div>
          <div className="mb-5 text-lg font-black">RateMyOrg</div>
          <p className="text-on-surface-variant mb-6 max-w-sm text-sm leading-6">
            Anonymous workplace reviews and interview reports for candidates who want the real story
            before they apply.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-foreground text-sm font-bold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center md:justify-end">
          <p className="text-on-surface-variant font-mono text-xs">
            © 2026 RateMyOrg. Anonymous by default.
          </p>
        </div>
      </div>
    </footer>
  );
}
