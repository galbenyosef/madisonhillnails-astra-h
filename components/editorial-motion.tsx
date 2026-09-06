"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** Native scrolling: decorative layers move without locking the page. */
export function EditorialMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(
      element.querySelectorAll<HTMLElement>("[data-scroll-scene]"),
    ).map((scene) => ({
      scene,
      layers: Array.from(scene.querySelectorAll<HTMLElement>("[data-depth]")),
    }));
    let frame = 0;
    const update = () => {
      frame = 0;
      const still = paused || media.matches;
      element.dataset.motion = still ? "still" : "running";
      for (const { scene, layers } of scenes) {
        const rect = scene.getBoundingClientRect();
        const progress = Math.max(
          -1,
          Math.min(
            1,
            (innerHeight / 2 - rect.top - rect.height / 2) /
              ((innerHeight + rect.height) / 2),
          ),
        );
        const scale = innerWidth <= 760 ? 0.5 : 1;
        for (const layer of layers) {
          const distance = still
            ? 0
            : progress * Number(layer.dataset.depth) * scale;
          layer.style.setProperty("--depth-y", `${distance.toFixed(2)}px`);
        }
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
    <div className="editorial-home" ref={root}>
      <div className="edit-topline edit-wrap">
        <span>
          THE NAIL EDIT <span className="topline-dot">/</span> MADISON, NEW
          JERSEY
        </span>
        <button
          className="motion-control"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
      {children}
    </div>
  );
}
