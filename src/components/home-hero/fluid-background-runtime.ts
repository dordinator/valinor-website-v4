import { ShaderMount, type ShaderMountUniforms } from "@paper-design/shaders";
import { navyMeshShader } from "./fluid-background-shader";

/** Approved demo settings: contrast 37, movement 75, response 35. No controls or storage on the public site. */
export function mountFluidBackground(surface: HTMLElement, hero: HTMLElement, ready: () => void, fallback: () => void) {
  const palette = ["#9aaab7", "#a8b7c3", "#05172c", "#0a233c", "#06182e", "#0b2943", "#0c2c48", "#163a55", "#9aaab7"];
  const colors = palette.map(hex => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255, 1]);
  const aspect = () => surface.clientWidth / Math.max(1, surface.clientHeight);
  const uniforms: ShaderMountUniforms = {
    u_colors: colors, u_colorsCount: colors.length, u_distortion: .42, u_swirl: .16,
    u_grainMixer: 0, u_grainOverlay: .022,
    u_fit: 2, u_scale: 1, u_rotation: 0, u_originX: .5, u_originY: .5,
    u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0,
    u_pointer: [.5, .5], u_flow: [0, 0], u_presence: 0,
    u_strength: .75, u_contrast: .37, u_viewAspect: aspect(),
  };
  const mount = new ShaderMount(surface, navyMeshShader, uniforms,
    { alpha: false, antialias: false, powerPreference: "low-power" }, .085, 0,
    window.innerWidth < 650 ? 1 : 1.25, 2_500_000);
  mount.canvasElement.setAttribute("aria-hidden", "true");
  const target = { x: .5, y: .5, presence: 0 };
  const pointer = { x: .5, y: .5, presence: 0, flowX: 0, flowY: 0 };
  let frame = 0;
  let previous = 0;
  let visible = true;
  let disposed = false;
  let firstPaint = 0;

  function stopPointer() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  function wake() {
    if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(step);
  }
  function step(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) { previous = 0; return; }
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
    previous = now;
    const ease = 1 - Math.exp(-3.825 * dt);
    const dx = (target.x - pointer.x) * ease, dy = (target.y - pointer.y) * ease;
    pointer.x += dx; pointer.y += dy;
    const velocityEase = 1 - Math.exp(-5 * dt);
    pointer.flowX += (dx / dt - pointer.flowX) * velocityEase;
    pointer.flowY += (dy / dt - pointer.flowY) * velocityEase;
    const speed = Math.hypot(pointer.flowX, pointer.flowY);
    if (speed > 1.4) { pointer.flowX *= 1.4 / speed; pointer.flowY *= 1.4 / speed; }
    pointer.presence += (target.presence - pointer.presence) * ease;
    mount.setUniforms({ u_pointer: [pointer.x, pointer.y], u_flow: [pointer.flowX, pointer.flowY], u_presence: pointer.presence });
    if (Math.abs(target.x - pointer.x) + Math.abs(target.y - pointer.y) + Math.abs(target.presence - pointer.presence) + Math.abs(pointer.flowX) + Math.abs(pointer.flowY) > .0002) wake();
    else previous = 0;
  }
  function move(event: PointerEvent) {
    if (event.pointerType === "touch" || !visible) return;
    const bounds = surface.getBoundingClientRect();
    target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / Math.max(1, bounds.width)));
    target.y = 1 - Math.min(1, Math.max(0, (event.clientY - bounds.top) / Math.max(1, bounds.height)));
    target.presence = 1; wake();
  }
  function leave() { target.presence = 0; wake(); }
  function visibility() { if (document.hidden) stopPointer(); else wake(); }
  const resize = new ResizeObserver(() => { if (!disposed) mount.setUniforms({ u_viewAspect: aspect() }); });
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    if (!visible) stopPointer(); else wake();
  });
  function contextLost(event: Event) { event.preventDefault(); fallback(); dispose(); }
  function dispose() {
    if (disposed) return;
    disposed = true; stopPointer(); cancelAnimationFrame(firstPaint);
    resize.disconnect(); intersection.disconnect();
    hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    mount.canvasElement.removeEventListener("webglcontextlost", contextLost);
    mount.dispose(); mount.canvasElement.remove();
  }
  resize.observe(surface); intersection.observe(hero);
  hero.addEventListener("pointermove", move, { passive: true }); hero.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  mount.canvasElement.addEventListener("webglcontextlost", contextLost);
  firstPaint = requestAnimationFrame(() => {
    if (disposed) return;
    mount.setFrame(0);
    firstPaint = requestAnimationFrame(() => { if (!disposed) ready(); });
  });
  return dispose;
}
