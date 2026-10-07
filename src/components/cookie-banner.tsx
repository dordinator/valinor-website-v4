"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  setConsent,
  subscribeToConsent,
} from "@/lib/consent";
import styles from "./cookie-banner.module.css";

/**
 * The consent gate for the analytics cookies. It shows only while the
 * visitor has not answered; the answer itself lives in @/lib/consent, which
 * <Analytics> watches.
 *
 * Nothing here renders on the server — the choice is client-side state, and
 * a server snapshot of null would otherwise put the bar into the prerendered
 * HTML of every page, where it would flash for people who settled this
 * weeks ago.
 */
export function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  const settled = useSyncExternalStore(
    subscribeToConsent,
    () => true,
    () => false,
  );

  if (!settled || consent !== null) return null;

  return (
    <aside
      className={styles.bar}
      role="region"
      aria-label="Cookie choices"
    >
      <p className={styles.copy}>
        We use analytics cookies to see which pages people read and how they
        arrived. They are off until you say otherwise, and the site works the
        same either way. Our <Link href="/privacy">privacy and cookie policy</Link>{" "}
        has the detail.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.reject}`}
          onClick={() => setConsent("denied")}
        >
          Decline
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.accept}`}
          onClick={() => setConsent("granted")}
        >
          Accept
        </button>
      </div>
    </aside>
  );
}
