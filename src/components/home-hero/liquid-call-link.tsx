"use client";

import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useId, useRef, type PointerEvent } from "react";
import { BOOKING_URL } from "@/lib/booking";
import styles from "./liquid-call-link.module.css";

function Label({ label }: { label: string }) {
  return <span className={styles.label}>{label}<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></span>;
}

type Side = "left" | "right" | "top" | "bottom";
const W = 280, H = 58, FULL_PATH = `M-20-20H${W + 20}V${H + 20}H-20Z`;

/**
 * The outline of the liquid at one moment. It floods in from one side; `level` (0 to 1) is how far the body has
 * travelled, `along` is where the pointer sits on the advancing surface, and `time` drives the swell.
 */
function liquid(side: Side, level: number, along: number, time: number) {
  const sideways = side === "left" || side === "right";
  const span = sideways ? H : W, reach = sideways ? W : H;
  // The surface is restless while it travels and flat once the button is empty or full.
  const energy = Math.sin(Math.PI * level);
  const swell = (sideways ? 7 : 4.5) * energy, surge = (sideways ? 34 : 13) * energy, lean = sideways ? 26 * energy : 0;
  const pad = swell + surge + lean + 8;
  const base = -pad + level * (reach + 2 * pad);
  const points: string[] = [];
  for (let u = -8; u <= span + 8; u += sideways ? 3 : 6) {
    const wave = Math.sin(u / (sideways ? 15 : 21) + time * 5.2) * .62 + Math.sin(u / (sideways ? 9 : 12.5) - time * 7.4) * .38;
    // Liquid runs ahead where the pointer is, and along the floor when it comes in from the side.
    const lead = surge * Math.exp(-(((u - along) / (sideways ? 22 : 58)) ** 2));
    const front = base + wave * swell + lead + lean * (u / span - .5);
    const [x, y] = side === "left" ? [front, u] : side === "right" ? [W - front, u] : side === "top" ? [u, front] : [u, H - front];
    points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const back = side === "left" ? `L-30 ${H + 8}L-30-8` : side === "right" ? `L${W + 30} ${H + 8}L${W + 30}-8` : side === "top" ? `L${W + 8}-30L-8-30` : `L${W + 8} ${H + 30}L-8 ${H + 30}`;
  return `M${points.join("L")}${back}Z`;
}

/**
 * The fill is a body of liquid, not a growing shape: it floods in from the side the pointer crossed, with a moving
 * surface that runs ahead under the pointer, and drains back out through the side the pointer leaves by.
 * Both text layers share the same mask.
 */
export function LiquidCallLink({ href = BOOKING_URL, label = "Book a call" }: { href?: string; label?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduced = useReducedMotion();
  const x = useSpring(140, { stiffness: 120, damping: 21, mass: .8 });
  const y = useSpring(58, { stiffness: 120, damping: 21, mass: .8 });
  // Slightly under-damped, so the liquid arrives with a little momentum and settles.
  const level = useSpring(0, { stiffness: 52, damping: 13, mass: 1 });
  const side = useRef<Side>("bottom");
  const shape = useMotionValue("");
  const filter = `${id}-goo`, mask = `${id}-mask`, ink = `${id}-ink`, shine = `${id}-shine`;

  useAnimationFrame(time => {
    // The spring's long tail would leave a sliver unfilled, so the body has arrived a little before the spring rests.
    const now = Math.max(0, Math.min(1, level.get() / .94));
    if (now < .002) { if (shape.get() !== "") shape.set(""); return; }
    if (now > .998) { if (shape.get() !== FULL_PATH) shape.set(FULL_PATH); return; }
    const sideways = side.current === "left" || side.current === "right";
    shape.set(liquid(side.current, now, sideways ? y.get() : x.get(), time / 1000));
  });

  useEffect(() => {
    // Resize/tab changes must not leave a stale hover fill on a touch layout.
    const reset = () => { level.jump(0); x.jump(140); y.jump(58); };
    window.addEventListener("resize", reset);
    window.addEventListener("blur", reset);
    return () => { window.removeEventListener("resize", reset); window.removeEventListener("blur", reset); };
  }, [level, x, y]);

  function locate(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      px: Math.max(0, Math.min(W, (event.clientX - bounds.left) / bounds.width * W)),
      py: Math.max(0, Math.min(H, (event.clientY - bounds.top) / bounds.height * H)),
    };
  }
  // The side of the button the pointer is nearest: the one it has just crossed.
  function nearest({ px, py }: { px: number; py: number }): Side {
    const gap = Math.min(px, W - px, py, H - py);
    return gap === py ? "top" : gap === H - py ? "bottom" : gap === px ? "left" : "right";
  }
  function enter(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType === "touch") return;
    const point = locate(event);
    // Only choose a new side while the button is empty; a quick re-entry carries on with the liquid already there.
    if (level.get() < .04) { side.current = nearest(point); x.jump(point.px); y.jump(point.py); }
    x.set(point.px); y.set(point.py); level.set(1);
  }
  function follow(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType === "touch") return;
    const point = locate(event);
    x.set(point.px); y.set(point.py); level.set(1);
  }
  function leave(event: PointerEvent<HTMLAnchorElement>) {
    const point = locate(event);
    // A full button can drain through any side unseen, so it follows the pointer out.
    if (level.get() > .96) side.current = nearest(point);
    x.set(point.px); y.set(point.py); level.set(0);
  }
  function settle() { level.set(0); }
  function focus() {
    if (reduced) return;
    if (level.get() < .04) { side.current = "bottom"; x.jump(140); y.jump(58); }
    level.set(1);
  }

  return <Link href={href} className={styles.button} aria-label={label}
    onPointerEnter={enter} onPointerMove={follow} onPointerLeave={leave}
    onPointerCancel={settle} onFocus={focus} onBlur={settle}>
    <svg className={styles.surface} viewBox="0 0 280 58" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filter} filterUnits="userSpaceOnUse" x="-40" y="-40" width="360" height="138" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -9" />
        </filter>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="280" height="58" style={{ maskType: "alpha" }}>
          <g className={styles.fluid} filter={`url(#${filter})`} fill="white">
            <motion.path d={shape} />
          </g>
        </mask>
        <linearGradient id={ink} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34536d" /><stop offset="1" stopColor="#0c253d" />
        </linearGradient>
        <radialGradient id={shine}><stop stopColor="#e4eff8" stopOpacity=".2" /><stop offset="1" stopColor="#e4eff8" stopOpacity="0" /></radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="280" height="58"><Label label={label} /></foreignObject>
      <g mask={`url(#${mask})`} className={styles.filled}>
        <rect width="280" height="58" fill={`url(#${ink})`} />
        <motion.ellipse cx={x} cy={y} rx="110" ry="55" fill={`url(#${shine})`} />
        <foreignObject x="0" y="0" width="280" height="58"><Label label={label} /></foreignObject>
      </g>
    </svg>
  </Link>;
}
