"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { ServiceFocus } from "../service-page";
import styles from "./why.module.css";

type Chapter = "clarity" | "design" | "mobile";
type Detail = { field: string; label: string; description: string };
const examples: Record<Chapter, { label: string; title: string; details: readonly Detail[] }> = {
  clarity: {
    label: "Content hierarchy", title: "Clear from the first glance.",
    details: [
      { field: "heading", label: "Clear heading", description: "Say what you offer and where." },
      { field: "summary", label: "Useful summary", description: "Help visitors recognise the right service." },
      { field: "action", label: "Obvious next step", description: "Show them where to go next." },
    ],
  },
  design: {
    label: "Considered design", title: "Every detail has a purpose.",
    details: [
      { field: "image", label: "Relevant imagery", description: "Show the setting and the experience." },
      { field: "heading", label: "Consistent typography", description: "Make the important information stand out." },
      { field: "summary", label: "Useful detail", description: "Help people decide whether it suits them." },
    ],
  },
  mobile: {
    label: "Designed for mobile", title: "Easy to read. Easy to use.",
    details: [
      { field: "heading", label: "Readable type", description: "Clear text at a comfortable size." },
      { field: "summary", label: "Room to breathe", description: "Space keeps the content easy to follow." },
      { field: "action", label: "A clear action", description: "A generous button makes booking easy to find." },
    ],
  },
};

function DetailHighlight({ field, children, source = false, order }: { field: string; children: ReactNode; source?: boolean; order: number }) {
  return <span className={styles.highlight} data-design-source={source ? field : undefined} data-design-target={source ? undefined : field}>
    <ServiceFocus order={order}>{children}</ServiceFocus>
  </span>;
}

type Connection = { field: string; path: string; x1: number; y1: number; x2: number; y2: number };
type Geometry = { width: number; height: number; connections: Connection[] };

function ConnectionLine({ connection, index, progress, reduced }: { connection: Connection; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const draw = useTransform(progress, [.12 + index * .12, .4 + index * .12], [0, 1]);
  return <g data-design-connection={connection.field}>
    <motion.path d={connection.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: reduced ? 1 : draw, opacity: reduced ? 1 : draw }} />
    <motion.circle cx={connection.x1} cy={connection.y1} r="3" style={{ opacity: reduced ? 1 : draw }} />
    <motion.circle cx={connection.x2} cy={connection.y2} r="3" style={{ opacity: reduced ? 1 : draw }} />
  </g>;
}

/** Measure highlighted details so the connections follow font and viewport changes. */
function Connections({ root, details, progress, reduced }: { root: RefObject<HTMLDivElement | null>; details: readonly Detail[]; progress: MotionValue<number>; reduced: boolean }) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      frame = 0;
      if (disposed) return;
      const bounds = node.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const connections: Connection[] = [];
      for (const detail of details) {
        const source = node.querySelector<HTMLElement>(`[data-design-source="${detail.field}"]`);
        const target = node.querySelector<HTMLElement>(`[data-design-target="${detail.field}"]`);
        if (!source || !target) continue;
        const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
        const x1 = from.right - bounds.left + 3, y1 = from.top + from.height / 2 - bounds.top;
        const x2 = to.left - bounds.left - 8, y2 = to.top + to.height / 2 - bounds.top;
        const mid = (x1 + x2) / 2;
        connections.push({ field: detail.field, x1, y1, x2, y2, path: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}` });
      }
      const next = { width: bounds.width, height: bounds.height, connections };
      setGeometry(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    node.querySelectorAll<HTMLElement>("[data-design-source], [data-design-target]").forEach(element => observer.observe(element));
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", schedule); };
  }, [root, details]);

  if (!geometry) return null;
  return <svg className={styles.connections} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" focusable="false">
    {geometry.connections.map((connection, index) => <ConnectionLine key={connection.field} connection={connection} index={index} progress={progress} reduced={reduced} />)}
  </svg>;
}

export function WebDesignExample({ chapter }: { chapter: Chapter }) {
  const root = useRef<HTMLDivElement>(null);
  const key = useId();
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: root, offset: ["start .8", "end .8"] });
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: .35 });
  const example = examples[chapter];
  const mobile = chapter === "mobile";
  const design = chapter === "design";

  return <div id={`web-design-example-${chapter}`} className={styles.example} data-design-example={chapter}>
    <p className={styles.illustrationLabel}>Illustrative example · Fictional business</p>
    <div ref={root} className={styles.diagram}>
      <div className={styles.sourcePage} aria-label={`Fictional Riverside Pilates ${mobile ? "mobile " : ""}webpage`}>
        <div className={styles.siteHeader}><strong>Riverside Pilates</strong>{mobile ? <span className={styles.menuIcon} aria-hidden="true"><i /><i /><i /></span> : <span>Classes · About</span>}</div>
        <div className={styles.photo} data-design-source={design ? "image" : undefined}>
          <Image src="/assets/seo/illustrative-pilates-studio.png" alt="A bright Pilates studio with a mat and plants beside the window." width={1619} height={971} sizes="(max-width: 600px) 82vw, (max-width: 1100px) 40vw, 24vw" />
        </div>
        <div className={styles.siteBody}>
          <p className={styles.siteTitle}><DetailHighlight field="heading" source order={design ? 1 : 0}>Pilates classes in St Albans.</DetailHighlight></p>
          <p className={styles.siteDescription}><DetailHighlight field="summary" source order={design ? 2 : 1}>{design ? "Beginner-friendly groups and one-to-one sessions in a calm, welcoming studio." : mobile ? "Group classes and private sessions." : "Group classes and private sessions for every level."}</DetailHighlight></p>
          <span className={`${styles.siteAction} ${mobile ? styles.mobileAction : ""}`} data-design-source={design ? undefined : "action"}>
            {design ? <span>Explore classes <span aria-hidden="true">→</span></span> : <ServiceFocus order={2}>{mobile ? "Book a session" : "Explore classes"} <span aria-hidden="true">→</span></ServiceFocus>}
          </span>
        </div>
      </div>
      <div className={styles.explanation}>
        <p className={styles.panelLabel}>{example.label}</p>
        <section className={styles.explanationSurface} aria-labelledby={`${key}-title`}>
          <h3 id={`${key}-title`} className={styles.panelTitle}>{example.title}</h3>
          <dl className={styles.details}>{example.details.map((detail, index) => <div key={detail.field}>
            <dt><DetailHighlight field={detail.field} order={index}>{detail.label}</DetailHighlight></dt>
            <dd>{detail.description}</dd>
          </div>)}</dl>
        </section>
      </div>
      <Connections root={root} details={example.details} progress={progress} reduced={reduced} />
    </div>
  </div>;
}
