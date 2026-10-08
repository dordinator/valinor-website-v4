"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { createContext, Fragment, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { SiteFooter } from "@/components/site-footer";
import styles from "./service-page.module.css";

export type ServiceCategory = {
  id: string; label: string; note: string;
  items: readonly { title: string; deliverables: readonly string[] }[];
};
export type ServiceStoryChapter = { id: string; statement: string; statementBreakAfter?: number; title: string; description: string; visual: ReactNode };
export type ServiceFaqItem = { id: string; question: string; answer: ReactNode };
const ease = [.4, 0, .2, 1] as const;
const wordSpring = { stiffness: 130, damping: 30, mass: .35 };
const StoryMotion = createContext<{ progress: MotionValue<number>; reduced: boolean } | null>(null);

/** Highlight the information being carried through a service example as it is read. */
export function ServiceFocus({ children, order = 0 }: { children: ReactNode; order?: number }) {
  const context = useContext(StoryMotion);
  const fallback = useMotionValue(1);
  const opacity = useTransform(context?.progress ?? fallback, [.08 + order * .12, .32 + order * .12], [0, 1]);
  return <span className={styles.focusFact}><motion.span className={styles.focusInk} aria-hidden="true" style={{ opacity: context?.reduced ? 1 : opacity }} /><span>{children}</span></span>;
}

export function ServicePageShell({ children }: { children: ReactNode }) {
  return <div className={`${styles.page} ${headingFont.variable} ${bodyFont.variable}`} data-fluid-page>
    <FluidBackground fullPage /><HomeHeader overHero />
    <main className={styles.content}>{children}</main>
    <SiteFooter />
  </div>;
}

export function ServiceHero({ id, lines, description }: { id: string; lines: readonly string[]; description: string; next?: string }) {
  return <section className={`${styles.scene} ${styles.hero}`} aria-labelledby={id}>
    <div className={styles.heroInner}>
      <h1 id={id}>{lines.map(line => <span key={line}>{line}</span>)}</h1>
      <p>{description}</p><div className={styles.heroAction}><LiquidCallLink /></div>
    </div>
  </section>;
}

function StoryWord({ word, index, total, progress, reduced }: { word: string; index: number; total: number; progress: MotionValue<number>; reduced: boolean }) {
  const start = .02 + index / Math.max(1, total - 1) * .3;
  const opacity = useTransform(progress, [start, start + .22], [.3, 1]);
  const y = useTransform(progress, [start, start + .22], [16, 0]);
  const filter = useTransform(progress, [start, start + .22], ["blur(3px)", "blur(0px)"]);
  return <motion.span className={styles.word} style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y, filter: reduced ? "none" : filter }}>{word}</motion.span>;
}

function StoryStatement({ chapter, row, active, reduced }: { chapter: ServiceStoryChapter; row: RefObject<HTMLLIElement | null>; active: boolean; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target: row, offset: ["start .8", "end .8"] });
  const progress = useSpring(scrollYProgress, wordSpring);
  const words = chapter.statement.split(" ");
  return <motion.p className={styles.statement} data-statement-break={chapter.statementBreakAfter || undefined} aria-hidden="true" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: reduced ? 0 : .18 }}>
    {words.map((word, index) => <Fragment key={`${word}-${index}`}><StoryWord word={word} index={index} total={words.length} progress={progress} reduced={reduced} />{index + 1 === chapter.statementBreakAfter ? <br /> : index < words.length - 1 ? " " : null}</Fragment>)}
  </motion.p>;
}

function StoryChapter({ chapter, row, index, reduced }: { chapter: ServiceStoryChapter; row: RefObject<HTMLLIElement | null>; index: number; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target: row, offset: ["start .8", "end .8"] });
  const progress = useSpring(scrollYProgress, wordSpring);
  const y = useTransform(progress, [0, .65, 1], [18, 0, -10]);
  const opacity = useTransform(progress, [0, .18, 1], [.55, 1, 1]);
  const captionY = useTransform(progress, [.06, .4], [12, 0]);
  const captionOpacity = useTransform(progress, [.06, .4], [.5, 1]);
  const words = chapter.statement.split(" ");

  return <li ref={row} className={styles.chapter} data-service-chapter-index={index}>
    <p className={styles.mobileStatement} data-statement-break={chapter.statementBreakAfter || undefined}>
      <span className="sr-only">{chapter.statement}</span>
      <span aria-hidden="true">{words.map((word, wordIndex) => <Fragment key={`${word}-${wordIndex}`}><StoryWord word={word} index={wordIndex} total={words.length} progress={progress} reduced={reduced} />{wordIndex + 1 === chapter.statementBreakAfter ? <br /> : wordIndex < words.length - 1 ? " " : null}</Fragment>)}</span>
    </p>
    <figure className={styles.chapterFigure}>
      <motion.div className={styles.storyVisual} style={{ y: reduced ? 0 : y, opacity: reduced ? 1 : opacity }}><StoryMotion.Provider value={{ progress, reduced }}>{chapter.visual}</StoryMotion.Provider></motion.div>
      <motion.figcaption className={styles.storyCaption} style={{ y: reduced ? 0 : captionY, opacity: reduced ? 1 : captionOpacity }}><h3>{chapter.title}</h3><p>{chapter.description}</p></motion.figcaption>
    </figure>
  </li>;
}

