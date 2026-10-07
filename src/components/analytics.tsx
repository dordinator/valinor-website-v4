"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
} from "@/lib/consent";

const GA_MEASUREMENT_ID = "G-S61KELM6GL";

/**
 * The host that owns the analytics property. Netlify serves this app on a
 * `*.netlify.app` alias and on a fresh URL per deploy preview, all of which
 * would otherwise fire the tag and land in the same GA stream — as would
 * localhost every time we run the dev server. Gating on the canonical host
 * keeps the property to real traffic without any IP filtering in the GA UI.
 */
const CANONICAL_HOST = "valinorsystems.co.uk";

/** useSyncExternalStore wants a subscribe; the hostname never changes. */
const neverChanges = () => () => {};

/**
 * Google Analytics, held behind Consent Mode v2.
 *
 * The tag loads for everyone but starts with every storage type DENIED, so
 * no `_ga` cookie is written until the visitor accepts — which is what PECR
 * reg 6 asks for, analytics cookies not being strictly necessary. Under
 * denial gtag still sends cookieless pings, so we keep a rough traffic shape
 * from people who never answer the banner; accepting fires a consent
 * `update` and the same page view is counted properly from then on.
 *
 * Which host is serving us is a per-request fact, and reading it on the
 * server (headers()) would opt the root layout out of static rendering for
 * every page on the site. So the check happens on the client instead — with
 * a server snapshot of `false`, so the prerendered HTML and the first
 * hydration pass agree and only the client goes on to mount the tag.
 */
export function Analytics() {
  const pathname = usePathname();
  const onCanonicalHost = useSyncExternalStore(
    neverChanges,
    () => window.location.hostname === CANONICAL_HOST,
    () => false,
  );

  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  // The grant has to reach a tag that is already running, so it goes out as
  // a consent update rather than by re-rendering the scripts. gtag may not
  // exist yet on a slow connection; the queue is a plain array, and pushing
  // to it before the library loads is how the snippet itself works.
  useEffect(() => {
    if (pathname === "/login" || !onCanonicalHost || consent !== "granted") return;
    const w = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    const granted = {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    };
    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", granted);
      return;
    }
    // The inline block below is deferred too, so on a fast click gtag may
    // not exist yet. The queue is a plain array either way.
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(["consent", "update", granted]);
  }, [pathname, onCanonicalHost, consent]);

  if (pathname === "/login" || !onCanonicalHost) return null;

  // Mirrors Google's own snippet, external tag first: it is async and needs
  // a round trip, so the inline block below always reaches the queue first
  // and the denied default is in place before the library initialises.
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
