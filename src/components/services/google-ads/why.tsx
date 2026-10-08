"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ServiceFocus, ServiceWhyStory, type ServiceStoryChapter } from "../service-page";
import { calculateAcquisition, calculateAverageCpc } from "./acquisition-example";
import styles from "./why.module.css";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 2 });

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}

function SearchToWebsite() {
  const root = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLSpanElement>(null);
  const target = useRef<HTMLSpanElement>(null);
  const [connection, setConnection] = useState({ width: 1, height: 1, path: "" });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start .85", "end .5"] });
  const pathLength = useTransform(scrollYProgress, [.12, .5], [0, 1]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let alive = true;
    const measure = () => {
      if (!alive || !source.current || !target.current) return;
      const box = node.getBoundingClientRect();
      const from = source.current.getBoundingClientRect();
      const to = target.current.getBoundingClientRect();
      const x1 = from.right - box.left + 4, y1 = from.top - box.top + from.height / 2;
      const x2 = to.left - box.left - 4, y2 = to.top - box.top + to.height / 2;
      const bend = Math.max(22, (x2 - x1) * .45);
      setConnection({ width: box.width, height: box.height, path: `M ${x1} ${y1} C ${x1 + bend} ${y1 - 48}, ${x2 - bend} ${y2 - 48}, ${x2} ${y2}` });
    };
    const observer = new ResizeObserver(measure);
    [node, source.current, target.current].forEach(element => { if (element) observer.observe(element); });
    void document.fonts.ready.then(measure);
    measure();
    return () => { alive = false; observer.disconnect(); };
  }, []);

  return <div className={styles.searchScene}>
    <p className={styles.exampleLabel}>Illustrative example · Fictional business</p>
    <div ref={root} className={styles.searchPair}>
      <div className={styles.searchResult} aria-label="Illustrative sponsored Google Search result">
        <p className={styles.googleWord}>Google</p>
        <div className={styles.query}><span>Pilates classes in St Albans</span><SearchIcon /></div>
        <div className={styles.searchTabs} aria-hidden="true"><span>All</span><span>Maps</span><span>Images</span><span>More</span></div>
        <div className={styles.adCopy}>
          <p className={styles.sponsored}>Sponsored</p>
          <div className={styles.adIdentity}><span className={styles.studioMark} aria-hidden="true">R</span><div>Riverside Pilates<small>example.com/classes</small></div></div>
          <p className={styles.adTitle}>Pilates classes in <span ref={source}><ServiceFocus>St Albans</ServiceFocus></span></p>
          <p className={styles.adDescription}>Group and private sessions. Find your next class.</p>
        </div>
      </div>
      <div className={styles.website} aria-label="Illustrative Riverside Pilates landing page">
        <div className={styles.websiteNav}><strong>Riverside Pilates</strong><span>Classes&nbsp; · &nbsp;Contact</span></div>
        <Image src="/assets/seo/illustrative-pilates-studio.png" alt="Sunlit Pilates studio with a mat and plants" width={1619} height={971} sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 350px" className={styles.studioImage} />
        <div className={styles.websiteBody}>
          <p className={styles.websiteTitle}>Pilates classes in <span ref={target}><ServiceFocus>St Albans</ServiceFocus></span></p>
          <p>Group and private sessions.<br />Find a class that fits your week.</p>
          <span className={styles.previewAction}>View classes <span aria-hidden="true">→</span></span>
        </div>
      </div>
      <svg className={styles.connection} viewBox={`0 0 ${connection.width} ${connection.height}`} fill="none" aria-hidden="true"><motion.path d={connection.path} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ pathLength: reduced ? 1 : pathLength }} /></svg>
    </div>
  </div>;
}

const campaignTerms = [
  { id: "private", text: "private pilates near me", destination: "private", decision: "Private sessions", excluded: false },
  { id: "group", text: "pilates classes St Albans", destination: "group", decision: "Group classes", excluded: false },
  { id: "jobs", text: "pilates instructor jobs", destination: "excluded", decision: "Exclude employment searches", excluded: true },
  { id: "training", text: "pilates teacher training", destination: "excluded", decision: "Exclude training searches", excluded: true },
] as const;
const campaignDecisions = [
  { id: "private", title: "Private sessions", detail: "Dedicated ads and landing page" },
  { id: "group", title: "Group classes", detail: "Separate service ad group" },
  { id: "excluded", title: "Excluded searches", detail: "Jobs · Teacher training" },
] as const;
type CampaignConnection = { id: string; path: string; x1: number; y1: number; x2: number; y2: number };

