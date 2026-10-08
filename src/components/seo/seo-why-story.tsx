"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import styles from "./seo-why-story.module.css";

const chapters = [
  { id: "search", statement: "Be found when someone needs your service.", title: "Search & AI discovery", caption: "Connect relevant searches and questions to clear information about your business.", description: "The same service page supports an illustrative search preview and AI answer. Inclusion and AI citations are not guaranteed." },
  { id: "enquiry", statement: "Help interest become an enquiry.", title: "An easier decision", caption: "Answer practical questions and make the next step straightforward.", description: "Information about suitability, location and what to expect connects to a relevant class choice and enquiry route." },
  { id: "resource", statement: "Build a useful resource over time.", title: "More ways to be found", caption: "Connected service pages and guides answer more of your customers’ questions.", description: "The original service page connects to guides for a first visit, different session types and practical preparation. These are useful additions, not an invented growth forecast." },
] as const;
type Chapter = typeof chapters[number];
type FactKey = "location" | "sessions" | "next";
const facts: { key: FactKey; text: string }[] = [
  { key: "location", text: "St Albans" },
  { key: "sessions", text: "Group and private sessions" },
  { key: "next", text: "Timetable and booking" },
];
const spring = { stiffness: 130, damping: 30, mass: .35 };
const entry = .8;

function Icon({ type }: { type: "search" | "location" | "sessions" | "next" | "file" }) {
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {type === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></> : type === "location" ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></> : type === "sessions" ? <><circle cx="9" cy="7" r="3" /><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v3" /></> : type === "next" ? <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18M7 15h3m-3 3h6" /></> : <><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h4M9 11h6m-6 4h6m-6 3h4" /></>}
  </svg>;
}

function Highlight({ children, field, index, progress, reduced, source = false }: {
  children: ReactNode; field: FactKey; index: number; progress: MotionValue<number>; reduced: boolean; source?: boolean;
}) {
  const alpha = useTransform(progress, [.08 + index * .12, .32 + index * .12], [0, 1]);
  return <span className={`${styles.fact} ${source ? styles.sourceFact : ""}`} data-source-fact={source ? field : undefined} data-target-fact={!source ? field : undefined}>
    <motion.span className={styles.factInk} aria-hidden="true" style={{ opacity: reduced ? 1 : alpha }} />
    <span className={styles.factText}>{children}</span>
  </span>;
}

function SourcePage({ chapter, progress, reduced }: { chapter: Chapter; progress: MotionValue<number>; reduced: boolean }) {
  const enquiry = chapter.id === "enquiry";
  const resource = chapter.id === "resource";
  const copy = enquiry ? ["Who the classes suit", "Where we meet", "What to expect"] : resource ? ["Local Pilates classes", "Group and private sessions", "Timetable and booking"] : facts.map(fact => fact.text);

  return <div className={styles.sourcePage} aria-label="Fictional Riverside Pilates webpage">
    <div className={styles.siteHeader}><strong>Riverside Pilates</strong><span>Classes · About</span></div>
    <Image className={styles.studioImage} src="/assets/seo/illustrative-pilates-studio.png" alt="" width={1619} height={971} sizes="(max-width: 600px) 70vw, (max-width: 1100px) 40vw, 24vw" />
    <div className={styles.siteBody}>
      <p className={styles.siteTitle}>Local Pilates classes</p>
      <ul className={styles.sourceFacts}>{facts.map((fact, index) => <li key={fact.key}>
        <Icon type={fact.key} /><Highlight field={fact.key} index={index} progress={progress} reduced={reduced} source>{copy[index]}</Highlight>
      </li>)}</ul>
      <p className={styles.siteDescription}>{enquiry ? "Explore who the sessions suit, where they take place and how to get started." : resource ? "Explore the classes and useful guides, then choose the next step that suits you." : "Explore class types, location and timetable, then choose the next step that suits you."}</p>
      {(enquiry || resource) && <span className={styles.siteAction}>{resource ? "Explore our guides" : "View timetable"} <span aria-hidden="true">→</span></span>}
    </div>
  </div>;
}

function DiscoveryOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  return <div className={styles.output}>
    <p className={styles.outputLabel}>Search & AI previews</p>
    <div className={styles.outputSurface}>
      <div className={styles.query}><Icon type="search" /><span>Pilates classes in St Albans</span></div>
      <div className={styles.searchResult}>
        <p className={styles.resultTitle}>Local Pilates classes — Riverside Pilates</p>
        <p className={styles.resultUrl}>example.com/classes</p>
        <div className={styles.targetRows}>{facts.slice(0, 2).map((fact, index) => <p key={fact.key}><Highlight field={fact.key} index={index} progress={progress} reduced={reduced}>{fact.text}</Highlight></p>)}</div>
      </div>
      <div className={styles.aiExcerpt}>
        <p className={styles.aiLabel}>Illustrative AI answer</p>
        <p className={styles.aiQuestion}>How can I find a suitable session?</p>
        <p><Highlight field="next" index={2} progress={progress} reduced={reduced}>Next step: View the timetable</Highlight></p>
        <div className={styles.citation}><Icon type="file" /><span>Riverside Pilates · Classes</span><span aria-hidden="true">↗</span></div>
      </div>
    </div>
    <p className={styles.outputNote}>Illustrative previews. Inclusion and AI citations are not guaranteed.</p>
  </div>;
}

function EnquiryOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const choices = [
    { title: "Group class", copy: "Explore the class types and who they suit." },
    { title: "Private session", copy: "Check where sessions take place." },
    { title: "Introductory conversation", copy: "Ask questions and find a suitable next step." },
  ];
  return <div className={styles.output}>
    <p className={styles.outputLabel}>Enquiry preview</p>
    <div className={styles.outputSurface}>
      <p className={styles.outputTitle}>Choose a session</p>
      <p className={styles.outputDescription}>Find a class type and a useful next step.</p>
      <div className={styles.choices}>{choices.map((choice, index) => <div key={choice.title}>
        <Highlight field={facts[index].key} index={index} progress={progress} reduced={reduced}>{choice.title}</Highlight>
        <p>{choice.copy}</p>
      </div>)}</div>
      <span className={styles.continue}>Continue <span aria-hidden="true">→</span></span>
    </div>
    <p className={styles.outputNote}>Illustrative enquiry journey; this is not a booking form.</p>
  </div>;
}

function ResourceOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const guides = [
    { title: "Your first class", question: "What happens at a first session?" },
    { title: "Group or private sessions?", question: "Which class type suits me?" },
    { title: "Preparing for your visit", question: "What should I bring?" },
  ];
  return <div className={styles.output}>
    <p className={styles.outputLabel}>Connected guides</p>
    <div className={styles.outputSurface}>
      <p className={styles.outputTitle}>Questions people ask.</p>
      <div className={styles.guides}>{guides.map((guide, index) => <div key={guide.title}>
        <span className={styles.guideLabel}><Icon type="file" />Useful guide</span>
        <Highlight field={facts[index].key} index={index} progress={progress} reduced={reduced}>{guide.title}</Highlight>
        <p>{guide.question}</p>
      </div>)}</div>
    </div>
    <p className={styles.outputNote}>Illustrative content connections.</p>
  </div>;
}

type Connection = { field: string; path: string; fromX: number; fromY: number; toX: number; toY: number };
type DiagramSize = { width: number; height: number; connections: Connection[] };

function ConnectionLine({ connection, index, progress, reduced }: { connection: Connection; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const draw = useTransform(progress, [.14 + index * .12, .4 + index * .12], [0, 1]);
  return <g data-connection={connection.field}>
    <motion.path d={connection.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: reduced ? 1 : draw, opacity: reduced ? 1 : draw }} />
    <motion.circle cx={connection.fromX} cy={connection.fromY} r="3" style={{ opacity: reduced ? 1 : draw }} />
    <motion.circle cx={connection.toX} cy={connection.toY} r="3" style={{ opacity: reduced ? 1 : draw }} />
  </g>;
}

/** Match actual element coordinates rather than guessing line endpoints. */
function Connections({ root, progress, reduced }: { root: RefObject<HTMLDivElement | null>; progress: MotionValue<number>; reduced: boolean }) {
  const [geometry, setGeometry] = useState<DiagramSize | null>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const connections: Connection[] = [];
      for (const fact of facts) {
        const source = node.querySelector<HTMLElement>(`[data-source-fact="${fact.key}"]`);
        const target = node.querySelector<HTMLElement>(`[data-target-fact="${fact.key}"]`);
        if (!source || !target) continue;
        const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
        const fromX = from.right - bounds.left + 2, fromY = from.top + from.height / 2 - bounds.top;
        const toX = to.left - bounds.left - 5, toY = to.top + to.height / 2 - bounds.top;
        const mid = (fromX + toX) / 2;
        connections.push({ field: fact.key, fromX, fromY, toX, toY, path: `M ${fromX} ${fromY} C ${mid} ${fromY}, ${mid} ${toY}, ${toX} ${toY}` });
      }
      setGeometry(previous => {
        const next = { width: bounds.width, height: bounds.height, connections };
        return JSON.stringify(previous) === JSON.stringify(next) ? previous : next;
      });
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    node.querySelectorAll<HTMLElement>("[data-source-fact], [data-target-fact]").forEach(element => observer.observe(element));
    void document.fonts.ready.then(schedule);
    schedule();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); };
  }, [root]);

  if (!geometry) return null;
  return <svg className={styles.connections} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" focusable="false">
    {geometry.connections.map((connection, index) => <ConnectionLine key={connection.field} connection={connection} index={index} progress={progress} reduced={reduced} />)}
  </svg>;
}

