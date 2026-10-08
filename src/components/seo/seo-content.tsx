"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { SeoWhyStory } from "./seo-why-story";
import styles from "./seo-content.module.css";

const workCategories = [
  { id: "website", label: "Website SEO", note: "Implemented on your website, within the agreed scope.", items: [
    { title: "Technical fixes", deliverables: ["Indexing and crawlability fixes", "Structured data and metadata updates", "Mobile and speed improvements"] },
    { title: "On-page updates", deliverables: ["Page titles, headings and copy", "Links between related pages", "Updates to priority service pages"] },
    { title: "Website improvements", deliverables: ["Content and image updates", "Layout and navigation refinements", "Clearer enquiry and booking routes"] },
  ] },
  { id: "content", label: "Content & AI search", note: "Content volume and AI visibility work follow your package and agreed priorities.", items: [
    { title: "Research & a content plan", deliverables: ["Keyword and competitor research", "Customer questions and content gaps", "A prioritised content plan"] },
    { title: "Written & published content", deliverables: ["New blogs and useful guides", "New or reworked service pages", "Editing, formatting and publication"] },
    { title: "AI search readiness", deliverables: ["Direct answers and FAQs", "Clear structure and supporting links", "AI visibility findings for agreed topics"] },
  ] },
  { id: "local", label: "Local SEO", note: "Local work applies where relevant. Profile coverage and ongoing updates follow your package.", items: [
    { title: "Google Business Profile", deliverables: ["Primary profile setup and optimisation", "Services, hours, photos and contact details", "Relevant profile updates"] },
    { title: "Maps & local pages", deliverables: ["Corrections on agreed maps and directories", "Duplicate listing correction requests", "Service and location page updates"] },
    { title: "Reviews & testimonials", deliverables: ["A review and testimonial request process", "Invitation templates and review links", "A permission-based publishing workflow"] },
  ] },
  { id: "authority", label: "Links & authority", note: "Outreach scope follows your package. External sites decide whether to publish changes or links.", items: [
    { title: "An outreach plan", deliverables: ["Relevant publications and partners", "A shortlist of link opportunities", "Prioritised outreach targets"] },
    { title: "Outreach & follow-up", deliverables: ["Targeted link and mention requests", "Follow-up on agreed opportunities", "A record of requests and responses"] },
    { title: "External profiles & links", deliverables: ["Updates to agreed external profiles", "Profile correction requests", "Published link and listing checks"] },
  ] },
] as const;

const faqs = [
  { id: "site-access", question: "Is my existing website suitable?", answer: <p>We start by reviewing your current website and arranging authorised access, or working with your website manager. If the site needs replacing, we’ll explain why and discuss the options. <Link href="/web-design">Explore web design →</Link></p> },
  { id: "included", question: "What’s included, and what does it cost?", answer: <p>Core is £995/month for agreed content, technical SEO, relevant authority work and website improvements, with monthly reporting. Hosting, security and support are included for agreed managed sites. The higher-capacity £2,995 tier and content quantities remain proposed. <Link href="/working-together#options">Compare packages →</Link></p> },
  { id: "ai-search", question: "Is AI search included?", answer: <p>Yes. AEO — answer engine optimisation — is part of the SEO work. We research customer questions, create useful answers, improve page structure and use suitable structured data. We review available AI visibility alongside organic search; appearances and citations cannot be guaranteed.</p> },
  { id: "progress", question: "How do we assess progress?", answer: <p>We record a starting point, agree priorities and report what changed each month. We look at available search visibility, relevant visits and reliable enquiry data, then use the findings to decide the next work. A monthly strategy review call is available at your discretion. Timing depends on your starting point, competition and the changes needed.</p> },
  { id: "minimum-term", question: "What’s the minimum term?", answer: <p>Three months from kickoff, including any build time, with fees paid in advance. After that, service continues monthly with 30 days’ written notice. Paying six months of SEO before kickoff waives the agreed website build fee; managed ownership and transfer conditions still apply. <Link href="/working-together#payments">Payment and website terms →</Link></p> },
] as const;

const ease = [.4, 0, .2, 1] as const;

