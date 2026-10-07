"use client";

import Link from "next/link";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useId, type PointerEvent } from "react";
import styles from "./liquid-call-link.module.css";

function Label() {
  return <span className={styles.label}>Book a call<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></span>;
}

/** A local goo mask merges the fill. Both text layers share that exact mask. */
export function LiquidCallLink({ href = "/contact#book" }: { href?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduced = useReducedMotion();
  const x = useSpring(140, { stiffness: 120, damping: 21, mass: .8 });
  const y = useSpring(58, { stiffness: 120, damping: 21, mass: .8 });
  const radius = useSpring(0, { stiffness: 85, damping: 22, mass: 1 });
  const tail = useTransform(radius, [0, 310], [0, 180]);
  const filter = `${id}-goo`, mask = `${id}-mask`, ink = `${id}-ink`, shine = `${id}-shine`;

  useEffect(() => {
    // Resize/tab changes must not leave a stale hover fill on a touch layout.
    const reset = () => { radius.jump(0); x.jump(140); y.jump(58); };
    window.addEventListener("resize", reset);
    window.addEventListener("blur", reset);
    return () => { window.removeEventListener("resize", reset); window.removeEventListener("blur", reset); };
  }, [radius, x, y]);

  function follow(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(Math.max(0, Math.min(280, (event.clientX - bounds.left) / bounds.width * 280)));
    y.set(Math.max(0, Math.min(58, (event.clientY - bounds.top) / bounds.height * 58)));
    radius.set(310);
  }
  function settle() { radius.set(0); x.set(140); y.set(58); }
  function focus() { if (!reduced) { x.set(140); y.set(58); radius.set(310); } }

  return <Link href={href} className={styles.button} aria-label="Book a call"
    onPointerEnter={follow} onPointerMove={follow} onPointerLeave={settle}
    onPointerCancel={settle} onFocus={focus} onBlur={settle}>
    <svg className={styles.surface} viewBox="0 0 280 58" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filter} filterUnits="userSpaceOnUse" x="-10" y="-10" width="300" height="78" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -9" />
        </filter>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="280" height="58" style={{ maskType: "alpha" }}>
          <g className={styles.fluid} filter={`url(#${filter})`} fill="white">
            <motion.circle cx={x} cy={y} r={radius} />
            <motion.circle cx="0" cy="58" r={tail} />
            <motion.circle cx="280" cy="58" r={tail} />
          </g>
        </mask>
        <linearGradient id={ink} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34536d" /><stop offset="1" stopColor="#0c253d" />
        </linearGradient>
        <radialGradient id={shine}><stop stopColor="#e4eff8" stopOpacity=".2" /><stop offset="1" stopColor="#e4eff8" stopOpacity="0" /></radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="280" height="58"><Label /></foreignObject>
      <g mask={`url(#${mask})`} className={styles.filled}>
        <rect width="280" height="58" fill={`url(#${ink})`} />
        <motion.ellipse cx={x} cy={y} rx="110" ry="55" fill={`url(#${shine})`} />
        <foreignObject x="0" y="0" width="280" height="58"><Label /></foreignObject>
      </g>
    </svg>
  </Link>;
}
