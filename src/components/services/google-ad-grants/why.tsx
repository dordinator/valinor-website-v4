import { ServiceFocus, ServiceWhyStory, type ServiceStoryChapter } from "../service-page";
import styles from "./why.module.css";

function ExampleHeader({ title }: { title: string }) {
  return (
    <div className={styles.cutoutHeader}>
      <strong>{title}</strong>
      <span>Fictional example · Example Community Kitchen</span>
    </div>
  );
}

function SearchDiscovery() {
  return (
    <div className={styles.cutout} role="group" aria-label="Fictional example: a relevant search introduces Example Community Kitchen">
      <ExampleHeader title="A relevant search" />
      <div className={styles.searchQuery}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
        <ServiceFocus>volunteer at a community kitchen</ServiceFocus>
      </div>
      <div className={styles.searchResult}>
        <p className={styles.sponsored}>Sponsored</p>
        <p className={styles.charityName}>Example Community Kitchen</p>
        <p className={styles.exampleUrl}>example.org/volunteer</p>
        <p className={styles.resultTitle}>Help serve your local community</p>
        <p className={styles.resultDescription}>Explore kitchen volunteer roles, see what’s involved and ask how you can help.</p>
        <div className={styles.resultLinks} aria-label="Illustrative ad information">
          <ServiceFocus>Volunteer roles</ServiceFocus>
          <ServiceFocus order={1}>What to expect</ServiceFocus>
          <ServiceFocus order={2}>Other ways to help</ServiceFocus>
        </div>
      </div>
    </div>
  );
}

function UsefulInformation() {
  return (
    <div className={styles.cutout} role="group" aria-label="Fictional example: useful volunteer information on the Example Community Kitchen website">
      <ExampleHeader title="Information that fits the search" />
      <div className={styles.pagePreview}>
        <p className={styles.charityName}>Example Community Kitchen</p>
        <p className={styles.pageTitle}>Volunteer in the kitchen.</p>
        <p className={styles.pageIntro}>There are several ways to help. Find a role that fits the time you can give.</p>
        <dl className={styles.pageDetails}>
          <div>
            <dt><ServiceFocus>Your role</ServiceFocus></dt>
            <dd>Help prepare ingredients, serve meals or welcome visitors.</dd>
          </div>
          <div>
            <dt><ServiceFocus order={1}>Your availability</ServiceFocus></dt>
            <dd>Talk to the team about the days and times you can help.</dd>
          </div>
          <div>
            <dt><ServiceFocus order={2}>Getting started</ServiceFocus></dt>
            <dd>The volunteer team can explain the roles and answer your questions.</dd>
          </div>
        </dl>
        <p className={styles.otherWays}>Looking for something else? <span>Donate</span> <span>Find support</span></p>
      </div>
    </div>
  );
}

function VolunteeringEnquiry() {
  return (
    <div className={styles.cutout} role="group" aria-label="Fictional example: a clear route to ask Example Community Kitchen about volunteering">
      <ExampleHeader title="A clear way to get involved" />
      <div className={styles.enquiryPreview}>
        <p className={styles.charityName}>Example Community Kitchen</p>
        <p className={styles.pageTitle}>Ask about volunteering.</p>
        <p className={styles.pageIntro}>Start a conversation about the roles, your interests and the time you can offer.</p>
        <div className={styles.enquiryQuestion}>
          <span>A question someone might ask</span>
          <p>“I’d like to help in the kitchen. What roles could suit me?”</p>
        </div>
        <div className={styles.exampleAction}>
          <span><ServiceFocus order={2}>Enquire about volunteering</ServiceFocus></span>
          <span aria-hidden="true">↗</span>
        </div>
        <p className={styles.actionContext}>A route to the volunteer team.</p>
      </div>
    </div>
  );
}

const chapters = [
  {
    id: "discover-your-cause",
    statement: "Help people discover your cause.",
    title: "Relevant searches. Relevant interest.",
    description: "Google Search can introduce your charity to people looking for the help or opportunities you offer.",
    visual: <SearchDiscovery />,
  },
  {
    id: "useful-information",
    statement: "Answer the questions behind the search.",
    title: "Useful information.",
    description: "Give people practical information about donating, volunteering or finding support, on a page that matches their interest.",
    visual: <UsefulInformation />,
  },
  {
    id: "meaningful-next-step",
    statement: "Give interest a meaningful next step.",
    title: "From interest to involvement.",
    description: "Make it clear how someone can ask a question, enquire about volunteering or take another useful action.",
    visual: <VolunteeringEnquiry />,
  },
] as const satisfies readonly ServiceStoryChapter[];

export function GoogleAdGrantsWhy() {
  return <ServiceWhyStory id="why-google-ad-grants" title="Why being found matters." chapters={chapters} />;
}
