import Link from "next/link";
import {
  ServiceFaq,
  type ServiceFaqItem,
} from "@/components/services/service-page";

const items = [
  {
    id: "google-ads-existing-campaign",
    question: "Can you work with my existing campaign?",
    answer: (
      <p>
        Yes. We review the account, recent results and tracking, then agree what
        to improve. That may mean refining the current campaign or setting up a
        new one around your goals and budget.
      </p>
    ),
  },
  {
    id: "google-ads-scope-and-budget",
    question: "What’s included, and how is the budget agreed?",
    answer: (
      <>
        <p>
          We agree your goals, budget and scope before work starts. The work
          covers keyword and negative keyword research, Search campaign and ad
          setup, optimisation, search-term reviews and a plain assessment of
          results.
        </p>
        <p>
          Paid continuation costs 15% of media spend for management, with a £100
          monthly minimum. Your media spend is separate. See the{" "}
          <Link href="/pricing#ads">full fees and conditions</Link>.
        </p>
      </>
    ),
  },
  {
    id: "google-ads-tracking-and-pages",
    question: "Will you help with landing pages and tracking?",
    answer: (
      <p>
        We recommend landing-page improvements and implement changes when they
        are part of the agreed scope. We set up conversion tracking where
        practical, so campaign reviews can consider enquiries and acquisition
        cost alongside clicks and traffic.
      </p>
    ),
  },
  {
    id: "google-ads-funded-introduction",
    question: "Can I try Google Ads alongside SEO?",
    answer: (
      <>
        <p>
          The funded introduction is optional. Core SEO offers a £400 total
          Valinor-funded trial, with management until there is enough conversion
          data to assess the campaign, capped at six months. The proposed
          £2,995/month SEO package includes £400/month of Valinor-funded Ads for
          six months from campaign launch, including management and reporting.
        </p>
        <p>
          We review the results with you. Paid continuation starts only if you
          opt in, with your media budget and management fee then paid by you.
          Additional Google promotional credits depend on eligibility, spend
          and redemption conditions; no credit amount is guaranteed.
        </p>
        <p>
          <Link href="/pricing#ads">
            Read the full introduction and continuation conditions.
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "google-ads-results",
    question: "What results should I expect?",
    answer: (
      <p>
        We agree the outcome that matters to your business, then review enquiry
        quality and acquisition cost against your margins. Results depend on
        demand, competition, budget, your offer and the landing page. We cannot
        guarantee a number of enquiries or a return on spend; the review helps
        you decide whether to continue, adjust or stop.
      </p>
    ),
  },
] as const satisfies readonly ServiceFaqItem[];

export function GoogleAdsFaq() {
  return (
    <ServiceFaq
      id="google-ads-faq"
      title="A few useful answers."
      items={items}
    />
  );
}
