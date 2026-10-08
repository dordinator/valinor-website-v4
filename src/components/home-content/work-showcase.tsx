"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import styles from "./work-showcase.module.css";

const projects = [
  {
    name: "UniFluent", headline: ["Selected work.", "The same attention to detail."],
    href: "https://unifluent.co.uk/",
    image: "/assets/studio-previews/unifluent-hero.png",
    description: "A website for an Emesord language-learning product.",
  },
  {
    name: "NJH Sports Therapy and Pilates", headline: ["Clear journeys.", "From finding you to booking with you."],
    href: "https://www.njhsportstherapy.co.uk/",
    image: "/assets/studio-previews/njh-sports-therapy-hero.png",
    description: "A website for an independent sports therapy and Pilates practice.",
  },
  {
    name: "Canadian Citizenship Hub", headline: ["Specialist services.", "Made clear and easy to navigate."],
    href: "https://www.canadiancitizenshiphub.com/",
    image: "/assets/studio-previews/canadian-citizenship-hub-hero.png",
    description: "A website for a specialist Canadian citizenship service.",
  },
  {
    name: "RT Performance", headline: ["Different businesses.", "A website with its own character."],
    href: null,
    image: "/assets/studio-previews/rt-performance-hero.png",
    description: "An automotive website showcasing the cars and the work.",
  },
] as const;

// A word-by-word reveal, without adding another scroll controller.
const wordSpring = { stiffness: 130, damping: 30, mass: .35 };

function RevealWord({ word, index, total, progress, reduced }: {
  word: string; index: number; total: number; progress: MotionValue<number>; reduced: boolean;
}) {
  const start = .04 + index / Math.max(1, total - 1) * .55;
  const end = start + .25;
  const opacity = useTransform(progress, [start, end], [.28, 1]);
  const y = useTransform(progress, [start, end], [18, 0]);
  const filter = useTransform(progress, [start, end], ["blur(4px)", "blur(0px)"]);

  return <motion.span className={styles.revealWord} aria-hidden="true"
    style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y, filter: reduced ? "none" : filter }}>{word}</motion.span>;
}

function WorkStatement({ project, rowRef, active, reduced }: {
  project: typeof projects[number]; rowRef: RefObject<HTMLLIElement | null>; active: boolean; reduced: boolean;
}) {
  // The phrase writes itself in over the last stretch of the project's rise, and is complete as the project
  // reaches the middle of the screen, level with this text.
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start 60%", "center 52%"] });
  const eased = useSpring(scrollYProgress, wordSpring);
  const lines = project.headline.map(line => line.split(" "));
  const total = lines[0].length + lines[1].length;

  return <motion.div className={styles.statement} aria-hidden={!active}
    initial={false} animate={{ opacity: active ? 1 : 0 }}
    transition={{ duration: reduced ? 0 : .18 }}>
    {lines.map((words, lineIndex) => <p className={lineIndex === 0 ? styles.lead : undefined} key={lineIndex}>
      <span className="sr-only">{project.headline[lineIndex]}</span>
      {words.map((word, wordIndex) => <Fragment key={`${wordIndex}-${word}`}>
        <RevealWord word={word} index={wordIndex + (lineIndex === 0 ? 0 : lines[0].length)} total={total} progress={eased} reduced={reduced} />
        {wordIndex < words.length - 1 && <span aria-hidden="true"> </span>}
      </Fragment>)}
    </p>)}
  </motion.div>;
}

function Project({ project, rowRef }: { project: typeof projects[number]; rowRef: RefObject<HTMLLIElement | null> }) {
  const ref = rowRef;
  const reduced = useReducedMotion();
  // Progress follows the project's own centre: 0 as it enters at the bottom of the screen, .5 when it is level with the
  // pinned text in the middle, 1 as it leaves at the top. It is sharp, bright and full size only around .5, so each
  // project comes into focus exactly in line with its text. All four are the same size.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["center end", "center start"] });
  const opacity = useTransform(scrollYProgress, [.18, .42, .58, .82], [.3, 1, 1, .3]);
  const scale = useTransform(scrollYProgress, [.18, .42, .58, .82], [.92, 1, 1, .92]);
  const filter = useTransform(scrollYProgress, [.18, .42, .58, .82], ["blur(7px)", "blur(0px)", "blur(0px)", "blur(7px)"]);

  return (
    <motion.li ref={ref} className={styles.project} style={{ opacity: reduced ? 1 : opacity }}>
      <div className={styles.projectContent}>
        <motion.div className={styles.focus} style={reduced ? undefined : { scale, filter }}>
          {project.href
            ? <a className={styles.image} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} website, opens in a new tab`}>
              <Image src={project.image} alt={`${project.name} website preview`} width={1280} height={720} sizes="(max-width: 800px) 90vw, (max-width: 1400px) 43vw, 550px" />
            </a>
            : <div className={styles.image}>
              <Image src={project.image} alt={`${project.name} website preview`} width={1280} height={720} sizes="(max-width: 800px) 90vw, (max-width: 1400px) 43vw, 550px" />
            </div>}
        </motion.div>
        <div className={styles.description}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      </div>
    </motion.li>
  );
}

export function WorkShowcase() {
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<HTMLLIElement>(null);
  const second = useRef<HTMLLIElement>(null);
  const third = useRef<HTMLLIElement>(null);
  const fourth = useRef<HTMLLIElement>(null);
  const rows = [first, second, third, fourth];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const rowRefs = [first, second, third, fourth];
    const desktop = window.matchMedia("(min-width: 801px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches) {
        setActive(0);
        return;
      }
      // The text belongs to whichever project is nearest the middle of the screen, so text and image change together.
      const line = window.innerHeight / 2;
      let incoming = 0, nearest = Infinity;
      rowRefs.forEach((ref, index) => {
        if (!ref.current) return;
        const bounds = ref.current.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - line);
        if (distance < nearest) { nearest = distance; incoming = index; }
      });
      setActive(current => current === incoming ? current : incoming);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section id="work" className={styles.work} aria-labelledby="home-work-title" data-work-reading>
      <h2 id="home-work-title" className="sr-only">Selected work.</h2>
      <div className={styles.container}>
        <div className={styles.headingColumn}>
          <div className={styles.heading}>
            <div className={styles.headingCopy} data-active-project={projects[active].name}>
              {projects.map((project, index) => (
                <WorkStatement key={project.name} project={project} rowRef={rows[index]} active={active === index} reduced={reduced ?? false} />
              ))}
            </div>
          </div>
        </div>
        <ul ref={list} className={styles.projects} aria-label="Selected websites">
          {projects.map((project, index) => <Project key={project.name} project={project} rowRef={rows[index]} />)}
        </ul>
      </div>
    </section>
  );
}
