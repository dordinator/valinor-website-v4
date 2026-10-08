"use client";

import { useEffect } from "react";
import "./initial-loader.css";

const ASSETS = "/loader-live/0ee6a15df8ec";

/** Mounted in the persistent root layout, never on client-side route transitions. */
export function InitialLoader() {
  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-initial-loading")) return;
    let cancelled = false;
    let frame = 0;

    // Fonts already use display:swap; waiting for them and image.decode() hid
    // usable content. Release after hydration and its first layout frame.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!cancelled) window.dispatchEvent(new Event("valinor:page-ready"));
      });
    });

    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, []);

  return (
    <div data-valinor-loader suppressHydrationWarning role="status" aria-live="polite" aria-label="Loading Valinor Systems">
      <div className="initial-loader-lockup" aria-hidden="true">
      <div className="initial-loader-cube">
        <canvas width="384" height="384" suppressHydrationWarning />
        {/* Fixed local still is the immediate and reduced-motion fallback. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/poster.webp`} width="384" height="384" alt="" fetchPriority="low" />
      </div>
      <div className="initial-loader-wordmark">
        <span>Valinor<br />Systems</span>
        <span className="initial-loader-ink">Valinor<br />Systems</span>
      </div>
      </div>
    </div>
  );
}
