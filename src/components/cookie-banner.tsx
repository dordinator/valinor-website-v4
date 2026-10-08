"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, useSyncExternalStore } from "react";
import { bodyFont } from "@/components/home-hero/fonts";
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
 * a server snapshot of null would otherwise put the card into the prerendered
 * HTML of every page, where it would flash for people who settled this
 * weeks ago.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const id = useId();
  const [choosing, setChoosing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
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

  const open = pathname !== "/login" && settled && consent === null;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className={`${styles.card} ${bodyFont.variable}`}
          role="region"
          aria-labelledby={`${id}-title`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.42, delay: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.18, ease: "easeIn" } }}
        >
          <h2 id={`${id}-title`} className={styles.title}>Cookies</h2>
          <p className={styles.copy}>
            We&rsquo;d like to use analytics cookies to see which pages people
            read and how they arrived. They stay off unless you accept, and the
            site works the same either way.{" "}
            <Link href="/privacy">Privacy and cookie policy</Link>
          </p>

          {choosing && (
            <ul className={styles.choices}>
              <li>
                <div>
                  <span className={styles.choiceName}>Essential</span>
                  <span className={styles.choiceNote}>Remembers this choice. Nothing else.</span>
                </div>
                <span className={styles.always}>Always on</span>
              </li>
              <li>
                <div>
                  <span className={styles.choiceName} id={`${id}-analytics`}>Analytics</span>
                  <span className={styles.choiceNote}>Google Analytics. Pages read and how visitors arrived.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  aria-labelledby={`${id}-analytics`}
                  className={styles.switch}
                  onClick={() => setAnalytics((on) => !on)}
                >
                  <span aria-hidden="true" />
                </button>
              </li>
            </ul>
          )}

          <div className={styles.actions}>
            {choosing ? (
              <button
                type="button"
                className={`${styles.button} ${styles.wide}`}
                onClick={() => setConsent(analytics ? "granted" : "denied")}
              >
                Save my choice
              </button>
            ) : (
              <>
                <button type="button" className={styles.button} onClick={() => setConsent("denied")}>
                  Decline
                </button>
                <button type="button" className={styles.button} onClick={() => setConsent("granted")}>
                  Accept
                </button>
              </>
            )}
          </div>
          {!choosing && (
            <button type="button" className={styles.more} onClick={() => setChoosing(true)}>
              Choose what to allow
            </button>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
