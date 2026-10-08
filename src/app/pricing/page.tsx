import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { LiquidCallLink } from "@/components/home-hero/liquid-call-link";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph } from "@/lib/schema";
import styles from "./pricing.module.css";

const DESCRIPTION = "Compare Valinor Systems’ SEO, AI search and website packages from £995 a month: what is included, the minimum term, website options and how we work.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "SEO Packages and Pricing", description: DESCRIPTION, path: "/pricing" }),
};

const scopeRows = [
  { name: "Initial audit & strategy", core: "At kickoff", higher: "At kickoff", included: true },
  { name: "Blogs, service pages & content updates", core: "2 / month", higher: "4 / month" },
  { name: "Technical SEO & AI search", core: "Included", higher: "Wider coverage", included: true },
  { name: "Website & conversion improvements", core: "Included", higher: "Greater capacity", included: true },
  { name: "Delivery cycles", core: "Monthly", higher: "Weekly / fortnightly" },
  { name: "Business profiles", core: "Primary Google profile", higher: "Agreed locations & profiles" },
  { name: "Links & authority", core: "Targeted outreach", higher: "More frequent outreach & follow-up" },
  { name: "Reporting & strategy call", core: "Monthly", higher: "Monthly + weekly updates" },
  { name: "Hosting, security & support", core: "Included", higher: "Included", included: true },
  { name: "Valinor-funded Google Ads", core: "£400 trial total", higher: "£400 / month for 6 months" },
] as const;

const practicalDetails = [
  { id: "first-steps", title: "Do I need a new website?", paragraphs: [
    "No. We can improve your existing website. We’ll assess what you already have and whether a rebuild would be useful.",
  ], link: { href: "/web-design", label: "How we design and build websites →" } },
  { id: "website-build", title: "When is the website build included?", paragraphs: [
    "Pay your first six months of SEO upfront and we waive the agreed website build fee. With monthly payment, the build is quoted separately—typically around £3,000, depending on scope.",
  ] },
  { id: "payments", title: "How long am I committing for?", paragraphs: [
    "The minimum term is three months from kickoff. After that, the service continues monthly, with 30 days’ written notice to end it.",
  ] },
  { id: "scope", title: "How much work will I need to do?", paragraphs: [
    "We need your business knowledge, access and approvals. We handle the agreed content, design and implementation work.",
  ] },
  { id: "ads", title: "What happens after the included Google Ads period?", paragraphs: [
    "We review the results with you before you decide whether to continue. Paid continuation includes your advertising budget plus management at 15% of spend, with a £100 monthly minimum.",
  ], link: { href: "/google-ads", label: "How we manage Google Ads →" } },
  { id: "transfer", title: "Can I take the website with me if I leave?", paragraphs: [
    "Valinor owns and manages the website during the engagement. Transfer is available under the service agreement; an early buyout fee may apply. Prepaying six months waives the build fee but doesn’t transfer ownership.",
  ], transferTerms: [
    "After the three-month initial term, service continues monthly with 30 days’ written notice. On termination and requested transfer before month twelve, the fee is the selected monthly fee × months remaining to the end of month twelve, plus outstanding invoices and pre-approved third-party costs.",
    "After at least twelve active months, client-specific deliverables transfer on termination without an added transfer fee, subject to one month’s written notice, cleared amounts and agreement compliance. Transfer is not automatic.",
    "Client-specific files, content, assets, data and functionality transfer where technically practicable; Valinor retains reusable systems and infrastructure. Migration, training, hosting setup and post-handover support are separately agreed and paid for.",
  ] },
];

const schema = pageGraph({
  name: "Pricing",
  description: DESCRIPTION,
  path: "/pricing",
  faqs: practicalDetails.map(detail => ({ question: detail.title, answer: detail.paragraphs.join(" ") })),
});

