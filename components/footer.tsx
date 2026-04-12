import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Community Guidelines", href: "/guidelines" },
  { label: "Company Index", href: "/orgs" },
  { label: "Support", href: "/support" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-border/20 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="text-lg font-black tracking-tighter mb-6">
            RateMyOrg
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex md:justify-end items-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">
            © 2025 RateMyOrg. The Digital Curator.
          </p>
        </div>
      </div>
    </footer>
  );
}
