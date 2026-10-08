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
 * The host that owns the analytics property. Preview deployments and
 * localhost would otherwise fire the tag and land in the same GA stream. Gating on the canonical host
 * keeps the property to real traffic without any IP filtering in the GA UI.
 */
const CANONICAL_HOST = "valinorsystems.co.uk";

/** useSyncExternalStore wants a subscribe; the hostname never changes. */
const neverChanges = () => () => {};

/**
 * Google Analytics, loaded only after the visitor accepts.
 *
 * Until then nothing is fetched from Google and nothing is sent: no tag, no
 * cookieless pings. Analytics cookies are not strictly necessary, so PECR
 * reg 6 wants consent first, and not loading the tag is the plainest way to
 * honour that. Once loaded, only analytics storage is granted; the
 * advertising signals stay denied because the banner never asks about them.
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

  // The tag stays mounted for the rest of the page view once it has loaded,
  // so a later withdrawal has to reach it directly: the opt-out flag stops
  // further hits and the consent update stops further cookies. (The cookies
  // already written are cleared in setConsent.)
  useEffect(() => {
    if (!onCanonicalHost || consent === null) return;
    const w = window as typeof window & { gtag?: (...args: unknown[]) => void } & Record<string, unknown>;
    w[`ga-disable-${GA_MEASUREMENT_ID}`] = consent !== "granted";
    w.gtag?.("consent", "update", { analytics_storage: consent });
  }, [onCanonicalHost, consent]);

  if (pathname === "/login" || !onCanonicalHost || consent !== "granted") return null;

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
  analytics_storage: 'granted'
});
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
