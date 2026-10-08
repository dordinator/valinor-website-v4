import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { SeoContent } from "@/components/seo/seo-content";
import styles from "@/components/seo/seo-content.module.css";

export const metadata: Metadata = {
  title: "SEO & AI search",
  description: "Useful content, technical SEO and website improvements that help suitable customers find and understand your business.",
  alternates: { canonical: "/seo" },
};

export default function SeoPage() {
  return <div className={`${styles.page} ${headingFont.variable} ${bodyFont.variable}`} data-fluid-page>
    <FluidBackground fullPage />
    <HomeHeader overHero />
    <SeoContent />
    <footer className={styles.footer}>
      <Link href="/" className={styles.footerBrand}><Image src="/assets/brand/valinor-mark-transparent.png" alt="" width={38} height={34} /><span>VALINOR SYSTEMS</span></Link>
      <nav aria-label="Footer"><Link href="/#services">Services</Link><Link href="/working-together">Packages</Link><Link href="/login">Client portal</Link><Link href="/privacy">Privacy &amp; cookies</Link></nav>
      <span className={styles.copyright}>© 2026 Valinor Systems</span>
    </footer>
  </div>;
}
