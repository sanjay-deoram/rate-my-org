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
    <footer className="bg-surface-container-low border-border/20 mt-auto border-t py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 md:grid-cols-2">
        <div>
          <div className="mb-6 text-lg font-black tracking-tighter">RateMyOrg</div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-foreground text-[10px] font-medium tracking-widest uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center md:justify-end">
          <p className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">
            © 2025 RateMyOrg. The Digital Curator.
          </p>
        </div>
      </div>
    </footer>
  );
}
