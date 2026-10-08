import Link from "next/link";
import type { ReactNode } from "react";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { SiteFooter } from "@/components/site-footer";
import styles from "./wireframe.module.css";
import { BOOKING_URL } from "@/lib/booking";

export const reviewPages = [
  ["Home", "/"], ["SEO", "/seo"], ["Web Design", "/web-design"],
  ["Google Ads", "/google-ads"], ["Ad Grants", "/google-ad-grants"],
  ["Pricing", "/pricing"], ["Contact", "/contact"],
] as const;

export function WireframeSurface({ children, transparent = false, className = "" }: { children: ReactNode; transparent?: boolean; className?: string }) {
  return <div className={`${styles.surface} ${transparent ? styles.transparentSurface : ""} ${bodyFont.variable} ${headingFont.variable} ${className}`}>{children}</div>;
}
export function WireframeStatus() {
  return <aside className={styles.status} aria-label="Wireframe review"><div><p><strong>Website wireframe</strong><span>Draft content and section layouts for review</span></p><nav aria-label="Review all pages">{reviewPages.map(([name, href]) => <Link href={href} key={href}>{name}</Link>)}</nav></div></aside>;
}
export function WireframePage({ children }: { children: ReactNode }) {
  return <WireframeSurface className={styles.pageLayout}><HomeHeader /><main>{children}</main><WireframeFooter /></WireframeSurface>;
}
export function PageIntro({ title, children, summary, price }: { title: string; children: ReactNode; summary?: ReactNode; price?: ReactNode }) {
  return <section className={styles.pageIntro} data-viewport-block><div><h1>{title}</h1><div className={styles.lead}>{children}</div>{summary && <p className={styles.summary}>{summary}</p>}{price && <div className={styles.price}>{price}</div>}<ActionLink>Book a call ↗</ActionLink></div></section>;
}
export function Section({ id, title, intro, tone = "paper", children, className = "" }: { id?: string; title: string; intro?: ReactNode; tone?: "paper" | "dark"; children?: ReactNode; className?: string }) {
  return <section className={`${styles.section} ${tone === "dark" ? styles.dark : ""} ${className}`} id={id} data-viewport-block><div className={styles.inner}><div className={styles.sectionHeading}><h2>{title}</h2>{intro && <div className={styles.introCopy}>{intro}</div>}</div>{children}</div></section>;
}
export function Columns({ children }: { children: ReactNode }) { return <div className={styles.columns}>{children}</div>; }
export function Panel({ title, children }: { title?: string; children: ReactNode }) { return <div className={styles.panel}>{title && <h3>{title}</h3>}{children}</div>; }
export function Placeholder({ label, children }: { label: string; children?: ReactNode }) { return <div className={styles.placeholder}><span>{label}</span>{children}</div>; }
export function Note({ children }: { children: ReactNode }) { return <div className={styles.note}>{children}</div>; }
export function ActionLink({ href = BOOKING_URL, children }: { href?: string; children: ReactNode }) { return <Link className={styles.action} href={href}>{children}</Link>; }
export function FAQ({ items }: { items: { question: string; answer: ReactNode }[] }) { return <div className={styles.faq}>{items.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><div>{answer}</div></details>)}</div>; }
export function WireframeFooter() {
  return <SiteFooter />;
}
