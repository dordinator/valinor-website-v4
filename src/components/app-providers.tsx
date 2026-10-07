"use client";

import Snap from "lenis/snap";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type AppProvidersProps = {
  children: ReactNode;
};

function SoftSectionSnap() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Primary pointer only: a coarse primary pointer means flick-scrolling,
    // where proximity snapping fights the momentum. Touchscreen laptops keep
    // a fine primary pointer, so they keep the snap.
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "16%",
      debounce: 240,
      duration: 0.62,
      easing: (progress) => 1 - Math.pow(1 - progress, 4),
    });
    const removeElements = snap.addElements(
      Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-section]")),
      { align: "start" },
    );

    function syncMotionPreference() {
      if (reducedMotion.matches || coarsePointer.matches) snap.stop();
      else snap.start();
    }

    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);
    coarsePointer.addEventListener("change", syncMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
      coarsePointer.removeEventListener("change", syncMotionPreference);
      removeElements();
      snap.destroy();
    };
  }, [lenis, pathname]);

  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ anchors: true, autoRaf: true }}>
        <SoftSectionSnap />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
