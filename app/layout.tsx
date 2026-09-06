import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Madison Hill Nails | Nail Salon in Madison, NJ",
    template: "%s | Madison Hill Nails",
  },
  description:
    "A little color. A little time for you. Visit Madison Hill Nails at 349 Main St in Madison, New Jersey, and plan your next nail appointment.",
  robots: {
    index: process.env.SITE_INDEXABLE === "true",
    follow: process.env.SITE_INDEXABLE === "true",
  },
  openGraph: {
    title: "Madison Hill Nails",
    description:
      "Your day. A little brighter. Nail care in Madison, New Jersey.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/color-study.png",
        width: 1122,
        height: 1402,
        alt: "Decorative nail polish color study",
      },
    ],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-top">
            <p className="serif">
              See you soon<span>♥</span>
            </p>
            <Link className="button citrus" href="/book">
              Make time for yourself ↗
            </Link>
          </div>
          <div className="footer-bottom">
            <Link className="wordmark" href="/">
              madison hill<span>NAILS · MADISON, NJ</span>
            </Link>
            <p>349 Main St, Madison, NJ 07940</p>
            <nav aria-label="Footer">
              <Link href="/privacy">Privacy</Link>
              <Link href="/policies">Booking policies</Link>
              <Link href="/admin">Staff login</Link>
            </nav>
            <small>© {new Date().getFullYear()} Madison Hill Nails</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
