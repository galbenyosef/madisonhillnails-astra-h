import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { BrandMark } from "@/components/brand-mark";
import "./globals.css";
import "./editorial.css";
import "./white-hero.css";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Madison Hill Nails | Pedicures & Spa in Madison, NJ",
    template: "%s | Madison Hill Nails",
  },
  description:
    "Nail care, pedicures, and spa treatments at Madison Hill Nails. Find your next moment of relaxation at 349 Main St in Madison, NJ.",
  robots: {
    index: process.env.SITE_INDEXABLE === "true",
    follow: process.env.SITE_INDEXABLE === "true",
  },
  openGraph: {
    title: "Madison Hill Nails",
    description:
      "Nail care, pedicures, and spa treatments. A little time for you in Madison, New Jersey.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/salon-mint-chocolate.jpg",
        width: 3024,
        height: 2607,
        alt: "Mint and chocolate nail art by Madison Hill Nails",
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
        <footer className="site-footer editorial-footer">
          <div className="footer-top">
            <p className="serif">
              Good nails.<span>Great energy.</span>
            </p>
            <Link className="button citrus" href="/book">
              Make time for yourself ↗
            </Link>
          </div>
          <div className="footer-bottom">
            <Link
              className="brandmark"
              href="/"
              aria-label="Madison Hill Nails & Spa home"
            >
              <BrandMark />
            </Link>
            <p>349 Main St, Madison, NJ 07940</p>
            <nav aria-label="Footer">
              <a
                href="https://www.instagram.com/madisonhillnails/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram<span className="sr-only"> (opens a new tab)</span>
              </a>
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
