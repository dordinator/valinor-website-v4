import { ServiceFaq, type ServiceFaqItem } from "../service-page";

const items = [
  {
    id: "google-ad-grants-programme",
    question: "What does Google Ad Grants provide?",
    answer: (
      <p>
        Google’s programme offers eligible nonprofits up to US$10,000 per month
        in in-kind Google Search advertising. It is advertising support, not a
        cash grant, and spending the full monthly amount is not guaranteed. See{" "}
        <a href="https://www.google.com/grants/faq/">
          Google’s Ad Grants FAQ
        </a>.
      </p>
    ),
  },
  {
    id: "getting-started",
    question: "Can you help our charity apply?",
    answer: (
      <p>
        Yes. We review your charity’s readiness, identify website work and help
        with the application steps. Google controls eligibility, verification,
        approval and programme availability; we cannot guarantee acceptance or
        a fixed approval date. Start with Google’s{" "}
        <a href="https://www.google.com/nonprofits/about/eligibility/">
          eligibility guidance
        </a>{" "}
        and{" "}
        <a href="https://support.google.com/nonprofits/answer/1332166?hl=en">
          Ad Grants budget guidance
        </a>.
      </p>
    ),
  },
  {
    id: "existing-account",
    question: "Can you work with an existing Ad Grants account?",
    answer: (
      <p>
        Yes. With the appropriate access, we review the account, campaigns,
        website and available tracking, then agree the improvements that fit
        your charity’s goals. That may involve refining existing campaigns or
        building new ones around your services and priorities.
      </p>
    ),
  },
  {
    id: "google-ad-grants-website-and-access",
    question: "What website and access do we need?",
    answer: (
      <p>
        Your charity needs a website it controls, with HTTPS, clear information
        about its mission and useful, working pages. We also need appropriate
        access to the relevant Google accounts and website for the agreed work.
        We review any gaps against{" "}
        <a href="https://support.google.com/nonprofits/answer/1657899?hl=en-SG">
          Google’s website requirements
        </a>.
      </p>
    ),
  },
  {
    id: "scope-and-fees",
    question: "What does Valinor’s work cost?",
    answer: (
      <p>
        We agree the setup, ongoing management, reporting and any other work
        with your charity before starting. Valinor’s setup and management fees
        are separately agreed and paid; Google’s in-kind advertising offer does
        not pay those fees.
      </p>
    ),
  },
  {
    id: "google-ad-grants-pages-and-tracking",
    question: "Will you help with landing pages and tracking?",
    answer: (
      <p>
        We recommend landing-page improvements and implement them when included
        in the agreed scope. Conversion tracking depends on the access
        available, your website and the required consent arrangements. Where
        practical, it helps us review actions such as donations, enquiries and
        volunteer applications alongside traffic.
      </p>
    ),
  },
  {
    id: "google-ad-grants-results",
    question: "What results should our charity expect?",
    answer: (
      <p>
        We agree the actions that matter to your charity and review the evidence
        as campaigns run. Results depend on search demand, competition, your
        message and the website experience. We cannot guarantee donations,
        volunteer applications or a particular result; reviews help you decide
        what to improve next.
      </p>
    ),
  },
] as const satisfies readonly ServiceFaqItem[];

export function GoogleAdGrantsFaq() {
  return (
    <ServiceFaq
      id="google-ad-grants-faq"
      title="A few useful answers."
      items={items}
    />
  );
}
