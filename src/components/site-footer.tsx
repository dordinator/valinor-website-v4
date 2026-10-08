import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/schema";
import styles from "./site-footer.module.css";

const columns = [
  { label: "Services", links: [["SEO & AI search", "/seo"], ["Web design", "/web-design"], ["Google Ads", "/google-ads"], ["Google Ad Grants", "/google-ad-grants"]] },
  { label: "Company", links: [["Pricing", "/pricing"], ["Contact", "/contact"], ["Privacy & cookies", "/privacy"]] },
  { label: "Clients", links: [["Client portal", "/login"]] },
] as const;

/** The one footer for every page. It has no surface of its own: it sits on the page's background and takes the page's text colour, with the name written large behind it. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {columns.map(column => <nav key={column.label} className={styles.column} aria-label={column.label}>
            <span className={styles.label} aria-hidden="true">{column.label}</span>
            {column.links.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}
          </nav>)}
        </div>

        {/* The name, set edge to edge. An SVG so it scales with the width. Each letter is placed by hand from Montserrat's own
            measurements, so the V's left edge and the R's right edge land exactly on the footer's edges, not a side-bearing short. */}
        <svg className={styles.wordmark} viewBox="0 0 1000 152" aria-hidden="true" focusable="false">
          <text x="0.19 153.5 310.67 440.71 515.11 687.93 866.32" y="146">VALINOR</text>
        </svg>

        <div className={styles.legal}>
          <span>© 2026 Valinor Systems Ltd · Company no. 17314244 · Hertfordshire, UK</span>
          <div className={styles.identity}>
            <Link href="/" className={styles.brand}>
              <Image src="/assets/brand/valinor-mark-transparent.png" alt="" width={107} height={94} sizes="24px" />
              <span>VALINOR SYSTEMS</span>
            </Link>
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
