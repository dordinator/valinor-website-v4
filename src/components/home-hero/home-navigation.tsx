"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import styles from "./home-navigation.module.css";
import { BOOKING_URL } from "@/lib/booking";

const services = [
  { title: "SEO", description: "Build search visibility with useful content and ongoing improvements.", href: "/seo", icon: "search", tint: "#8ab4f8" },
  { title: "Web design", description: "A clear, considered website built around your business.", href: "/web-design", icon: "window", tint: "#fdd663" },
  { title: "Google Ads", description: "Reach people already searching for the services you offer.", href: "/google-ads", icon: "googleAds", tint: "#8ab4f8" },
  { title: "Google Ad Grants", description: "Help eligible charities make use of Google's advertising programme.", href: "/google-ad-grants", icon: "heart", tint: "#f28b82" },
] as const;

// Line icons in the same 1.5 stroke as the site's others, each tinted from the same family as the Google Ads mark.
const serviceIcons = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  window: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" /></>,
  // The Google Ads mark in its own colours (shape from Simple Icons). A Google trademark, used to name the service.
  googleAds: <g stroke="none">
    <path fill="#FBBC04" d="M7.5137 4.8438 1.5645 15.1484A4.5 4.5 0 0 1 4 14.4297c2.5597-.0075 4.6248 2.1585 4.4941 4.7148l3.2168-5.5723-3.6094-6.25c-.4499-.7793-.6322-1.6394-.5878-2.4784z" />
    <path fill="#4285F4" d="M23.4641 16.9287 15.4632 3.072C14.3586 1.1587 11.9121.5028 9.9988 1.6074S7.4295 5.1585 8.5341 7.0718l8.0009 13.8567c1.1046 1.9133 3.5511 2.5679 5.4644 1.4646 1.9134-1.1046 2.568-3.5511 1.4647-5.4644z" />
    <path fill="#34A853" d="M3.9998 22.9291C1.7908 22.9291 0 21.1383 0 18.9293s1.7908-3.9998 3.9998-3.9998 3.9998 1.7908 3.9998 3.9998-1.7908 3.9998-3.9998 3.9998z" />
  </g>,
  heart: <path d="M12 20s-7-4.4-7-9.6A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.4C19 15.6 12 20 12 20Z" />,
};
function Arrow({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

function Chevron() { return <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m5 6.5 3 3 3-3" /></svg>; }

export function HomeNavigation({ fontClassName, overHero = false }: { fontClassName: string; overHero?: boolean }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const travel = useRef({ last: 0, down: 0, up: 0 });
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const firstService = useRef<HTMLAnchorElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!overHero) return;
    const update = () => setScrolled(previous => window.scrollY > (previous ? 48 : 96));
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overHero]);

  // The bar slides away while the page is scrolled down and returns on the way back up. It stays put near the top of the
  // page, while a menu is open, while anything in it has keyboard focus, and for visitors who ask for reduced motion.
  useLenis(({ scroll }) => {
    const state = travel.current, delta = scroll - state.last;
    state.last = scroll;
    if (delta > 0) { state.down += delta; state.up = 0; } else if (delta < 0) { state.up -= delta; state.down = 0; }
    const pinned = scroll < 160 || servicesOpen || mobileOpen || root.current?.contains(document.activeElement)
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A little travel is needed in either direction, so a wobble of a few pixels does not toggle it.
    if (pinned || state.up > 6) setHidden(false);
    else if (state.down > 14) setHidden(true);
  }, [servicesOpen, mobileOpen]);

  function clearTimer() { if (timer.current) clearTimeout(timer.current); timer.current = null; }
  function close() { clearTimer(); setServicesOpen(false); setMobileOpen(false); }
  function schedule(open: boolean) {
    clearTimer();
    timer.current = setTimeout(() => { setServicesOpen(open); timer.current = null; }, open ? 80 : 180);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) { if (timer.current) clearTimeout(timer.current); timer.current = null; setServicesOpen(false); setMobileOpen(false); }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [servicesOpen, mobileOpen]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1001px)");
    const reset = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setServicesOpen(false); setMobileOpen(false); };
    desktop.addEventListener("change", reset);
    return () => desktop.removeEventListener("change", reset);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [mobileOpen]);

  // Focus may move between the Services button and its panel without closing it.
  function leaveServices(event: FocusEvent<HTMLElement>) {
    const next = event.relatedTarget as Node | null;
    if (group.current?.contains(next) || panel.current?.contains(next)) return;
    clearTimer(); setServicesOpen(false);
  }
  // Tab runs through the panel and then carries on along the bar; Shift+Tab from the top returns to the button.
  function panelKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const links = [...(panel.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])];
    if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); trigger.current?.focus(); }
    else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
      event.preventDefault(); close();
      (group.current?.nextElementSibling as HTMLElement | null)?.focus();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && (servicesOpen || mobileOpen)) {
      event.preventDefault();
      const wasMobile = mobileOpen;
      close();
      (wasMobile ? mobileTrigger : trigger).current?.focus();
    }
    if (event.key === "Tab" && mobileOpen) {
      const focusable = [...(root.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])].filter(e => e.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }

  return (
    <>
      <div className={`${styles.spacer} ${overHero ? styles.transparentSpacer : ""}`} aria-hidden="true" />
      <div className={styles.scrim} data-open={servicesOpen || undefined} aria-hidden="true" />
      <header ref={root} className={`${styles.header} ${overHero && !scrolled ? styles.overHero : ""} ${fontClassName}`} data-mobile-open={mobileOpen || undefined} data-floating={!overHero || scrolled || mobileOpen || undefined} data-hidden={hidden || undefined} onFocus={() => setHidden(false)} onKeyDown={onKeyDown}>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} aria-label="Valinor Systems home" onClick={close}>
            <Image src="/assets/brand/valinor-mark-transparent.png" alt="" width={107} height={94} sizes="42px" preload />
            <span><strong>VALINOR SYSTEMS</strong></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <div ref={group} className={styles.serviceGroup}
              onPointerEnter={event => { if (event.pointerType === "mouse") schedule(true); }}
              onPointerLeave={event => { if (event.pointerType === "mouse") schedule(false); }}
              onBlur={leaveServices}>
              <button ref={trigger} type="button" className={styles.navLink} aria-expanded={servicesOpen} aria-controls={`${id}-services`}
                onClick={() => { clearTimer(); setServicesOpen(open => !open); }}
                onKeyDown={event => {
                  // The panel sits after the bar in the page, so the keyboard is handed into it by hand.
                  if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey && servicesOpen)) { event.preventDefault(); clearTimer(); setServicesOpen(true); requestAnimationFrame(() => firstService.current?.focus()); }
                }}>
                Services<Chevron />
              </button>
            </div>
            <Link className={styles.navLink} href="/pricing" aria-current={pathname === "/pricing" ? "page" : undefined} onClick={close}>Pricing</Link>
            <Link className={styles.navLink} href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} onClick={close}>Contact</Link>
          </nav>
          <div className={styles.actions}>
            <Link className={styles.portal} href="/login" aria-label="Client portal" onClick={close}><span className={styles.portalDesktop}>Client portal</span><span className={styles.portalMobile}>Client portal</span><span aria-hidden="true">↗</span></Link>
            <button ref={mobileTrigger} className={styles.mobileTrigger} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls={`${id}-mobile`} onClick={() => { clearTimer(); setServicesOpen(false); setMobileOpen(open => !open); }}><span /><span /></button>
            <Link className={styles.call} href={BOOKING_URL} onClick={close} onPointerMove={event => event.currentTarget.style.setProperty("--mx", `${event.clientX - event.currentTarget.getBoundingClientRect().left}px`)}><span>Book a call</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
          </div>
        </div>
        <div ref={panel} id={`${id}-services`} className={styles.dropdown} hidden={!servicesOpen}
          onPointerEnter={event => { if (event.pointerType === "mouse") schedule(true); }}
          onPointerLeave={event => { if (event.pointerType === "mouse") schedule(false); }}
          onBlur={leaveServices} onKeyDown={panelKeys}>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => <Link ref={index === 0 ? firstService : undefined} key={service.title} href={service.href} style={{ "--i": index, "--tint": service.tint } as CSSProperties} aria-current={pathname === service.href ? "page" : undefined} onClick={close}>
              <span className={styles.tile}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{serviceIcons[service.icon]}</svg></span>
              <span className={styles.rowText}><span className={styles.rowTitle}>{service.title}</span><span className={styles.rowDescription}>{service.description}</span></span>
              <Arrow className={styles.rowArrow} />
            </Link>)}
          </div>
          <Link className={styles.feature} href="/pricing" style={{ "--i": 4 } as CSSProperties} onClick={close}>
            <span className={styles.featureTitle}>Find the right starting point</span>
            <span className={styles.featureLine}>Core is £995 a month.</span>
            <span className={styles.featureLink}>See pricing <Arrow /></span>
          </Link>
        </div>
        <nav className={styles.mobilePanel} id={`${id}-mobile`} aria-label="Mobile navigation" hidden={!mobileOpen} data-lenis-prevent>
          <div><span className={styles.groupLabel}>Services</span>{services.map(service => <Link key={service.title} href={service.href} onClick={close}>{service.title}</Link>)}</div>
          <div><Link href="/pricing" onClick={close}>Pricing</Link><Link href="/contact" onClick={close}>Contact</Link><Link href="/login" onClick={close}>Client portal ↗</Link></div>
        </nav>
      </header>
    </>
  );
}
