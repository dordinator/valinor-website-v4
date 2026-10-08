import Link from "next/link";
import { ActionLink, PageIntro, Section, WireframePage } from "@/components/wireframe/wireframe";
import styles from "./google-ads-wireframe.module.css";

export default function GoogleAdsWireframe() {
  return <WireframePage>
    <PageIntro title="Reach people looking for your services.">
      <p>Focused Google Search campaigns, useful landing pages and clear results reviews.</p>
    </PageIntro>
    <Section id="campaign-work" title="From search to enquiry.">
      <div className={styles.journey}><span>Relevant search</span><span aria-hidden="true">→</span><span>Focused ad</span><span aria-hidden="true">→</span><span>Useful page</span><span aria-hidden="true">→</span><span>Enquiry</span></div>
      <p>We agree the goal and budget, prepare the campaign and tracking, then manage and review it.</p>
      <p id="introductory-campaign" className={styles.small}>Trying Ads alongside SEO? <Link href="/pricing#ads">See funded introduction and continuation terms ↗</Link></p>
    </Section>
    <Section id="fees" title="A simple cost example." tone="dark">
      <p><strong>15% of ad spend</strong> · £100/month management minimum. Media spend is separate.</p>
      <div className={styles.cost}><span>£500 <small>media spend</small></span><span aria-hidden="true">+</span><span>£100 <small>management</small></span><span aria-hidden="true">=</span><span>£600 <small>monthly total</small></span></div>
      <p>Illustrative paid-continuation budget. Review acquisition cost against the business’s margins; results are not guaranteed.</p>
    </Section>
    <Section id="start" title="Discuss a new or existing campaign.">
      <ActionLink>Book a call ↗</ActionLink>
      <p className={styles.small}><Link href="/web-design">Website help</Link> · <Link href="/google-ad-grants">Charity Ad Grants</Link> · <Link href="/pricing#ads">Fees and conditions</Link></p>
    </Section>
  </WireframePage>;
}
