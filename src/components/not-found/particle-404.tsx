"use client";

import { useEffect, useRef } from "react";
import styles from "./not-found.module.css";

type Particle = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; size: number; alpha: number; tint: number; phase: number };

// Silver first, with a little of the hero's blue and the mark's gold.
const TINTS = ["#e6eef7", "#e6eef7", "#e6eef7", "#e6eef7", "#a9cbff", "#a9cbff", "#e3c98f"];
const LIT = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#cfe1ff", "#cfe1ff", "#f3dfae"];

/**
 * "404" drawn from small points of light. The points drift slightly, part
 * like liquid around the pointer and flow back to their places. The digits
 * are sampled from the page's own heading font, so the shape matches the site.
 * With reduced motion the points are drawn once, at rest.
 */
export function Particle404() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -9999, y: -9999, active: false };
    let particles: Particle[] = [];
    let width = 0, height = 0, frame = 0, start = 0, cancelled = false;

    function build() {
      if (!element || !context) return;
      const bounds = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width; height = bounds.height;
      // Nothing to draw while the canvas has no size, e.g. as the page is being left.
      if (width < 2 || height < 2) { particles = []; return; }
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Draw the digits off-screen, then keep the pixels that landed inside them.
      const sample = document.createElement("canvas");
      sample.width = Math.round(width); sample.height = Math.round(height);
      const ink = sample.getContext("2d", { willReadFrequently: true });
      if (!ink) return;
      const family = getComputedStyle(element).getPropertyValue("--font-home-heading") || "Arial";
      const size = Math.min(height * 0.92, width * (width < 520 ? 0.42 : 0.36));
      ink.font = `500 ${size}px ${family}, Arial, sans-serif`;
      ink.textAlign = "center"; ink.textBaseline = "middle";
      ink.fillText("404", width / 2, height / 2 + size * 0.04);
      const data = ink.getImageData(0, 0, sample.width, sample.height).data;
      const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < sample.width && y < sample.height && data[(y * sample.width + x) * 4 + 3] > 128;

      const step = 2;
      const small = width < 520;
      const next: Particle[] = [];
      for (let y = 0; y < sample.height; y += step) {
        for (let x = 0; x < sample.width; x += step) {
          if (!inside(x, y)) continue;
          // Every point on the outline is kept; the body is thinned so the digits read as drawn in light.
          const edge = !inside(x - step, y) || !inside(x + step, y) || !inside(x, y - step) || !inside(x, y + step);
          if (edge ? Math.random() > (width < 900 ? 0.85 : 0.34) : Math.random() > 0.05) continue;
          const angle = Math.random() * Math.PI * 2, distance = 80 + Math.random() * Math.max(width, height) * 0.5;
          next.push({
            hx: x + (Math.random() - 0.5) * (edge ? 2.5 : 4), hy: y + (Math.random() - 0.5) * (edge ? 2.5 : 4),
            x: reduced.matches ? x : x + Math.cos(angle) * distance, y: reduced.matches ? y : y + Math.sin(angle) * distance,
            vx: 0, vy: 0,
            size: (edge ? 0.6 + Math.random() * 0.85 : 0.45 + Math.random() * 0.55) * (small ? 0.75 : 1),
            alpha: edge ? 0.55 + Math.random() * 0.45 : 0.2 + Math.random() * 0.4,
            tint: Math.floor(Math.random() * TINTS.length), phase: Math.random() * Math.PI * 2,
          });
        }
      }
      particles = next;
      start = performance.now();
    }

    function draw(now: number) {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      const time = (now - start) / 1000;
      const still = reduced.matches;
      const reach = Math.max(70, Math.min(130, width * 0.13));
      for (const particle of particles) {
        let lit = 0;
        if (!still) {
          // Spring home, with a slow drift so the digits never sit perfectly still.
          const driftX = Math.sin(time * 0.7 + particle.phase) * 0.9, driftY = Math.cos(time * 0.55 + particle.phase * 1.7) * 0.9;
          particle.vx += (particle.hx + driftX - particle.x) * 0.035;
          particle.vy += (particle.hy + driftY - particle.y) * 0.035;
          if (pointer.active) {
            const dx = particle.x - pointer.x, dy = particle.y - pointer.y, distance = Math.hypot(dx, dy);
            if (distance < reach && distance > 0.01) {
              const force = (1 - distance / reach) ** 2;
              // Push outward and a little sideways, so the points swirl around the pointer instead of bouncing off it.
              particle.vx += (dx / distance) * force * 2.6 + (-dy / distance) * force * 1.1;
              particle.vy += (dy / distance) * force * 2.6 + (dx / distance) * force * 1.1;
              lit = force;
            }
          }
          particle.vx *= 0.86; particle.vy *= 0.86;
          particle.x += particle.vx; particle.y += particle.vy;
        }
        const moving = Math.min(1, Math.hypot(particle.vx, particle.vy) / 3);
        const glow = Math.max(lit, moving * 0.7);
        context.globalAlpha = Math.min(1, particle.alpha + glow * 0.5);
        context.fillStyle = glow > 0.25 ? LIT[particle.tint] : TINTS[particle.tint];
        const size = particle.size * (1 + glow * 0.7);
        context.beginPath(); context.arc(particle.x, particle.y, size, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      if (!still && !cancelled && onScreen) frame = requestAnimationFrame(draw);
    }

    function restart() { cancelAnimationFrame(frame); build(); frame = requestAnimationFrame(draw); }
    function move(event: PointerEvent) {
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left; pointer.y = event.clientY - bounds.top; pointer.active = true;
    }
    function leave() { pointer.active = false; }
    // Draw only while the tab is showing and the digits are on screen.
    let onScreen = true;
    function visibility() { cancelAnimationFrame(frame); if (!document.hidden && onScreen) frame = requestAnimationFrame(draw); }
    const inView = new IntersectionObserver(entries => { onScreen = entries[0]?.isIntersecting ?? true; visibility(); }, { threshold: 0.01 });
    inView.observe(element);

    // The digits are sampled from the heading font, so wait for it before the first build.
    document.fonts.ready.then(() => { if (!cancelled) restart(); });
    const observer = new ResizeObserver(() => { if (Math.abs(element.getBoundingClientRect().width - width) > 1) restart(); });
    observer.observe(element);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", restart);

    return () => {
      cancelled = true; cancelAnimationFrame(frame); observer.disconnect(); inView.disconnect();
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave); document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", restart);
    };
  }, []);

  return <canvas ref={canvas} className={styles.digits} aria-hidden="true" />;
}