/** Service-specific visuals explain relevance; deliverables live in their own section. */
export function ServiceWhyStory({ id, title, chapters, className = "" }: { id: string; title: string; chapters: readonly ServiceStoryChapter[]; className?: string }) {
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<HTMLLIElement>(null), second = useRef<HTMLLIElement>(null), third = useRef<HTMLLIElement>(null);
  const rows = [first, second, third];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 0;
      [first, second, third].forEach((row, index) => {
        if (row.current && row.current.getBoundingClientRect().top <= window.innerHeight * .55) current = index;
      });
      setActive(previous => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node); update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return <section id={id} className={`${styles.story} ${className}`} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className="sr-only">{title}</h2>
    <div className={styles.storyLayout}>
      <div className={styles.sidebar}><div className={styles.sticky}>
        <p className={styles.sidebarTitle} aria-hidden="true">{title}</p>
        <div className={styles.statements}>{chapters.map((chapter, index) => <StoryStatement key={chapter.id} chapter={chapter} row={rows[index]} active={active === index} reduced={reduced} />)}</div>
      </div></div>
      <ul ref={list} className={styles.chapters} aria-label={title}>
        {chapters.map((chapter, index) => <StoryChapter key={chapter.id} chapter={chapter} row={rows[index]} index={index} reduced={reduced} />)}
      </ul>
    </div>
  </section>;
}

export function ServiceDeliverables({ id = "the-work", title = "What we deliver.", categories }: { id?: string; title?: string; categories: readonly ServiceCategory[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const key = useId();
  const reduced = useReducedMotion() ?? false;

  function focusTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") next = (index + categories.length - 1) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault(); root.current?.querySelector<HTMLButtonElement>(`[data-delivery-tab="${next}"]`)?.focus();
  }

  return <section id={id} className={`${styles.scene} ${styles.work}`} aria-labelledby={`${id}-title`}>
    <div className={styles.container}><h2 id={`${id}-title`}>{title}</h2>
      <motion.div ref={root} layoutScroll className={styles.categoryBar} role="tablist" aria-label="Areas of delivery" data-lenis-prevent-horizontal>
        {categories.map((category, index) => <button key={category.id} id={`${key}-tab-${category.id}`} role="tab" type="button" data-delivery-tab={index}
          aria-selected={active === index} aria-controls={`${key}-panel-${category.id}`} tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)} onFocus={event => { setActive(index); if (root.current && root.current.scrollWidth > root.current.clientWidth) event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" }); }}
          onKeyDown={event => focusTab(event, index)}>{category.label}
          {active === index && <motion.span className={styles.tabUnderline} layoutId={`${key}-underline`} aria-hidden="true" transition={{ layout: reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32, mass: .7 } }} />}
        </button>)}
      </motion.div>
      {categories.map((category, index) => <div key={category.id} id={`${key}-panel-${category.id}`} role="tabpanel" aria-labelledby={`${key}-tab-${category.id}`} hidden={active !== index} tabIndex={0} className={styles.categoryPanel}>
        <motion.div key={`${category.id}-${active}`} className={styles.actionGrid}
          initial={reduced ? false : "hidden"} whileInView={active === index ? "shown" : undefined} viewport={{ once: true, amount: .3 }}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: reduced ? 0 : .12 } } }}>
          {category.items.map(item => <motion.article key={item.title} className={styles.actionItem}
            variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .52, ease, when: "beforeChildren", staggerChildren: reduced ? 0 : .07 } } }}>
            <h3>{item.title}</h3><ul className={styles.deliverableList}>{item.deliverables.map(deliverable => <li key={deliverable}>
              <svg className={styles.deliveryCheck} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><motion.path d="m4 10 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }} transition={{ duration: reduced ? 0 : .24, ease }} /></svg>{deliverable}
            </li>)}</ul>
          </motion.article>)}
        </motion.div>
      </div>)}
      <p className={styles.deliveryNote}>{categories[active]?.note}</p>
    </div>
  </section>;
}

export function ServiceFaq({ id = "faq", title = "A few useful answers.", items }: { id?: string; title?: string; items: readonly ServiceFaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const key = useId();
  return <section id={id} className={`${styles.scene} ${styles.faq}`} aria-labelledby={`${id}-title`}>
    <div className={styles.container}><h2 id={`${id}-title`}>{title}</h2><div className={styles.questions}>
      {items.map((item, index) => <article id={item.id} className={styles.question} key={item.id} data-open={open === index || undefined}>
        <h3><button type="button" id={`${key}-question-${index}`} aria-expanded={open === index} aria-controls={`${key}-answer-${index}`} onClick={() => setOpen(current => current === index ? null : index)}>{item.question}<span className={styles.plus} aria-hidden="true" /></button></h3>
        <div className={styles.answer} role="region" id={`${key}-answer-${index}`} aria-labelledby={`${key}-question-${index}`} aria-hidden={open !== index} inert={open !== index}><div>{item.answer}</div></div>
      </article>)}
    </div></div>
  </section>;
}

export function ServiceClosing({ id = "start", lines, description }: { id?: string; lines: readonly string[]; description: string }) {
  return <section id={id} className={`${styles.scene} ${styles.closing}`} aria-labelledby={`${id}-title`}><div>
    <h2 id={`${id}-title`}>{lines.map(line => <span key={line}>{line}</span>)}</h2><p>{description}</p><LiquidCallLink />
  </div></section>;
}
