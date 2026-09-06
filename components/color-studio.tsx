"use client";
import { useState, type CSSProperties } from "react";
const moods = [
  {
    name: "Cherry on top",
    color: "#BA2247",
    note: "A bold little pick-me-up.",
  },
  {
    name: "Lilac daydream",
    color: "#A38BCC",
    note: "Soft color. Big daydreams.",
  },
  {
    name: "Peach, please",
    color: "#EA885E",
    note: "A little sunshine at your fingertips.",
  },
  {
    name: "Fresh perspective",
    color: "#789C88",
    note: "Your moment to turn over a new leaf.",
  },
];
export function ColorStudio() {
  const [selected, setSelected] = useState(0);
  const mood = moods[selected];
  return (
    <div className="color-studio">
      <div
        className="polish-samples"
        aria-hidden="true"
        style={{ "--polish": mood.color } as CSSProperties}
      >
        {[0, 1, 2].map((n) => (
          <span key={n} />
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
