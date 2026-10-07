"use client";

import Link from "next/link";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import styles from "./liquid-call-link.module.css";

/** The surface moves inside the link, keeping its hit area and text stable. */
export function LiquidCallLink({ href = "/contact#book" }: { href?: string }) {
  const reducedMotion = useReducedMotion();
  const reflectionX = useSpring(0, { stiffness: 135, damping: 19, mass: 0.8 });
  const reflectionY = useSpring(0, { stiffness: 135, damping: 19, mass: 0.8 });

  function followPointer(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    reflectionX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 90);
    reflectionY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 28);
  }

  function settle() {
    reflectionX.set(0);
    reflectionY.set(0);
  }

  return (
    <Link href={href} className={styles.button} onPointerMove={followPointer}
      onPointerLeave={settle} onPointerCancel={settle} onBlur={settle}>
      <span className={styles.surface} aria-hidden="true">
        <span className={styles.fill}>
          <svg className={styles.wave} viewBox="0 0 600 24" preserveAspectRatio="none">
            <path d="M0 12C50 0 100 0 150 12S250 24 300 12S400 0 450 12S550 24 600 12V24H0Z" />
          </svg>
          <svg className={`${styles.wave} ${styles.waveBack}`} viewBox="0 0 600 24" preserveAspectRatio="none">
            <path d="M0 12C50 0 100 0 150 12S250 24 300 12S400 0 450 12S550 24 600 12V24H0Z" />
          </svg>
        </span>
        <motion.span className={styles.reflection} style={{ x: reflectionX, y: reflectionY }} />
      </span>
      <span className={styles.label}>
        Book a call
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
