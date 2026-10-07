"use client";

import { useEffect, useRef } from "react";
import styles from "./fluid-background.module.css";

/** The server-rendered gradient remains visible until the optional shader is ready. */
export function FluidBackground({ fullPage = false }: { fullPage?: boolean } = {}) {
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    const mountPoint = surface.current;
    if (!host || !mountPoint) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A review-only switch lets the static path be inspected without changing OS settings.
    const staticPreview = new URLSearchParams(window.location.search).get("hero-motion") === "off";
    let generation = 0;
    let disposed = false;
    let stop: (() => void) | undefined;

    function configure() {
      const version = ++generation;
      stop?.(); stop = undefined;
      host!.dataset.state = "static";
      if (reduced.matches || staticPreview) return;
      void import("./fluid-background-runtime").then(({ mountFluidBackground }) => {
        if (disposed || version !== generation) return;
        try {
          stop = mountFluidBackground(mountPoint!, host!.closest<HTMLElement>(fullPage ? "[data-fluid-page]" : "[data-fluid-hero]") ?? host!, () => {
            host!.dataset.state = "animated";
          }, () => { host!.dataset.state = "static"; });
        } catch {
          mountPoint!.replaceChildren();
          host!.dataset.state = "static";
        }
      }).catch(() => { if (!disposed && version === generation) host!.dataset.state = "static"; });
    }
    configure();
    reduced.addEventListener("change", configure);
    return () => { disposed = true; generation++; reduced.removeEventListener("change", configure); stop?.(); };
  }, [fullPage]);

  return <div ref={root} className={`${styles.background} ${fullPage ? styles.fullPage : ""}`} data-state="static" aria-hidden="true">
    <div className={styles.fallback} />
    <div ref={surface} className={styles.surface} />
  </div>;
}
