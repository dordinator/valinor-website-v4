import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { JsonLd } from "@/components/seo/structured-data";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL, pageGraph } from "@/lib/schema";
import styles from "./contact.module.css";

const DESCRIPTION = "Book a call with Valinor Systems to talk about your website, SEO, AI search or Google Ads, or email hello@valinorsystems.co.uk.";

const schema = pageGraph({ name: "Contact", description: DESCRIPTION, path: "/contact", type: "ContactPage" });

export const metadata: Metadata = pageMetadata({ title: "Contact", description: DESCRIPTION, path: "/contact" });

export default function ContactPage() {
  return (
    <div className={styles.page} data-fluid-page>
      <JsonLd data={schema} />
      <FluidBackground fullPage />
      <HomeHeader overHero />
      <main className={styles.content}>
        <div className={styles.inner} id="book">
          <h1><span>Let’s talk about</span><span>your business.</span></h1>
          <p className={styles.lead}>Start with your website, an idea or something that needs attention.</p>
          <div className={styles.action}>
            <LiquidCallLink />
          </div>
          <div className={styles.emailRow}>
            <span className={styles.emailLabel}>Prefer email?</span>
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 6.5h17v11h-17zm0 .5 8.5 6.5L20.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