function CampaignFact({ children, progress, order, reduced, excluded = false }: { children: ReactNode; progress: MotionValue<number>; order: number; reduced: boolean; excluded?: boolean }) {
  const start = .04 + order * .13;
  const reveal = useTransform(progress, [start, start + .2], [0, 1]);
  const opacity = useTransform(progress, [start, start + .2], [1, .72]);
  return <motion.span className={`${styles.campaignFact} ${excluded ? styles.rejectedFact : ""}`} style={{ opacity: excluded ? reduced ? .72 : opacity : 1 }}>
    <motion.span aria-hidden="true" className={excluded ? styles.strike : styles.campaignInk} style={excluded ? { scaleX: reduced ? 1 : reveal } : { opacity: reduced ? 1 : reveal }} />
    {children}
  </motion.span>;
}

function CampaignConnector({ connection, progress, order, reduced, excluded }: { connection: CampaignConnection; progress: MotionValue<number>; order: number; reduced: boolean; excluded: boolean }) {
  const start = .04 + order * .13;
  const draw = useTransform(progress, [start, start + .2], [0, 1]);
  const endpoint = useTransform(progress, [start + .15, start + .2], [0, 1]);
  return <g className={excluded ? styles.rejectedConnection : undefined}>
    <motion.path d={connection.path} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ pathLength: reduced ? 1 : draw }} />
    <motion.circle cx={connection.x1} cy={connection.y1} r="2.8" fill="currentColor" stroke="none" style={{ opacity: reduced ? 1 : draw }} />
    <motion.circle cx={connection.x2} cy={connection.y2} r="2.8" fill="currentColor" stroke="none" style={{ opacity: reduced ? 1 : endpoint }} />
  </g>;
}

