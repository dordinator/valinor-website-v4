"use client";

import Image from "next/image";
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
      <section id="next-step" className={styles.call} aria-labelledby="home-call-title"><div className={styles.callInner}><h2 id="home-call-title">Let’s talk about <br />your business.</h2><p>Tell us what you want to achieve. <br />We’ll work out the right next step together.</p><LiquidCallLink /></div></section>
    </main>
    <footer className={styles.footer}><div className={styles.footerInner}><Link href="/" className={styles.footerBrand}><Image src="/assets/brand/valinor-mark-transparent.png" alt="" width={38} height={34} /><span>VALINOR SYSTEMS</span></Link><nav aria-label="Footer"><Link href="/#services">Services</Link><Link href="/working-together">Options &amp; pricing</Link><Link href="/login">Client portal</Link><Link href="/privacy">Privacy &amp; cookies</Link></nav><span className={styles.copyright}>© 2026 Valinor Systems</span></div></footer>
  </div>;
}
