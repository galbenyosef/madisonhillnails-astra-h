"use client";
import { useEffect, useRef, useState } from "react";
const moods = [
  {
    name: "Cherry on top",
    color: "#BA2247",
    bg: "#F8E9EC",
    note: "A bold little pick-me-up.",
  },
  {
    name: "Lilac daydream",
    color: "#A38BCC",
    bg: "#F0EBF8",
    note: "Soft color. Big daydreams.",
  },
  {
    name: "Peach, please",
    color: "#EA885E",
    bg: "#FBEEE4",
    note: "A little sunshine at your fingertips.",
  },
  {
    name: "Fresh perspective",
    color: "#789C88",
    bg: "#EDF3EC",
    note: "Your moment to turn over a new leaf.",
  },
];
export function ColorStudio() {
  const [selected, setSelected] = useState(0);
  const mood = moods[selected];
  return (
    <div className="color-studio" style={{ background: mood.bg }}>
      <div className="nail-study" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} style={{ background: mood.color }} />
        ))}
      </div>
      <div className="color-controls">
        <span className="eyebrow">PICK YOUR MOOD</span>
        <h3>{mood.name}</h3>
        <p aria-live="polite">{mood.note}</p>
        <div className="swatches" aria-label="Color inspiration">
          {moods.map((m, i) => (
            <button
              key={m.name}
              aria-label={m.name}
              aria-pressed={selected === i}
              style={{ background: m.color }}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
        <small>
          Color inspiration, not a salon portfolio or shade inventory.
        </small>
      </div>
    </div>
  );
}
export function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (ref.current)
          ref.current.style.setProperty(
            "--drift",
            media.matches ? "0px" : `${Math.min(35, window.scrollY * 0.08)}px`,
          );
      });
    };
    window.addEventListener("scroll", move, { passive: true });
    media.addEventListener("change", move);
    return () => {
      window.removeEventListener("scroll", move);
      media.removeEventListener("change", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="parallax" ref={ref}>
      {children}
    </div>
  );
}
