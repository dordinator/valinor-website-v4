import { Fragment, type CSSProperties, type ReactNode } from "react";
import styles from "./home-hero.module.css";
import { HomeNavigation } from "./home-navigation";
import { headingFont, bodyFont } from "./fonts";
import { FluidBackground } from "./fluid-background";
import { LiquidCallLink } from "./liquid-call-link";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"} />
    </svg>
  );
}

type IconName = "home" | "file" | "check" | "grid" | "message" | "monitor" | "chart" | "user" | "list" | "plus";
const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v11H3Z" /><path d="M9 21v-8h6v8" /></>,
  file: <><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h4M9 11h6m-6 4h6m-6 3h4" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m7 12 3 3 7-7" /></>,
  grid: <path d="M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z" />,
  message: <path d="M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.7-5A9 9 0 1 1 21 11Z" />,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="1" /><path d="M12 17v4m-5 0h10" /></>,
  chart: <path d="M4 20V9h4v11m4 0V3h4v17m4 0v-7M2 20h20" />,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3Z" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h1m-1 6h1m-1 6h1" />,
  plus: <path d="M12 3v18M3 12h18" />,
};

function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{paths[name]}</svg>;
}

function HeroTitle() {
  const lines = [
    ["SEO", "and", "web", "design."],
    ["Built", "around", "your", "business."],
  ];
  return (
    <h1 id="alternative-hero-heading" aria-label="SEO and web design. Built around your business.">
      {lines.map((words, lineIndex) => (
        <span className={styles.titleLine} aria-hidden="true" key={lineIndex}>
          {words.map((word, wordIndex) => (
            <Fragment key={word}>
              <span className={styles.wordMask}>
                <span className={styles.word} style={{ "--word-delay": `${(lineIndex * 4 + wordIndex) * 65}ms` } as CSSProperties}>{word}</span>
              </span>
              {wordIndex < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function HomeHeader({ overHero = false }: { overHero?: boolean } = {}) {
  return <HomeNavigation fontClassName={`${headingFont.variable} ${bodyFont.variable}`} overHero={overHero} />;
}

function Status({ delivered = false }: { delivered?: boolean }) {
  return <span className={`${styles.status} ${delivered ? styles.delivered : ""}`}><i />{delivered ? "Delivered" : "In progress"}</span>;
}

/** A static, fictional workflow example. It never fetches private portal data. */
export function PortalPreview({ standalone = false, translucent = true }: { standalone?: boolean; translucent?: boolean } = {}) {
  const sidebar: { icon: IconName; label: string }[] = [
    { icon: "home", label: "Dashboard" },
    { icon: "plus", label: "Raise a ticket" },
    { icon: "file", label: "Active ticket" },
    { icon: "monitor", label: "Website" },
    { icon: "chart", label: "SEO · In build" },
    { icon: "user", label: "Account" },
  ];
  return (
    <figure className={`${styles.preview} ${standalone ? styles.standalonePreview : ""} ${translucent ? styles.translucentPreview : ""} ${headingFont.variable} ${bodyFont.variable}`} aria-label="Illustrative Valinor client portal dashboard">
      <figcaption className="sr-only">Demo preview with fictional example-business data. The client portal shows current work, delivered requests and messages from the Valinor team. These are workflow examples, not performance results.</figcaption>
      <div className={styles.portalWindow} aria-hidden="true">
        <div className={styles.windowBar}>
          <span className={styles.trafficLights}><i /><i /><i /></span>
          <span className={styles.demoLabel}>DEMO PREVIEW</span>
          <span className={styles.windowName}>Valinor Client Portal</span>
        </div>
        <div className={styles.portalLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.portalBrand}>VALINOR SYSTEMS<span>Client portal</span></div>
            <ul>{sidebar.map((item, index) => <li key={item.label} className={index === 0 ? styles.active : ""}><Icon name={item.icon} />{item.label}</li>)}</ul>
            <div className={styles.exampleBusiness}><Icon name="grid" />Example business</div>
          </aside>
          <div className={styles.workspace}>
            <div className={styles.workspaceHeading}><p className={styles.workspaceTitle}>Your workspace</p><span className={styles.newRequest}><Icon name="plus" />New request</span></div>
            <div className={styles.stats}>
              <div><Icon name="file" /><p><span>In progress</span><strong>1</strong></p></div>
              <div><Icon name="check" /><p><span>Delivered</span><strong>6</strong></p></div>
              <div><Icon name="grid" /><p><span>Current plan</span><strong>Essential</strong></p></div>
            </div>
            <div className={styles.activity}>
              <div className={styles.nextDelivery}><Icon name="file" /><div><span className={styles.cardLabel}>Next delivery</span><p className={styles.cardTitle}>Service page update</p><div className={styles.deliveryBottom}><Status /><span className={styles.viewTicket}>View ticket <Arrow /></span></div></div></div>
              <div className={styles.teamNote}><Icon name="message" /><div><span className={styles.cardLabel}>Unread notes</span><p className={styles.cardTitle}>Valinor team</p><p>The draft is ready for your feedback.</p></div></div>
            </div>
            <div className={styles.requests}>
              <div className={styles.requestsHeading}><span><Icon name="list" />Recent requests</span><span>View all <Arrow /></span></div>
              <table><thead><tr><th>Request</th><th>Status</th><th>Updated</th></tr></thead><tbody>
                <tr><td>Service page update</td><td><Status /></td><td>Today</td></tr>
                <tr><td>Image replacements</td><td><Status delivered /></td><td>8 May</td></tr>
                <tr><td>Contact details update</td><td><Status delivered /></td><td>28 April</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function HomeHero({ showPreview = true, sharedBackground = false, viewport = false, scrollPreview = false }: { showPreview?: boolean; sharedBackground?: boolean; viewport?: boolean; scrollPreview?: boolean } = {}) {
  return (
    <>
    <HomeHeader overHero />
    <div className={`${styles.heroStage} ${sharedBackground ? styles.sharedBackground : ""} ${viewport ? styles.viewportHero : ""} ${scrollPreview ? styles.previewLead : ""}`} data-fluid-hero data-scroll-section={viewport && !scrollPreview || undefined}>
    {!sharedBackground && <FluidBackground />}
    <section className={`${styles.hero} ${showPreview ? "" : styles.compactHero} ${headingFont.variable} ${bodyFont.variable}`} aria-labelledby="alternative-hero-heading">
      <div className={styles.intro}>
        <HeroTitle />
        <p>We improve your search visibility, AI presence, website and the journey from interest to enquiry.</p>
        <div className={styles.ctaReveal}>
          <LiquidCallLink />
        </div>
      </div>
      {showPreview && <PortalPreview />}
      <div id="hero-end" />
    </section>
    </div>
    </>
  );
}
