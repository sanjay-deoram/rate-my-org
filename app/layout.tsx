import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RateMyOrg — Uncover the Truth About Your Next Workplace",
    template: "%s | RateMyOrg",
  },
  description:
    "Anonymously rate organizations, read real reviews, and discover honest interview experiences. No login required.",
  keywords: [
    "company reviews",
    "anonymous reviews",
    "interview questions",
    "workplace culture",
    "salary data",
  ],
  openGraph: {
    siteName: "RateMyOrg",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, ibmPlexMono.variable, "antialiased")}>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
