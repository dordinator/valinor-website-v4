import Link from "next/link";
import Image from "next/image";
import { WireframeSurface } from "@/components/wireframe/wireframe";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import styles from "./home-wireframe.module.css";

const projects = [
  ["UniFluent", "https://unifluent.co.uk/", "Emesord product", "/assets/studio-previews/unifluent-hero.png"],
  ["NJH Sports Therapy and Pilates", "https://www.njhsportstherapy.co.uk/", "Independent practice", "/assets/studio-previews/njh-sports-therapy-hero.png"],
  ["Canadian Citizenship Hub", "https://www.canadiancitizenshiphub.com/", "Specialist service", "/assets/studio-previews/canadian-citizenship-hub-hero.png"],
];

export function HomeWireframe() {
  return <WireframeSurface transparent>
    <main className={styles.home}>
      <section id="services" className={styles.summary} aria-label="Our services" data-scroll-section>
        <p>SEO and website improvements, with Google Ads and charity Ad Grants where relevant.</p>
        <nav aria-label="Explore our services"><Link href="/seo">SEO</Link><Link href="/web-design">Web Design</Link><Link href="/google-ads">Google Ads</Link><Link href="/google-ad-grants">Ad Grants</Link></nav>
        <p className={styles.priceLine}>SEO £995/month, three-month minimum. Website builds quoted around £3,000. <Link href="/working-together">Scope and terms ↗</Link></p>
      </section>
      <section id="work" className={styles.work} aria-labelledby="home-work-title" data-scroll-section>
        <div className={styles.inner}>
          <h2 id="home-work-title">Selected work.</h2>
          <div className={styles.projects}>{projects.map(([name, href, context, image]) => <a href={href} className={styles.project} key={name} target="_blank" rel="noopener noreferrer">
            <div className={styles.imageSlot}><Image src={image} alt={`${name} website preview`} fill sizes="(max-width: 650px) 82vw, 33vw" /></div>
            <span className={styles.projectName}>{name}<span aria-hidden="true">↗</span></span>
            <span className={styles.context}>{context}</span>
            <span className="sr-only"> — external website, opens in a new tab</span>
          </a>)}</div>
        </div>
      </section>
      <section id="next-step" className={styles.call} aria-labelledby="home-call-title" data-scroll-section>
        <h2 id="home-call-title">Let’s talk about your business.</h2>
        <LiquidCallLink />
        <Link className={styles.email} href="/contact#email">Prefer email?</Link>
      </section>
    </main>
    <footer className={styles.footer}><span>Valinor Systems · Wireframe preview</span><nav aria-label="Footer"><Link href="/working-together">Options &amp; pricing</Link><Link href="/login">Client portal</Link><Link href="/privacy">Privacy &amp; cookies</Link></nav></footer>
  </WireframeSurface>;
}
