"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import styles from "./seo-why-story.module.css";

const chapters = [
  { id: "search", statement: "Be found when someone needs your service.", title: "Search & AI discovery", caption: "Connect relevant searches and questions to clear information about your business.", description: "An illustrative AI search recommendation uses location, service and timetable information from a fictional website, with an explicit reference to that page. Inclusion and citations are not guaranteed." },
  { id: "enquiry", statement: "Help interest become an enquiry.", title: "An easier decision", caption: "Answer practical questions and make the next step straightforward.", description: "Beginner-friendly groups lead to a suitable class, studio location helps plan a visit, and the timetable offers a clear enquiry route." },
  { id: "resource", statement: "Build a useful resource over time.", title: "More ways to be found", caption: "Connected service pages and guides answer more of your customers’ questions.", description: "A first-visit guide answers questions about clothing, equipment and arrival. Matching facts appear in an illustrative AI answer with a source reference; inclusion and citations are not guaranteed." },
] as const;
type Chapter = typeof chapters[number];
type FactKey = "location" | "sessions" | "next";
const facts: { key: FactKey; text: string }[] = [
  { key: "location", text: "St Albans" },
  { key: "sessions", text: "Group and private sessions" },
  { key: "next", text: "Timetable and booking" },
];
const detailLabels = {
  search: ["Location", "Services", "Next step"],
  enquiry: ["Class suitability", "Location", "Next step"],
  resource: ["Clothing", "Equipment", "Arrival"],
} as const;
const explanations = {
  search: "Someone asks AI for a local recommendation. Relevant website information can help it describe your business and reference the source. Inclusion is not guaranteed.",
  enquiry: "The visitor can see whether a class suits them, where to go and how to start. The matching labels show which page detail supports each decision.",
  resource: "Content SEO answers a specific customer question. Clear, useful information can also support AI answers that link to your guide. Inclusion is not guaranteed.",
} as const;
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
  const copy = enquiry ? ["Beginner-friendly groups", "Studio in St Albans", "Timetable & first visit"] : resource ? ["Comfortable clothing", "Check mat availability", "Confirm arrival time"] : ["St Albans", "Group and private sessions", "Timetable and booking"];
  const heading = enquiry ? "On-page SEO · Service page" : resource ? "Content SEO · Helpful guide" : "AI search · Your website";
  return <div className={styles.sourcePage} aria-label={enquiry ? "Fictional Riverside Pilates webpage" : resource ? "Fictional Riverside Pilates guide" : "Fictional Riverside Pilates service information"}>
    <div className={styles.panelHeader}><strong>{heading}</strong><span>{enquiry ? "Information on the website" : resource ? "A useful answer on your website" : "Service information on your website"}</span></div>
    <div className={styles.siteHeader}><strong>Riverside Pilates</strong><span>{enquiry ? "Classes · About" : resource ? "Guides · Classes" : "Classes · About"}</span></div>
    {enquiry ? <Image className={styles.studioImage} src="/assets/seo/illustrative-pilates-studio.png" alt="" width={1619} height={971} sizes="(max-width: 600px) 70vw, (max-width: 1100px) 40vw, 24vw" /> : resource ? <div className={styles.articlePreview}><Icon type="file" /><div><span>First-visit guide</span><strong>What should I bring to my first Pilates class?</strong></div></div> : <div className={styles.profilePreview}><span className={styles.profileInitial} aria-hidden="true"><Icon type="file" /></span><div><strong>Local Pilates classes</strong><span className={styles.pageAddress}>riversidepilates.example/classes</span><small>Location, services and how to get started</small></div></div>}
    <div className={styles.siteBody}>
      <p className={styles.siteTitle}>{enquiry ? "Local Pilates classes" : resource ? "Before your first class" : "Information on the page"}</p>
      <ul className={styles.sourceFacts}>{facts.map((fact, index) => <li key={fact.key}>
        <Icon type={resource ? "file" : enquiry ? (["sessions", "location", "next"] as const)[index] : fact.key} /><div className={styles.detail}><span className={styles.detailLabel}>{detailLabels[chapter.id][index]}</span><Highlight field={fact.key} index={index} progress={progress} reduced={reduced} source>{copy[index]}</Highlight></div>
      </li>)}</ul>
      <p className={styles.siteDescription}>{enquiry ? "Find a class that suits you, see where we meet and know what to expect." : resource ? "A practical guide with clear answers, connected to the relevant class page." : "Your page explains where you work, which sessions you offer and how someone can find a suitable class."}</p>
      {(enquiry || resource) && <span className={styles.siteAction}>{resource ? "See beginner classes" : "See classes & enquire"} <span aria-hidden="true">→</span></span>}
    </div>
  </div>;
}

function DiscoveryOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  return <div className={styles.output}>
    <div className={styles.outputSurface}>
      <div className={styles.panelHeader}><strong>AI search recommendation</strong><span>Customer view · Asking AI for a local option</span></div>
      <div className={styles.discoveryQuestion}><span>You ask</span><p>Where can I try Pilates in St Albans?</p></div>
      <div className={styles.discoveryAnswer}>
        <span className={styles.assistantLabel}>AI answer · Illustrative example</span>
        <p className={styles.resultTitle}>Riverside Pilates <sup className={styles.sourceRef} aria-label="Source 1">[1]</sup></p>
        <p><Highlight field="location" index={0} progress={progress} reduced={reduced}>St Albans</Highlight> — Riverside Pilates is a local option to explore.</p>
        <p><Highlight field="sessions" index={1} progress={progress} reduced={reduced}>Group and private sessions</Highlight> are listed on its website, so you can compare the formats.</p>
        <p><Highlight field="next" index={2} progress={progress} reduced={reduced}>Timetable and booking</Highlight> details are on the class page when you’re ready to choose a session.</p>
      </div>
      <div className={styles.discoverySource}><span>Source [1] · Website used in this answer</span><strong>Local Pilates classes — Riverside Pilates</strong><small>riversidepilates.example/classes</small></div>
    </div>
    <p className={styles.outputNote}>Illustrative AI answer. Inclusion and citations are not guaranteed.</p>
  </div>;
}

function EnquiryOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const choices = [
    { title: "A beginner group class", copy: "A suitable starting point if you are new to Pilates." },
    { title: "At the St Albans studio", copy: "Know where to go before choosing a session." },
    { title: "A time that works for you", copy: "Check the timetable and ask about your first visit." },
  ];
  return <div className={styles.output}>
    <div className={styles.outputSurface}>
      <div className={styles.panelHeader}><strong>Plan your first class</strong><span>Customer view · Before enquiring</span></div>
      <div className={styles.choices}>{choices.map((choice, index) => <div key={choice.title}>
        <span className={styles.detailLabel}>{detailLabels.enquiry[index]}</span>
        <Highlight field={facts[index].key} index={index} progress={progress} reduced={reduced}>{choice.title}</Highlight>
        <p>{choice.copy}</p>
      </div>)}</div>
      <span className={styles.continue}>Enquire about a class <span aria-hidden="true">→</span></span>
    </div>
    <p className={styles.outputNote}>Illustrative enquiry journey; this is not a booking form.</p>
  </div>;
}

function ResourceOutput({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const answers = [
    { title: "Comfortable clothing", copy: "Wear something you can move in comfortably." },
    { title: "Check mat availability", copy: "Ask the studio whether a mat is provided." },
    { title: "Confirm arrival time", copy: "Check when to arrive before your first session." },
  ];
  return <div className={styles.output}>
    <div className={styles.outputSurface}>
      <div className={styles.panelHeader}><strong>AI answer preview</strong><span>Customer view · Researching a first visit</span></div>
      <div className={styles.answerQuestion}><Icon type="search" /><span>What should I bring to Pilates?</span></div>
      <div className={styles.guides}>{answers.map((answer, index) => <div key={answer.title}>
        <span className={styles.guideLabel}><Icon type="file" />{detailLabels.resource[index]}</span>
        <Highlight field={facts[index].key} index={index} progress={progress} reduced={reduced}>{answer.title}</Highlight>
        <p>{answer.copy}</p>
      </div>)}</div>
      <div className={styles.answerSource}><Icon type="file" /><span>Source: Riverside Pilates · First-visit guide</span></div>
    </div>
    <p className={styles.outputNote}>Illustrative AI answer. Inclusion and citations are not guaranteed.</p>
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
        // Leave each surface horizontally before bending, keeping lines off its copy.
        const sourceBounds = source.closest(`.${styles.sourcePage}`)?.getBoundingClientRect();
        const targetBounds = target.closest(`.${styles.outputSurface}`)?.getBoundingClientRect();
        const sourceEdge = sourceBounds ? sourceBounds.right - bounds.left + 8 : fromX;
        const targetEdge = targetBounds ? targetBounds.left - bounds.left - 8 : toX;
        const mid = (sourceEdge + targetEdge) / 2;
        connections.push({ field: fact.key, fromX, fromY, toX, toY, path: `M ${fromX} ${fromY} L ${sourceEdge} ${fromY} C ${mid} ${fromY}, ${mid} ${toY}, ${targetEdge} ${toY} L ${toX} ${toY}` });
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
        <div className={`${styles.diagram} ${chapter.id === "search" ? styles.discoveryTheme : chapter.id === "resource" ? styles.contentTheme : ""}`} ref={diagram}>
          <SourcePage chapter={chapter} progress={progress} reduced={reduced} />
          {chapter.id === "search" ? <DiscoveryOutput progress={progress} reduced={reduced} /> : chapter.id === "enquiry" ? <EnquiryOutput progress={progress} reduced={reduced} /> : <ResourceOutput progress={progress} reduced={reduced} />}
          <Connections root={diagram} progress={progress} reduced={reduced} />
        </div>
      </div>
      <figcaption id={`seo-caption-${chapter.id}`} className={styles.caption}><h3>{chapter.title}</h3><p>{chapter.caption}</p><div className={styles.explanation}><strong>What this shows</strong><p>{explanations[chapter.id]}</p></div><span className="sr-only">{chapter.description}</span></figcaption>
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
