"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header editorial-header">
      <Link
        href="/"
        className="brandmark"
        aria-label="Madison Hill Nails & Spa home"
      >
        <BrandMark />
      </Link>
      <button
        className="menu-toggle icon-button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-navigation"
        className={open ? "navigation open" : "navigation"}
        aria-label="Main navigation"
        onClick={() => setOpen(false)}
      >
        <Link href="/#services">The menu</Link>
        <Link href="/#color">Color story</Link>
        <Link href="/#visit">Visit us</Link>
        <Link href="/appointments">My appointments</Link>
        <Link className="button small" href="/book">
          Book an appointment <ArrowUpRight size={17} />
        </Link>
      </nav>
    </header>
  );
}