function Word({ children, index, total, progress, reduced }: { children: string; index: number; total: number; progress: MotionValue<number>; reduced: boolean }) {
  const start = .02 + index / Math.max(1, total - 1) * .3;
  const opacity = useTransform(progress, [start, start + .22], [.3, 1]);
  const y = useTransform(progress, [start, start + .22], [16, 0]);
  const filter = useTransform(progress, [start, start + .22], ["blur(3px)", "blur(0px)"]);
  return <motion.span className={styles.word} style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y, filter: reduced ? "none" : filter }}>{children}</motion.span>;
}

function Statement({ chapter, row, active, reduced }: { chapter: Chapter; row: RefObject<HTMLLIElement | null>; active: boolean; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target: row, offset: [`start ${entry}`, `end ${entry}`] });
  const progress = useSpring(scrollYProgress, spring);
  const words = chapter.statement.split(" ");
  return <motion.p className={styles.statement} aria-hidden="true" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: reduced ? 0 : .18 }}>
    {words.map((word, index) => <Fragment key={`${word}-${index}`}><Word index={index} total={words.length} progress={progress} reduced={reduced}>{word}</Word>{index < words.length - 1 ? " " : null}</Fragment>)}
  </motion.p>;
}

function StoryChapter({ chapter, row, reduced }: { chapter: Chapter; row: RefObject<HTMLLIElement | null>; reduced: boolean }) {
  const diagram = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: row, offset: [`start ${entry}`, `end ${entry}`] });
  const progress = useSpring(scrollYProgress, spring);
  return <li ref={row} className={styles.chapter} id={`seo-story-${chapter.id}`} data-seo-chapter={chapter.id}>
    <p className={styles.mobileStatement}>{chapter.statement}</p>
    <figure className={styles.chapterFigure} aria-labelledby={`seo-caption-${chapter.id}`}>
      <div className={styles.visual}>
        <p className={styles.illustrationLabel}>Illustrative example · Fictional business</p>
        <div className={styles.diagram} ref={diagram}>
          <SourcePage chapter={chapter} progress={progress} reduced={reduced} />
          {chapter.id === "search" ? <DiscoveryOutput progress={progress} reduced={reduced} /> : chapter.id === "enquiry" ? <EnquiryOutput progress={progress} reduced={reduced} /> : <ResourceOutput progress={progress} reduced={reduced} />}
          <Connections root={diagram} progress={progress} reduced={reduced} />
        </div>
      </div>
      <figcaption id={`seo-caption-${chapter.id}`} className={styles.caption}><h3>{chapter.title}</h3><p>{chapter.caption}</p><span className="sr-only">{chapter.description}</span></figcaption>
    </figure>
  </li>;
}

export function SeoWhyStory({ reduced }: { reduced: boolean }) {
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<HTMLLIElement>(null), second = useRef<HTMLLIElement>(null), third = useRef<HTMLLIElement>(null);
  const [active, setActive] = useState(0);
  const rows = [first, second, third];

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const rowRefs = [first, second, third];
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 0;
      for (const [index, ref] of rowRefs.entries()) {
        if (ref.current && ref.current.getBoundingClientRect().top <= window.innerHeight * entry) current = index;
      }
      setActive(previous => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return <section id="why-seo" className={styles.story} aria-labelledby="why-title">
    <h2 className="sr-only" id="why-title">Why SEO matters.</h2>
    <div className={styles.layout}>
      <div className={styles.sidebar}><div className={styles.sticky}>
        <p className={styles.sidebarTitle} aria-hidden="true">Why SEO matters.</p>
        <div className={styles.statements} data-active-story={chapters[active].id}>{chapters.map((chapter, index) => <Statement key={chapter.id} chapter={chapter} row={rows[index]} active={active === index} reduced={reduced} />)}</div>
      </div></div>
      <ul className={styles.chapters} ref={list} aria-label="Three reasons SEO matters">{chapters.map((chapter, index) => <StoryChapter key={chapter.id} chapter={chapter} row={rows[index]} reduced={reduced} />)}</ul>
    </div>
  </section>;
}
