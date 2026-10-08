"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactLenis, useLenis } from "lenis/react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { PortalPreview } from "@/components/home-hero/home-hero";
import styles from "./scroll-lab.module.css";

const studies = [
  { id: "feel", name: "Scroll feel", title: "Find your pace.", description: "The same page, three different responses. Use the scroll-feel buttons above, then scroll with your mouse wheel." },
  { id: "parallax", name: "Image drift", title: "Let the image breathe.", description: "The frame travels with the page. The image moves a little more slowly inside it." },
  { id: "expand", name: "Expanding frame", title: "A closer look.", description: "The preview grows as you scroll, then releases into the next section." },
  { id: "sticky", name: "Sticky story", title: "One space. Three chapters.", description: "The composition holds still while the images and active chapter change." },
  { id: "text", name: "Word reveal", title: "Words with a little weight.", description: "The sentence sharpens and settles into place as you move through it." },
] as const;
type Effect = typeof studies[number]["id"];
type Feel = "direct" | "smooth" | "floaty";
const feels: { id: Feel; name: string; lerp: number }[] = [
  { id: "direct", name: "Direct", lerp: 1 },
  { id: "smooth", name: "Smooth", lerp: .16 },
  { id: "floaty", name: "Floaty", lerp: .08 },
];
const projects = [
  { name: "UniFluent", image: "/assets/studio-previews/unifluent-hero.png", description: "A clear first impression." },
  { name: "NJH Sports Therapy", image: "/assets/studio-previews/njh-sports-therapy-hero.png", description: "Space for the work to speak." },
  { name: "Canadian Citizenship Hub", image: "/assets/studio-previews/canadian-citizenship-hub-hero.png", description: "A straightforward next step." },
] as const;
const spring = { stiffness: 130, damping: 30, mass: .35 };

function isEffect(value: string): value is Effect { return studies.some(study => study.id === value); }

function ProjectImage({ index, className = "", preload = false }: { index: number; className?: string; preload?: boolean }) {
  const project = projects[index];
  return <Image src={project.image} alt={`${project.name} website preview`} fill sizes="(max-width: 700px) 94vw, 85vw" className={className} preload={preload} />;
}

function ScrollFeelStudy() {
  return <div>
    <section className={`${styles.feelScene} ${styles.navy}`}><h2>A little momentum.</h2><p>Scroll down, stop, then reverse direction.</p><span className={styles.down} aria-hidden="true">↓</span></section>
    <section className={styles.feelScene}><div className={styles.feelImage}><ProjectImage index={0} /></div><h2>Keep moving.</h2><p>Try Direct, then Floaty, over this same stretch.</p></section>
    <section className={`${styles.feelScene} ${styles.ink}`}><h2>Let it settle.</h2><p>Which response feels more natural to you?</p></section>
  </div>;
}

function ParallaxStudy({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const eased = useSpring(scrollYProgress, spring);
  const y = useTransform(eased, [0, 1], ["-6%", "6%"]);
  return <section ref={ref} className={styles.parallaxScene} aria-label="Image parallax example">
    <div className={styles.parallaxFrame}><motion.div className={styles.parallaxImage} style={{ y: enabled ? y : "0%" }}><ProjectImage index={1} preload /></motion.div></div>
    <div className={styles.caption}><span>NJH Sports Therapy</span><span>{enabled ? "Image drifts inside the frame" : "Static image"}</span></div>
    <div className={styles.afterImage}><h2>Quiet movement.<br />A stronger impression.</h2><p>Scroll back up and watch the image against its edges.</p></div>
  </section>;
}

function ExpandingStudy({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, spring);
  const width = useTransform(eased, [0, .78], ["68%", "96%"]);
  const height = useTransform(eased, [0, .78], ["46svh", "65svh"]);
  const radius = useTransform(eased, [0, .78], [18, 4]);
  return <>
    <section ref={ref} className={`${styles.expandScene} ${styles.navy}`} aria-label="Expanding portal preview example">
      <div className={styles.expandSticky}><h2>Your workspace,<br className={styles.mobileBreak} /> in view.</h2>
        <motion.div className={styles.expandingFrame} style={{ width: enabled ? width : "80%", height: enabled ? height : "56svh", borderRadius: enabled ? radius : 10 }}><PortalPreview standalone /></motion.div>
        <p className={styles.demoNote}>Illustrative portal · fictional example data</p>
      </div>
    </section>
    <section className={styles.release}><h2>And back to the page.</h2><p>The section lets go once the preview has opened.</p></section>
  </>;
}

function ChapterImage({ index, progress, enabled }: { index: number; progress: MotionValue<number>; enabled: boolean }) {
  const start = index / 3;
  const opacity = useTransform(progress, index === 0 ? [0, .27, .36] : index === 1 ? [.27, .36, .60, .69] : [.60, .69, 1], index === 0 ? [1, 1, 0] : index === 1 ? [0, 1, 1, 0] : [0, 1, 1]);
  const y = useTransform(progress, [start, Math.min(1, start + .13)], [28, 0]);
  return <motion.div className={styles.chapterImage} style={{ opacity: enabled ? opacity : index === 0 ? 1 : 0, y: enabled ? y : 0 }} aria-hidden="true"><ProjectImage index={index} /></motion.div>;
}

function StickyStudy({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, spring);
  useMotionValueEvent(eased, "change", progress => {
    const chapter = progress < .315 ? 0 : progress < .645 ? 1 : 2;
    setActive(previous => previous === chapter ? previous : chapter);
  });
  function goTo(index: number) {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, ref.current.offsetHeight - window.innerHeight);
    const target = top + range * (index + .5) / 3;
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  }
  const current = enabled ? active : 0;
  return <section ref={ref} className={styles.stickyScene} aria-label="Sticky project chapters example">
    <div className={styles.chapterLayout}>
      <div className={styles.chapterCopy}><h2>Give each project<br />its moment.</h2><nav aria-label="Project chapters" className={styles.chapterNav}>{projects.map((project, index) => <button type="button" key={project.name} aria-current={current === index ? "step" : undefined} onClick={() => goTo(index)} disabled={!enabled}><span className={styles.chapterDot} aria-hidden="true" /><span>{project.name}</span></button>)}</nav><p aria-live="polite">{projects[current].description}</p></div>
      <div className={styles.chapterFrame} role="img" aria-label={`${projects[current].name} website preview`}>{projects.map((project, index) => <ChapterImage key={project.name} index={index} progress={eased} enabled={enabled} />)}</div>
    </div>
  </section>;
}

