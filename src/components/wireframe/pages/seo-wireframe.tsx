import Link from "next/link";
import { ActionLink, Columns, PageIntro, Placeholder, Section, WireframePage } from "@/components/wireframe/wireframe";
import styles from "./seo-wireframe.module.css";

export default function SeoWireframe() {
  return <WireframePage>
    <PageIntro title="Useful content. Better search visibility." price={<><strong>£995/month</strong> · Three-month minimum from kickoff. Paid in advance.</>}>
      <p>SEO, AEO and website improvements that help suitable customers find and understand your business.</p>
    </PageIntro>
    <Section id="the-work" title="What we work on.">
      <div className={styles.workList}>
        <div><h3>Content and AEO</h3><p>Customer questions, useful guides and clearer service pages.</p></div>
        <div><h3>Technical foundations</h3><p>Indexing, speed, mobile use and on-page improvements.</p></div>
        <div><h3>Recognition and conversion</h3><p>Relevant outreach, business profiles and clearer enquiry routes.</p></div>
      </div>
      <p className={styles.small}>Monthly work and reporting follow an agreed plan. <Link href="/working-together#scope">View scope and capacity ↗</Link></p>
      <details id="site-access" className={styles.details}><summary>Working on your existing website</summary><p>We arrange authorised access or cooperate with your website manager. A new website is a separate decision. <Link href="/web-design">Explore Web Design ↗</Link></p></details>
    </Section>
    <Section id="relevant-work" tone="dark" title="Selected work.">
      <Columns>
        <div className={styles.projectImage}><Placeholder label="NJH Sports Therapy — image to select" /></div>
        <div><h3>NJH Sports Therapy and Pilates</h3><p>Website design, build, copy and ongoing SEO for an independent practice.</p><a href="https://www.njhsportstherapy.co.uk/" target="_blank" rel="noopener noreferrer" className={styles.textLink}>View project ↗ (new tab)</a></div>
      </Columns>
    </Section>
    <Section id="start" title="Let’s talk about your business.">
      <p>Bring your website and what needs attention.</p>
      <ActionLink>Book a call ↗</ActionLink>
      <p className={styles.small}>A £400 introductory Ads trial is available. <Link href="/working-together#ads">Funding and continuation conditions ↗</Link></p>
    </Section>
  </WireframePage>;
}