function Check() {
  return <svg className={styles.check} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function WorkingTogether() {
  return (
    <div className={`${styles.page} ${headingFont.variable} ${bodyFont.variable}`} data-fluid-page>
      <JsonLd data={schema} />
      <FluidBackground fullPage />
      <HomeHeader overHero />
      <main className={styles.content}>
        <section className={styles.hero} aria-labelledby="packages-title">
          <div className={styles.heroInner}>
            <h1 id="packages-title"><span>A clear plan.</span><span>Built around your business.</span></h1>
            <div className={styles.valueCopy}>
              <p>Get found in search. Give visitors a clearer reason to choose you.</p>
            </div>
            <div className={styles.heroAction}><LiquidCallLink /><p>We’ll talk through your goals and the work that makes sense for your business.</p></div>
          </div>
        </section>

        <section id="options" className={styles.comparisonSection} aria-labelledby="comparison-title">
          <div className={styles.sectionHeading}>
            <h2 id="comparison-title">Compare our packages</h2>
            <p>The same foundations. Different levels of delivery.</p>
            <p className={styles.sectionNote}>Three-month minimum. Choose the level of support your business needs.</p>
          </div>
          <p id="table-help" className={styles.mobileHelp}>Swipe or scroll sideways to compare both packages.</p>
          <div className={styles.tableScroll} role="region" aria-label="Package comparison" aria-describedby="table-help" tabIndex={0} data-lenis-prevent-horizontal>
            <table className={styles.table}>
              <caption className="sr-only">Core at £995 per month and Greater capacity at £2,995 per month. Both have a three-month minimum.</caption>
              <colgroup><col className={styles.featureColumn} /><col /><col /></colgroup>
              <thead><tr>
                <th scope="col">What’s included</th>
                <th scope="col"><span className={styles.planName}>Core</span><span className={styles.planStatus} aria-hidden="true">&nbsp;</span><span className={styles.price}>£995 <span>/ month</span></span></th>
                <th scope="col"><span className={styles.planName}>Greater capacity</span><span className={styles.planStatus} aria-hidden="true">&nbsp;</span><span className={styles.price}>£2,995 <span>/ month</span></span></th>
              </tr></thead>
              <tbody>{scopeRows.map(row => <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td><span className={styles.cellValue}>{"included" in row && row.included && <Check />}{row.core}</span></td>
                <td><span className={styles.cellValue}>{"included" in row && row.included && <Check />}{row.higher}</span></td>
              </tr>)}</tbody>
              <tfoot><tr><th scope="row"><span className="sr-only">Discuss a package</span></th><td><LiquidCallLink /></td><td><LiquidCallLink /></td></tr></tfoot>
            </table>
          </div>
          <div className={styles.tableNotes}>
            <p>Website build fee waived with six months of SEO paid upfront. <Link href="#transfer">Managed ownership terms apply.</Link></p>
          </div>
        </section>

        <section id="faqs" className={styles.websiteSection} aria-labelledby="faq-title">
          <h2 id="faq-title">Frequently asked questions</h2>
          <div className={styles.details}>{practicalDetails.map(detail => <details key={detail.id} id={detail.id}>
            <summary>{detail.title}<span className={styles.plus} aria-hidden="true" /></summary>
            <div className={styles.detailCopy}>
              {detail.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {detail.link && <p><Link href={detail.link.href}>{detail.link.label}</Link></p>}
              {detail.transferTerms && <details className={styles.transferTerms}>
                <summary>Full website transfer terms<span className={styles.plus} aria-hidden="true" /></summary>
                <div className={styles.detailCopy}>{detail.transferTerms.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
              </details>}
            </div>
          </details>)}</div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <h2 id="closing-title">Let’s talk about<br />your business.</h2>
          <p>You don’t need to choose a package first.<br />We’ll work out the right next step together.</p>
          <LiquidCallLink />
          <p className={styles.standalone}>Standalone <Link href="/web-design">web design</Link>, <Link href="/google-ads">paid Google Ads</Link> and <Link href="/google-ad-grants">charity Ad Grants</Link> are also available with separately agreed scope and fees. See what the <Link href="/seo">SEO and AI search</Link> work covers.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
