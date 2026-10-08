"use client";

import { ServiceWhyStory, type ServiceStoryChapter } from "../service-page";
import { GrantsTargetingPreview } from "./targeting-preview";
import { GrantsVolunteerEnquiry } from "./volunteer-enquiry";
import styles from "./why.module.css";

function FundingOpportunity() {
  return <div className={styles.fundingScene}><div className={styles.fundingCard}>
    <p className={styles.programmeName}>Google Ad Grants</p><p className={styles.allowanceLabel}>Monthly advertising allowance</p>
    <p className={styles.allowance}><span>Up to</span>US$10,000</p><p className={styles.allowanceContext}>per month in Google Search advertising</p>
    <ul className={styles.fundingUses}><li>Donations</li><li>Volunteers</li><li>Access to services</li></ul>
    <a className={styles.programmeSource} href="https://www.google.com/grants/faq/" target="_blank" rel="noopener noreferrer">About Google’s programme</a>
  </div><p className={styles.fundingNote}>For eligible nonprofits. In-kind advertising, not cash. Full spend is not guaranteed; setup and management fees are separate.</p></div>;
}
const chapters = [
  { id: "google-funded-reach", statement: "A bigger reach. Funded by Google.", statementBreakAfter: 3, title: "Advertising support", description: "Put Google’s advertising allowance behind the people and priorities that matter to your charity.", visual: <FundingOpportunity /> },
  { id: "relevant-interest", statement: "Reach people looking for what your charity offers.", title: "Campaign focus", description: "Choose your charity’s goal and location to explore a matching search and ad.", visual: <GrantsTargetingPreview /> },
  { id: "meaningful-next-step", statement: "Turn that interest into meaningful support.", title: "From interest to involvement", description: "Give someone the information they need and a clear way to get involved.", visual: <GrantsVolunteerEnquiry /> },
] as const satisfies readonly ServiceStoryChapter[];
export function GoogleAdGrantsWhy() {
  return <ServiceWhyStory id="why-google-ad-grants" title="Why Google Ad Grants matter." chapters={chapters} className={styles.story} />;
}
