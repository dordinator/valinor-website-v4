"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./home-services.module.css";

const services = [
  {
    id: "seo", name: "SEO & AI search", href: "/seo",
    description: "Help the right people find your business through useful content, technical improvements and stronger search visibility.",
    areas: ["Blogs & service pages", "Technical SEO", "Links & authority", "AI search optimisation"],
  },
  {
    id: "design", name: "Web design", href: "/web-design",
    description: "Clear, professional websites built around your business and the way customers enquire or book.",
    areas: ["Design & build", "Copy & content", "Mobile usability", "Enquiry & booking journeys"],
  },
  {
    id: "ads", name: "Google Ads", href: "/google-ads",
    description: "Targeted Google Search campaigns, with tracking and regular review to assess whether they make commercial sense.",
    areas: ["Campaign setup", "Keyword targeting", "Landing pages", "Conversion tracking"],
  },
  {
    id: "grants", name: "Google Ad Grants", href: "/google-ad-grants",
    description: "Setup and ongoing campaign support for eligible charities using Google Ad Grants.",
    areas: ["Eligibility review", "Website readiness", "Account setup", "Campaign management"],
  },
] as const;
const ease = [.4, 0, .2, 1] as const;

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HomeServices({ reduced }: { reduced: boolean }) {
  const [expanded, setExpanded] = useState(0);
  const section = useRef<HTMLElement>(null);
  const id = useId();

  function focusRow(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown") next = (index + 1) % services.length;
    else if (event.key === "ArrowUp") next = (index + services.length - 1) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    section.current?.querySelector<HTMLButtonElement>(`[data-service-toggle="${next}"]`)?.focus();
  }

  return <section ref={section} id="services" className={styles.services} aria-labelledby="home-services-title">
    <div className={styles.container}>
      <motion.h2 id="home-services-title" className={styles.heading} initial={reduced ? false : { opacity: .6, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: reduced ? 0 : .8, ease }}>Our Services<span className={styles.fullStop}>.</span></motion.h2>
      <div className={styles.serviceList}>
        {services.map((service, index) => {
          const open = expanded === index;
          return <article key={service.id} className={styles.row} data-service-row data-active={open || undefined} data-open={open || undefined}
            onPointerEnter={event => { if (event.pointerType === "mouse") setExpanded(index); }}
            onFocusCapture={() => setExpanded(index)}>
            <h3 className={styles.rowHeading}><button type="button" className={styles.trigger} id={`${id}-trigger-${service.id}`} aria-expanded={open} aria-controls={`${id}-panel-${service.id}`} data-service-toggle={index} onKeyDown={event => focusRow(event, index)} onClick={() => setExpanded(index)}>
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}<span className={styles.numberStop}>.</span></span>
              <span className={styles.name}>{service.name}</span>
              <span className={styles.direction}><Arrow /></span>
            </button></h3>
            <div role="region" id={`${id}-panel-${service.id}`} aria-labelledby={`${id}-trigger-${service.id}`} aria-hidden={!open} inert={!open} className={styles.panel}>
              <div className={styles.panelClip}>
              <div className={styles.panelInner}>
                <p className={styles.description}>{service.description}</p>
                <ul className={styles.areas} aria-label={`${service.name} areas of work`}>{service.areas.map(area => <li key={area}>{area}</li>)}</ul>
                <Link className={styles.detailLink} href={service.href}>Explore {service.name}<Arrow /></Link>
              </div>
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