function CampaignPriorities() {
  const root = useRef<HTMLDivElement>(null);
  const sourceNodes = useRef<Record<string, HTMLSpanElement | null>>({});
  const targetNodes = useRef<Record<string, HTMLSpanElement | null>>({});
  const [geometry, setGeometry] = useState<{ width: number; height: number; connections: CampaignConnection[] }>({ width: 1, height: 1, connections: [] });
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: root, offset: ["start .85", "end .55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: .4 });

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let alive = true;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!alive) return;
      const box = node.getBoundingClientRect();
      const connections = campaignTerms.flatMap((term, index) => {
        const source = sourceNodes.current[term.id];
        const target = targetNodes.current[term.destination];
        if (!source || !target) return [];
        const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
        const x1 = from.right - box.left + 7, y1 = from.top - box.top + from.height / 2;
        const x2 = to.left - box.left - 9, y2 = to.top - box.top + to.height / 2 + (term.excluded ? index === 2 ? -4 : 4 : 0);
        const bend = Math.max(24, (x2 - x1) * .48);
        return [{ id: term.id, x1, y1, x2, y2, path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}` }];
      });
      setGeometry({ width: box.width, height: box.height, connections });
    };
    const schedule = () => { if (alive && !frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    [node, ...Object.values(sourceNodes.current), ...Object.values(targetNodes.current)].forEach(element => { if (element) observer.observe(element); });
    void document.fonts.ready.then(schedule);
    schedule();
    return () => { alive = false; cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  return <div ref={root} className={styles.campaignScene}>
    <div className={styles.termReview}>
      <p className={styles.reviewBusiness}>Riverside Pilates</p>
      <h4>Search terms</h4>
      <p className={styles.reviewIntroduction}>Understand what people are looking for.</p>
      <ul className={styles.termList} aria-label="Search terms and campaign decisions">
        {campaignTerms.map((term, index) => <li key={term.id}>
          <SearchIcon />
          <div><span ref={node => { sourceNodes.current[term.id] = node; }} data-campaign-source={term.id}>
            <CampaignFact progress={progress} order={index} reduced={reduced} excluded={term.excluded}>{term.text}</CampaignFact>
          </span><span className="sr-only">. Decision: {term.decision}.</span><span className={styles.mobileDecision} aria-hidden="true">{term.excluded ? "−" : "→"} {term.decision}</span></div>
        </li>)}
      </ul>
      <p className={styles.reviewDisclaimer}>Illustrative example · Fictional business</p>
    </div>
    <div className={styles.campaignDecisionPanel}>
      <h4>Campaign decisions</h4>
      <ul className={styles.decisionList}>
        {campaignDecisions.map((decision, index) => <li key={decision.id}>
          <p className={styles.decisionTitle}><span ref={node => { targetNodes.current[decision.id] = node; }} data-campaign-target={decision.id}>
            <CampaignFact progress={progress} order={index} reduced={reduced} excluded={decision.id === "excluded"}>{decision.title}</CampaignFact>
          </span></p>
          <p className={styles.decisionDetail}>{decision.detail}</p>
        </li>)}
      </ul>
      <p className={styles.bookingGoal}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="10" cy="10" r="8" /><path d="m6 10 3 3 5-6" /></svg>Primary goal: completed booking</p>
    </div>
    <svg className={styles.campaignConnections} viewBox={`0 0 ${geometry.width} ${geometry.height}`} fill="none" aria-hidden="true">
      {geometry.connections.map((connection, index) => <CampaignConnector key={connection.id} connection={connection} progress={progress} order={index} reduced={reduced} excluded={campaignTerms[index].excluded} />)}
    </svg>
  </div>;
}

function CustomerCost() {
  const [mode, setMode] = useState<"clicks" | "customers">("clicks");
  const [spend, setSpend] = useState("500");
  const [clicks, setClicks] = useState("250");
  const [customers, setCustomers] = useState("3");
  const id = useId();
  const count = mode === "clicks" ? clicks : customers;
  const valid = spend.trim() !== "" && count.trim() !== "" && Number.isFinite(Number(spend)) && Number(spend) >= 0 && Number.isInteger(Number(count)) && Number(count) >= 0;
  const acquisition = valid ? calculateAcquisition(Number(spend), Number(count), 0) : null;
  const cost = !valid ? null : mode === "clicks" ? calculateAverageCpc(Number(spend), Number(count)) : acquisition?.cost ?? null;

  return <div className={styles.costScene}>
    <div className={styles.costModes} role="group" aria-label="Explore campaign costs">
      <button type="button" aria-pressed={mode === "clicks"} aria-controls={`${id}-example`} onClick={() => setMode("clicks")}>Cost per click (CPC)</button>
      <button type="button" aria-pressed={mode === "customers"} aria-controls={`${id}-example`} onClick={() => setMode("customers")}>Customer cost</button>
    </div>
    <div id={`${id}-example`}>
      <div className={styles.compactResult} aria-live="polite" aria-atomic="true">
        <p>{mode === "clicks" ? "Average cost per click" : "Cost to acquire a customer"}</p>
        <div><strong>{cost !== null ? money.format(cost) : "—"}</strong><span>{mode === "clicks" ? "per click" : "per customer"}</span></div>
        <p className={styles.compactEquation}>{cost !== null ? `${money.format(mode === "clicks" ? Number(spend) : acquisition!.total)} ÷ ${count} ${mode === "clicks" ? Number(count) === 1 ? "click" : "clicks" : Number(count) === 1 ? "customer" : "customers"}` : valid ? `Add ${mode === "clicks" ? "clicks" : "customers"} to calculate a cost.` : "Enter a valid spend and a whole count."}</p>
      </div>
      <div className={styles.compactInputs}>
        <div><label htmlFor={`${id}-spend`}>Ad spend</label><div className={styles.compactInput}><span aria-hidden="true">£</span><input id={`${id}-spend`} type="number" inputMode="decimal" min="0" step="any" value={spend} onChange={event => setSpend(event.target.value)} /></div></div>
        <div><label htmlFor={`${id}-count`}>{mode === "clicks" ? "Ad clicks" : "New customers"}</label><div className={styles.compactInput}><input id={`${id}-count`} type="number" inputMode="numeric" min="0" step="1" value={count} onChange={event => mode === "clicks" ? setClicks(event.target.value) : setCustomers(event.target.value)} /></div></div>
      </div>
      <p className={styles.compactNote}>{mode === "clicks" ? "CPC uses ad spend only. A click is a visit, not a new customer." : `Customer cost includes ${acquisition ? money.format(acquisition.management) : "the"} management fee: 15% of spend, minimum £100.`}</p>
    </div>
    <p className={styles.costDisclaimer}>Illustrative figures · Same period · Not client results</p>
  </div>;
}

const chapters = [
  { id: "search-demand", statement: "Reach people already looking for your services.", title: "Search demand", description: "Reach searchers while your organic visibility develops.", visual: <SearchToWebsite /> },
  { id: "campaign-priorities", statement: "Put your budget behind your priorities.", title: "Deliberate targeting", description: "Match the search to the right offer. Keep unsuitable intent out.", visual: <CampaignPriorities /> },
  { id: "customer-cost", statement: "Understand what a new customer costs.", title: "Clear commercial decisions", description: "Start with the cost of a click. Then measure which clicks become customers.", visual: <CustomerCost /> },
] as const satisfies readonly ServiceStoryChapter[];

export function GoogleAdsWhy() {
  return <ServiceWhyStory id="why-google-ads" title="Why Google Ads matter." chapters={chapters} className={styles.story} />;
}