function TheWork({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  function focusTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % workCategories.length;
    else if (event.key === "ArrowLeft") next = (index + workCategories.length - 1) % workCategories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = workCategories.length - 1;
    else return;
    event.preventDefault();
    root.current?.querySelector<HTMLButtonElement>(`[data-work-tab="${next}"]`)?.focus();
  }

  return <section id="the-work" className={`${styles.scene} ${styles.work}`} aria-labelledby="work-title">
    <div className={styles.container}>
      <h2 id="work-title">What we deliver.</h2>
      <motion.div ref={root} layoutScroll className={styles.categoryBar} role="tablist" aria-label="SEO areas of work" data-lenis-prevent-horizontal>
        {workCategories.map((category, index) => <button key={category.id} id={`${id}-tab-${category.id}`} role="tab" type="button" data-work-tab={index}
          aria-selected={active === index} aria-controls={`${id}-panel-${category.id}`} tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)} onFocus={event => { setActive(index); if (root.current && root.current.scrollWidth > root.current.clientWidth) event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" }); }}
          onKeyDown={event => focusTab(event, index)}>{category.label}
          {active === index && <motion.span className={styles.tabUnderline} layoutId={`${id}-work-underline`} aria-hidden="true"
            transition={{ layout: reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32, mass: .7 } }} />}
        </button>)}
      </motion.div>
      {workCategories.map((category, index) => <div key={category.id} id={`${id}-panel-${category.id}`} role="tabpanel" aria-labelledby={`${id}-tab-${category.id}`} hidden={active !== index} tabIndex={0} className={styles.categoryPanel}>
        <div key={`${category.id}-${active}`} className={styles.actionGrid}>
          {category.items.map((item, itemIndex) => <motion.article key={item.title} className={styles.actionItem}
            initial={reduced ? false : "hidden"} whileInView={active === index ? "shown" : undefined}
            viewport={{ once: true, amount: .18 }}
            variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } }}
            transition={{ duration: reduced ? 0 : .48, delay: reduced ? 0 : itemIndex * .09, ease }}>
            <h3>{item.title}</h3>
            <ul className={styles.deliverableList}>{item.deliverables.map((deliverable, deliverableIndex) => <li key={deliverable}>
              <svg className={styles.deliveryCheck} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <motion.path d="m4 10 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
                  transition={{ duration: reduced ? 0 : .24, delay: reduced ? 0 : itemIndex * .09 + .18 + deliverableIndex * .05, ease }} />
              </svg>{deliverable}
            </li>)}</ul>
          </motion.article>)}
        </div>
      </div>)}
      <div className={styles.deliveryNotes}>
        <p>{workCategories[active].note}</p>
      </div>
    </div>
  </section>;
}

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return <section id="faq" className={`${styles.scene} ${styles.faq}`} aria-labelledby="faq-title">
    <div className={styles.container}>
      <h2 id="faq-title">A few useful answers.</h2>
      <div className={styles.questions}>
        {faqs.map((faq, index) => <article id={faq.id} className={styles.question} key={faq.id} data-open={open === index || undefined}>
          <h3><button type="button" id={`${id}-question-${index}`} aria-expanded={open === index} aria-controls={`${id}-answer-${index}`} onClick={() => setOpen(current => current === index ? null : index)}>{faq.question}<span className={styles.plus} aria-hidden="true" /></button></h3>
          <div className={styles.answer} role="region" id={`${id}-answer-${index}`} aria-labelledby={`${id}-question-${index}`} aria-hidden={open !== index} inert={open !== index}><div>{faq.answer}</div></div>
        </article>)}
      </div>
    </div>
  </section>;
}

export function SeoContent() {
  const reduced = useReducedMotion() ?? false;
  return <main className={styles.content}>
    <section className={`${styles.scene} ${styles.hero}`} aria-labelledby="seo-title">
      <a className={styles.skipLink} href="#why-seo">Skip to why SEO matters</a>
      <div className={styles.heroInner}>
        <h1 id="seo-title"><span>Useful content.</span><span>Better search visibility.</span></h1>
        <p>SEO, AEO and website improvements that help suitable customers find and understand your business.</p>
        <div className={styles.heroAction}><LiquidCallLink /></div>
      </div>
    </section>
    <SeoWhyStory reduced={reduced} />
    <TheWork reduced={reduced} />
    <Faq />
    <section id="start" className={`${styles.scene} ${styles.closing}`} aria-labelledby="call-title"><div>
      <h2 id="call-title">Let’s talk about<br />your business.</h2>
      <p>Bring your website and what needs attention.<br />We’ll work out the right next step together.</p>
      <LiquidCallLink />
    </div></section>
  </main>;
}
