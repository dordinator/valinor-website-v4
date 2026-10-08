import type { Metadata } from "next";
import Link from "next/link";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { Particle404 } from "@/components/not-found/particle-404";
import styles from "@/components/not-found/not-found.module.css";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className={styles.page} data-fluid-page>
      <FluidBackground fullPage />
      <HomeHeader overHero />
      <main className={styles.content}>
        <Particle404 />
        <h1 className={styles.message}><span className="sr-only">404. </span>We can’t find that page.</h1>
        <p className={styles.lead}>It may have moved, or the link may be out of date.</p>
        <LiquidCallLink href="/" label="Back to home" />
        <nav className={styles.links} aria-label="Other pages">
          <Link href="/seo">SEO &amp; AI search</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </main>
    </div>
  );
}
