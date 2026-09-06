"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";

export function WhiteHero() {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(
      element.querySelectorAll<HTMLElement>("[data-hero-depth]"),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const still = paused || media.matches;
      element.dataset.motion = still ? "still" : "running";
      const rect = element.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (100 - rect.top) / (rect.height + 100)),
      );
      const scale = innerWidth <= 760 ? 0.45 : 1;
      for (const layer of layers) {
        const offset = still
          ? 0
          : progress * Number(layer.dataset.heroDepth) * scale;
        layer.style.setProperty("--hero-shift", `${offset.toFixed(2)}px`);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [paused]);

  return (
    <section className="white-hero" ref={section} aria-labelledby="hero-title">
      <div className="hero-decoration" aria-hidden="true">
        <div className="hero-layer layer-lilac" data-hero-depth="150">
          <span className="enamel enamel-lilac" />
        </div>
        <div className="hero-layer layer-cherry" data-hero-depth="-120">
          <span className="enamel enamel-cherry" />
        </div>
        <div className="hero-layer layer-butter" data-hero-depth="95">
          <span className="enamel enamel-butter" />
        </div>
        <div className="hero-layer layer-orbit" data-hero-depth="-70">
          <svg viewBox="0 0 240 240" fill="none">
            <circle cx="120" cy="120" r="110" />
            <circle cx="120" cy="120" r="86" />
          </svg>
        </div>
        <span className="hero-sparkle sparkle-one">✳</span>
        <span className="hero-sparkle sparkle-two">✳</span>
      </div>
      <div className="white-hero-copy">
        <p className="hero-overline">MADISON HILL NAILS &amp; SPA</p>
        <h1 id="hero-title">
          A little time.<em>All yours.</em>
        </h1>
        <p className="white-hero-description">
          Beautiful nails. Unhurried moments.
          <br />
          Nail care, pedicures, and spa treatments in Madison, NJ.
        </p>
        <div className="white-hero-actions">
          <Link href="/book" className="hero-book">
            Book your visit <ArrowUpRight size={19} />
          </Link>
          <Link href="#gallery" className="hero-gallery-link">
            Explore our work <ArrowDown size={16} />
          </Link>
        </div>
        <span className="hero-service-line">
          NAIL CARE <span>·</span> PEDICURES <span>·</span> SPA
        </span>
      </div>
      <div className="white-hero-bottom edit-wrap">
        <a href="#visit">
          <MapPin size={13} /> 349 MAIN ST · MADISON, NJ
        </a>
        <span className="hero-scroll-cue">
          A LITTLE FURTHER. A LITTLE INSPIRATION. <ArrowDown size={13} />
        </span>
        <button
          className="hero-motion-toggle"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </section>
  );
}
