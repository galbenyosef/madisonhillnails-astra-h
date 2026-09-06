"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Madison Hill Nails home">
        madison hill<span>NAILS · MADISON, NJ</span>
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
          Book a little me-time <ArrowUpRight size={17} />
        </Link>
      </nav>
    </header>
  );
}
