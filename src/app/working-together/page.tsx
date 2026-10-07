import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink, FAQ, Note, PageIntro, Section, WireframePage } from "@/components/wireframe/wireframe";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Options and pricing",
  description: "Compare SEO work levels, website options and working arrangements with Valinor Systems.",
  alternates: { canonical: "/working-together" },
};

const scopeRows = [
  ["Content & publishing", "2 substantial items/month proposed", "4 substantial items/month proposed"],
  ["SEO & AEO", "Priority content, technical fixes and visibility review", "Wider coverage and implementation capacity"],
  ["Business profiles", "Relevant primary Google Business Profile", "Agreed locations and external profiles"],
  ["Links & authority", "Targeted outreach", "More frequent outreach and follow-up"],
  ["Website improvements", "UX, conversion, reviews and routine updates", "Greater capacity and coordination"],
  ["Reporting & review", "Monthly findings; optional monthly call", "More frequent updates; monthly call"],
  ["Managed-site care", "Hosting, security, backups and incident handling", "Same baseline care for agreed sites"],
] as const;

export default function WorkingTogether() {
  return (
    <WireframePage>
      <PageIntro title="Options & pricing">
        <p>Choose the ongoing work you need, then your website starting point. We can help you decide on a call.</p>
        <nav className={styles.contents} aria-label="On this pricing page">
          <Link href="#options">Compare options ↓</Link><Link href="#payments">Payment & terms ↓</Link>
        </nav>
      </PageIntro>

      <Section id="options" title="Choose your work level" className={styles.comparisonScene}>
        <div className={styles.optionGrid}>
          <div className={styles.optionSummary}>
            <div className={styles.planRow}><div><h3>Core</h3><p>Focused SEO and improvements for one business website.</p></div><p className={styles.price}>£995<span>/ month</span></p></div>
            <div className={styles.planRow}><div><h3>Greater capacity</h3><p>More content, implementation and wider profile coverage. Under development.</p></div><p className={styles.price}>£2,995<span>/ month · proposed</span></p></div>
            <div className={styles.subsection}><h3>Keep your site or build a new one</h3><p>Either work level can start with either. A new build covers agreed design, copy/content, migration and functions, without a page cap or narrow feature restriction at this stage.</p><Link className={styles.textLink} href="/web-design">Website project detail ↗</Link></div>
            <div id="first-steps" className={styles.subsection}><h3>Getting started</h3><p>Existing site: access → audit → changes. New site: plan → approve → build/test → launch. Access and decisions affect timing; Ads and outreach follow readiness.</p></div>
          </div>
          <div id="scope" className={styles.scope}>
            <h3>Included work</h3>
            <div className={styles.comparison}><table>
              <thead><tr><th scope="col">Work</th><th scope="col">Core · £995</th><th scope="col">Proposed · £2,995</th></tr></thead>
              <tbody>{scopeRows.map(([name, core, higher]) => <tr key={name}><th scope="row">{name}</th><td><span className={styles.mobileLabel}>Core · £995/month</span>{core}</td><td><span className={styles.mobileLabel}>Proposed · £2,995/month</span>{higher}</td></tr>)}</tbody>
            </table></div>
          </div>
        </div>
      </Section>

      <Section id="payments" title="Payment & practical terms" tone="dark" className={styles.termsScene}>
        <div className={styles.termsGrid}>
          <div>
            <h3>Monthly payment</h3><p>Three-month minimum from kickoff, including build time. Fees paid in advance. Separate website guide: around £3,000 to scope, 50% at kickoff and 50% on completion.</p>
            <h3>Six months upfront · build included</h3><p>Optional prepayment: £5,970 at Core or £17,970 at the proposed higher level. Pay before kickoff to waive the full agreed build fee; the period runs from kickoff.</p>
          </div>
          <div id="ads" className={styles.anchor}>
            <h3>Introductory Google Ads</h3><p>Core: £400 total funded trial with management/review. Proposed higher level: £400/month for six months from campaign launch, with management/reporting.</p><p>Continue only by agreement: separate client-funded media plus management at 15% of spend, minimum £100/month. Any Google credit depends on eligibility, qualifying spend and redemption terms/deadlines.</p>
          </div>
        </div>
        <div id="ownership" className={styles.ownership}><h3>Managed website ownership</h3><p>Valinor retains ownership; your business is licensed to use the site. Six-month prepayment does not transfer ownership.</p></div>
        <div className={styles.disclosures}><FAQ items={[
          { question: "Leaving the service and transferring the website", answer: "After the three-month initial term, service continues monthly with 30 days’ written notice. On termination and requested transfer before month twelve, the fee is the selected monthly fee × months remaining to the end of month twelve, plus outstanding invoices and pre-approved third-party costs. After at least twelve active months, client-specific deliverables transfer on termination without an added transfer fee, subject to one month’s written notice, cleared amounts and agreement compliance. Transfer is not automatic. Client-specific files, content, assets, data and functionality transfer where technically practicable; Valinor retains reusable systems and infrastructure. Migration, training, hosting setup and post-handover support are separately agreed and paid for." },
          { question: "Scope details to confirm before engagement", answer: <Note>Higher-tier availability, content quantities, turnaround, VAT, support cover/SLA and Ads assessment criteria remain to confirm. Rankings, leads and AI citations are not guaranteed.</Note> },
        ]} /></div>
      </Section>

      <Section title="Let’s discuss what you need">
        <p>Standalone web design, paid Ads and charity Grants are also available with separately agreed scope and fees. You do not need to choose a tier first.</p>
        <ActionLink>Book a call ↗</ActionLink>
      </Section>
    </WireframePage>
  );
}
