"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./scroll-preview.module.css";

export function ScrollPreview({ children, fontClassName = "" }: { children: ReactNode; fontClassName?: string }) {
  const stage = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const top = node.getBoundingClientRect().top;
      const progress = preference.matches || viewport <= 0 ? 0 : Math.max(0, Math.min(1, (viewport * .72 - top) / (viewport * .56)));
      node.style.setProperty("--preview-progress", progress.toFixed(4));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);
  return <section ref={stage} className={`${styles.stage} ${fontClassName}`} id="workspace-preview" aria-label="Client portal demonstration" data-scroll-preview>
    <div className={styles.frame}>{children}</div>
  </section>;
}
