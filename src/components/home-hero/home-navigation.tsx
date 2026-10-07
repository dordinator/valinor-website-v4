"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./home-navigation.module.css";

const services = [
  { title: "SEO", description: "Build search visibility with useful content and ongoing improvements.", href: "/seo" },
  { title: "Web design", description: "A clear, considered website built around your business.", href: "/web-design" },
  { title: "Google Ads", description: "Reach people already searching for the services you offer.", href: "/google-ads" },
  { title: "Google Ad Grants", description: "Help eligible charities make use of Google's advertising programme.", href: "/google-ad-grants" },
];

function Chevron() { return <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m5 6.5 3 3 3-3" /></svg>; }

export function HomeNavigation({ fontClassName, overHero = false }: { fontClassName: string; overHero?: boolean }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const firstService = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!overHero) return;
    const update = () => setScrolled(window.scrollY > 12);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overHero]);

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
      <header ref={root} className={`${styles.header} ${overHero && !scrolled ? styles.overHero : ""} ${fontClassName}`} data-mobile-open={mobileOpen || undefined} onKeyDown={onKeyDown}>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} aria-label="Valinor Systems home" onClick={close}>
            <Image src="/assets/brand/valinor-mark-transparent.png" alt="" width={107} height={94} sizes="42px" preload />
            <span><strong>VALINOR SYSTEMS</strong><small className={styles.reviewLabel}>Wireframe preview</small></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <div className={styles.serviceGroup}
              onPointerEnter={event => { if (event.pointerType === "mouse") schedule(true); }}
              onPointerLeave={event => { if (event.pointerType === "mouse") schedule(false); }}
              onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { clearTimer(); setServicesOpen(false); } }}>
              <button ref={trigger} type="button" className={styles.navLink} aria-expanded={servicesOpen} aria-controls={`${id}-services`}
                onClick={() => { clearTimer(); setServicesOpen(open => !open); }}
                onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); clearTimer(); setServicesOpen(true); requestAnimationFrame(() => firstService.current?.focus()); } }}>
                Services<Chevron />
              </button>
              <div id={`${id}-services`} className={styles.dropdown} hidden={!servicesOpen}>
                <div className={styles.serviceGrid}>
                  {services.map((service, index) => <Link ref={index === 0 ? firstService : undefined} key={service.title} href={service.href} onClick={close}><span>{service.title}</span><p>{service.description}</p></Link>)}
                </div>
                <Link className={styles.dropdownFooter} href="/working-together" onClick={close}><span>Find the right starting point</span><span>Packages <span aria-hidden="true">→</span></span></Link>
              </div>
            </div>
            <Link className={styles.navLink} href="/working-together" aria-current={pathname === "/working-together" ? "page" : undefined} onClick={close}>Packages</Link>
          </nav>
          <div className={styles.actions}>
            <Link className={styles.portal} href="/login" aria-label="Client portal" onClick={close}><span className={styles.portalDesktop}>Client portal</span><span className={styles.portalMobile}>Client portal</span><span aria-hidden="true">↗</span></Link>
            <button ref={mobileTrigger} className={styles.mobileTrigger} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls={`${id}-mobile`} onClick={() => { clearTimer(); setServicesOpen(false); setMobileOpen(open => !open); }}><span /><span /></button>
          </div>
        </div>
        <nav className={styles.mobilePanel} id={`${id}-mobile`} aria-label="Mobile navigation" hidden={!mobileOpen} data-lenis-prevent>
          <div><span className={styles.groupLabel}>Services</span>{services.map(service => <Link key={service.title} href={service.href} onClick={close}>{service.title}</Link>)}</div>
          <div><Link href="/working-together" onClick={close}>Packages</Link><Link href="/login" onClick={close}>Client portal ↗</Link></div>
        </nav>
      </header>
    </>
  );
}
