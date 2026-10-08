"use client";

import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { HomeServices } from "./home-services";
import { useReducedMotion } from "motion/react";
import { WorkShowcase } from "./work-showcase";
import styles from "./home-content.module.css";

export function HomeContent() {
  const reduced = useReducedMotion() ?? false;
  return <div className={styles.homeContent}>
    <main><HomeServices reduced={reduced} /><WorkShowcase />
      <section id="next-step" className={styles.call} aria-labelledby="home-call-title"><div className={styles.callInner}><h2 id="home-call-title">Let’s talk about <br />your business.</h2><p>Tell us what you want to achieve. <br />We’ll work out the right next step together.</p><LiquidCallLink /><Link className={styles.pricingLink} href="/pricing">See pricing <span aria-hidden="true">→</span></Link></div></section>
    </main>
    <SiteFooter />
  </div>;
}
