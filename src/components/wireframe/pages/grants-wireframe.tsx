import Link from "next/link";
import {
  ActionLink,
  Columns,
  PageIntro,
  Section,
  WireframePage,
} from "@/components/wireframe/wireframe";
import styles from "./grants-wireframe.module.css";

export default function GrantsWireframe() {
  return (
    <WireframePage>
      <PageIntro title="Google Ad Grants for your charity.">
        <p>Search advertising can help people find your cause. Valinor offers setup and ongoing-management help.</p>
      </PageIntro>

      <Section title="Start where you are.">
        <Columns>
          <article id="getting-started" className={styles.pathway}>
            <h3>Getting started</h3>
            <p>Discuss your charity, website and programme readiness. We agree which application and account setup tasks we will handle, and what you need to provide.</p>
          </article>
          <article id="existing-account" className={styles.pathway}>
            <h3>Already have an account?</h3>
            <p>Bring your current account situation and priorities. We agree the management work, website needs, tracking and reporting around the account you have.</p>
          </article>
        </Columns>
        <p id="scope-and-fees" className={styles.feeSummary}>Google’s programme is for eligible nonprofits; its advertising funding is separate from Valinor’s fees, which are agreed for your charity.</p>
        <a className={styles.programmeLink} href="https://www.google.com/grants/" target="_blank" rel="noopener noreferrer">Google’s official programme information ↗<span className={styles.srOnly}> (opens in a new tab)</span></a>
      </Section>

      <Section title="Let’s discuss your charity." tone="dark">
        <p className={styles.invitation}>Your charity URL and current account status are useful optional starting points.</p>
        <div className={styles.actions}><ActionLink>Book a call ↗</ActionLink></div>
        <p><Link href="/web-design">Website help</Link> · <Link href="/google-ads">Paid Google Ads</Link> · <Link href="/pricing">Pricing</Link></p>
      </Section>
    </WireframePage>
  );
}
