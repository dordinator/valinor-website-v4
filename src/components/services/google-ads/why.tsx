import { ServiceFocus, ServiceWhyStory, type ServiceStoryChapter } from "../service-page";
import styles from "./why.module.css";

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function SearchFocus() {
  return (
    <div className={styles.cutout} role="group" aria-label="Illustrative search selection for a fictional plumbing business">
      <div className={styles.cutoutHeader}>
        <strong>Search focus</strong>
        <span>Illustration · Example Plumbing</span>
      </div>
      <div className={styles.searchQuery}>
        <SearchIcon />
        <ServiceFocus>boiler repair near me</ServiceFocus>
      </div>
      <div className={styles.searchColumns} aria-hidden="true">
        <span>What someone searches</span>
        <span>Campaign focus</span>
      </div>
      <ul className={styles.searchRows}>
        <li className={styles.focusRow}>
          <span><ServiceFocus>boiler repair near me</ServiceFocus></span>
          <span className={styles.decision}><span aria-hidden="true">✓</span> Relevant service</span>
        </li>
        <li>
          <span><ServiceFocus order={1}>local plumber</ServiceFocus></span>
          <span className={styles.decision}><span aria-hidden="true">✓</span> Relevant service</span>
        </li>
        <li className={styles.excludedRow}>
          <span><ServiceFocus order={2}>plumbing courses</ServiceFocus></span>
          <span className={styles.excludedDecision}><span aria-hidden="true">−</span> Exclude</span>
        </li>
      </ul>
    </div>
  );
}

function EnquiryJourney() {
  return (
    <div className={styles.cutout} role="group" aria-label="Illustrative journey from a focused plumbing ad to a useful landing page and an enquiry">
      <div className={styles.cutoutHeader}>
        <strong>From search to enquiry</strong>
        <span>Illustration · Example Plumbing</span>
      </div>
      <div className={styles.journey}>
        <div className={styles.ad}>
          <p className={styles.stageLabel}>Focused ad</p>
          <p className={styles.exampleUrl}>example.com/boiler-repair</p>
          <p className={styles.adTitle}><ServiceFocus>Boiler repair from a local plumber</ServiceFocus></p>
          <p className={styles.adDescription}>Tell us what’s wrong with your boiler. Ask about a repair.</p>
          <span className={styles.routeArrow} aria-hidden="true">→</span>
        </div>
        <div className={styles.landingPage}>
          <p className={styles.stageLabel}>Useful landing page</p>
          <p className={styles.landingTitle}><ServiceFocus>Boiler repair.</ServiceFocus></p>
          <ul className={styles.pageDetails}>
            <li>Repairs we can help with</li>
            <li>Areas we cover</li>
            <li>What happens next</li>
          </ul>
          <div className={styles.enquiryAction}>
            <span><ServiceFocus order={2}>Ask about a repair</ServiceFocus></span>
            <span aria-hidden="true">↗</span>
          </div>
          <p className={styles.actionNote}>A clear next step to an enquiry</p>
        </div>
      </div>
    </div>
  );
}

const reviewRows = [
  { observation: "“boiler repair near me”", check: "Does the search fit the service?", refinement: "Keep the campaign focused" },
  { observation: "“plumbing jobs”", check: "Is this someone looking for work?", refinement: "Exclude irrelevant searches" },
  { observation: "Enquiry form submission", check: "Is the enquiry recorded correctly?", refinement: "Review conversion tracking" },
] as const;

function CampaignReview() {
  return (
    <div className={styles.cutout} role="group" aria-label="Illustrative campaign review showing how search terms and enquiry tracking guide refinements">
      <div className={styles.cutoutHeader}>
        <strong>Campaign review</strong>
        <span>Illustration · Example Plumbing</span>
      </div>
      <div className={styles.reviewColumns} aria-hidden="true">
        <span>Search or action</span>
        <span>What we check</span>
        <span>Possible refinement</span>
      </div>
      <ul className={styles.reviewRows}>
        {reviewRows.map((row, index) => (
          <li key={row.observation}>
            <p><span className={styles.mobileLabel}>Search or action</span>{row.observation}</p>
            <p className={styles.reviewCheck}><span className={styles.mobileLabel}>What we check</span>{row.check}</p>
            <p className={styles.refinement}><span className={styles.mobileLabel}>Possible refinement</span><span className={styles.refinementText}><span aria-hidden="true">↳</span><ServiceFocus order={index}>{row.refinement}</ServiceFocus></span></p>
          </li>
        ))}
      </ul>
      <p className={styles.reviewNote}>Search terms and recorded enquiries inform the next changes.</p>
    </div>
  );
}

const chapters = [
  {
    id: "relevant-searches",
    statement: "Focus on searches that fit your services.",
    title: "Relevant searches.",
    description: "Connect the services you offer with what potential customers are looking for.",
    visual: <SearchFocus />,
  },
  {
    id: "search-to-enquiry",
    statement: "Give interest a clear next step.",
    title: "From search to enquiry.",
    description: "Keep the ad and landing page focused on the same service, with a useful route to contact you.",
    visual: <EnquiryJourney />,
  },
  {
    id: "review-and-refine",
    statement: "Use what you learn to guide the next changes.",
    title: "Clear reviews. Considered refinements.",
    description: "Review search terms and reliable enquiry data, then refine the campaign around what matters to your business.",
    visual: <CampaignReview />,
  },
] as const satisfies readonly ServiceStoryChapter[];

export function GoogleAdsWhy() {
  return <ServiceWhyStory id="why-google-ads" title="Why focused campaigns matter." chapters={chapters} />;
}