function RevealWord({ children, index, progress, enabled }: { children: string; index: number; progress: MotionValue<number>; enabled: boolean }) {
  const start = .06 + index * .105;
  const opacity = useTransform(progress, [start, start + .16], [.28, 1]);
  const y = useTransform(progress, [start, start + .16], [18, 0]);
  const filter = useTransform(progress, [start, start + .16], ["blur(4px)", "blur(0px)"]);
  return <motion.span style={{ opacity: enabled ? opacity : 1, y: enabled ? y : 0, filter: enabled ? filter : "none" }} aria-hidden="true">{children} </motion.span>;
}

function TextStudy({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, spring);
  return <section ref={ref} className={`${styles.textScene} ${styles.ink}`} aria-label="Scroll-driven word reveal example"><div className={styles.textSticky}>
    <h2 aria-label="Make it easier to find you.">{["Make", "it", "easier", "to", "find", "you."].map((word, index) => <RevealWord key={word} index={index} progress={eased} enabled={enabled}>{word}</RevealWord>)}</h2>
    <p>Move down to reveal. Move up to reverse.</p>
  </div></section>;
}

export function ScrollLab({ initialEffect }: { initialEffect: string }) {
  const [effect, setEffect] = useState<Effect>(isEffect(initialEffect) ? initialEffect : "expand");
  const [feel, setFeel] = useState<Feel>("smooth");
  const [effects, setEffects] = useState(true);
  const reduced = useReducedMotion() ?? false;
  return <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: reduced ? 1 : feels.find(option => option.id === feel)!.lerp, smoothWheel: !reduced && feel !== "direct" }}>
    <ScrollLabView effect={effect} feel={feel} effects={effects} reduced={reduced} onEffect={setEffect} onFeel={setFeel} onEffects={setEffects} />
  </ReactLenis>;
}

function ScrollLabView({ effect, feel, effects, reduced, onEffect, onFeel, onEffects }: {
  effect: Effect; feel: Feel; effects: boolean; reduced: boolean;
  onEffect: (effect: Effect) => void; onFeel: (feel: Feel) => void; onEffects: (effects: boolean) => void;
}) {
  const lenis = useLenis();
  const study = studies.find(item => item.id === effect)!;
  const enabled = effects && !reduced;
  function choose(next: Effect) {
    onEffect(next);
    const url = new URL(window.location.href);
    url.searchParams.set("effect", next);
    window.history.replaceState(null, "", url);
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }
  return <main className={styles.lab} data-scroll-lab>
    <header className={styles.toolbar}><div className={styles.topRow}><Link href="/" className={styles.brand}>Valinor <span>Scroll studies</span></Link><Link href="/" className={styles.back}>Back to website ↗</Link></div>
      <div className={styles.controls}><nav aria-label="Scroll examples" className={styles.exampleNav}>{studies.map((item, index) => <button type="button" key={item.id} onClick={() => choose(item.id)} aria-pressed={effect === item.id}><span className={styles.number}>0{index + 1}</span>{item.name}</button>)}</nav>
        <div className={styles.feelControls}><div role="group" aria-label="Scroll feel">{feels.map(option => <button type="button" key={option.id} aria-pressed={feel === option.id} onClick={() => onFeel(option.id)} disabled={reduced}>{option.name}</button>)}</div><label className={styles.effectToggle}><input type="checkbox" checked={effects} disabled={reduced} onChange={event => onEffects(event.target.checked)} /> Effects on</label></div>
      </div>
    </header>
    <section className={styles.intro}><div><h1>{study.title}</h1><p>{study.description}</p><div className={styles.instructions}><span>Scroll to explore ↓</span><span>{reduced ? "Reduced motion: static examples" : feel === "direct" ? "Direct scroll · no added smoothing" : `Scroll smoothing · lerp ${feels.find(option => option.id === feel)!.lerp}`}</span></div></div></section>
    <div key={effect}>
      {effect === "feel" ? <ScrollFeelStudy /> : effect === "parallax" ? <ParallaxStudy enabled={enabled} /> : effect === "expand" ? <ExpandingStudy enabled={enabled} /> : effect === "sticky" ? <StickyStudy enabled={enabled} /> : <TextStudy enabled={enabled} />}
    </div>
    <footer className={styles.end}><p>How did that feel?</p><h2>Try the next study.</h2><button type="button" onClick={() => choose(studies[(studies.findIndex(item => item.id === effect) + 1) % studies.length].id)}>Next example <span aria-hidden="true">→</span></button><span className={styles.footerNote}>Motion experiments · examples are independent of the main page designs</span></footer>
  </main>;
}
