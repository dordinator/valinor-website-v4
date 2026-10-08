"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import styles from "@/components/not-found/not-found.module.css";

/** Shown if a page fails while rendering. Same surface as the 404 page, with a way to retry and a way out. */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className={styles.page} data-fluid-page>
      <FluidBackground fullPage />
      <HomeHeader overHero />
      <main className={styles.content}>
        <h1 className={styles.message}>Something went wrong on this page.</h1>
        <p className={styles.lead}>Try again, or head back to the homepage.</p>
        <button type="button" className={styles.retry} onClick={() => retry()}>Try again</button>
        <nav className={styles.links} aria-label="Other pages">
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </main>
    </div>
  );
}
