"use client";

import { useSyncExternalStore } from "react";
import {
  clearConsent,
  getConsentServerSnapshot,
  getConsentSnapshot,
  setConsent,
  subscribeToConsent,
} from "@/lib/consent";
import styles from "./page.module.css";

/**
 * The way back to a decision already made. PECR consent has to be as easy to
 * withdraw as it was to give, which means a standing control somewhere
 * durable rather than a banner the visitor can never summon again.
 */
export function CookieSettings() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  if (consent === null) {
    return <p>You have not answered the cookie banner yet, so analytics cookies are off.</p>;
  }

  return (
    <p>
      You currently{" "}
      <strong>{consent === "granted" ? "accept" : "decline"}</strong> analytics
      cookies.{" "}
      <button
        type="button"
        className={styles.linkButton}
        onClick={() => setConsent(consent === "granted" ? "denied" : "granted")}
      >
        {consent === "granted" ? "Withdraw consent" : "Accept them"}
      </button>{" "}
      or{" "}
      <button type="button" className={styles.linkButton} onClick={clearConsent}>
        show the banner again
      </button>
      .
    </p>
  );
}
