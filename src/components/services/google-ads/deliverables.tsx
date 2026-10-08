import {
  ServiceDeliverables,
  type ServiceCategory,
} from "@/components/services/service-page";

const categories = [
  {
    id: "plan-prepare",
    label: "Plan & prepare",
    note: "Campaign goals, budget and any landing page work are agreed before setup.",
    items: [
      {
        title: "Campaign plan",
        deliverables: [
          "Goals and budget review notes",
          "Agreed Search campaign plan",
        ],
      },
      {
        title: "Keyword research",
        deliverables: [
          "Relevant keyword list",
          "Initial negative keyword list",
        ],
      },
      {
        title: "Landing page review",
        deliverables: [
          "Landing page recommendations",
          "Agreed page changes implemented, where included",
        ],
      },
    ],
  },
  {
    id: "campaign-tracking",
    label: "Campaign & tracking",
    note: "Tracking is set up where practical, subject to access and the website setup.",
    items: [
      {
        title: "Search campaign setup",
        deliverables: [
          "Search campaigns and ad groups",
          "Agreed targeting and budget settings",
        ],
      },
      {
        title: "Search ads",
        deliverables: [
          "Ad headlines and descriptions",
          "Ads added to the agreed ad groups",
        ],
      },
      {
        title: "Conversion tracking",
        deliverables: [
          "Conversion tracking setup, where practical",
          "Record of tracking checks and any gaps",
        ],
      },
    ],
  },
  {
    id: "review-refine",
    label: "Review & refine",
    note: "Reviews and refinements follow the agreed campaign scope and available data.",
    items: [
      {
        title: "Search term review",
        deliverables: [
          "Search term review notes",
          "Irrelevant search terms excluded",
        ],
      },
      {
        title: "Campaign optimisation",
        deliverables: [
          "Agreed keyword, ad or targeting refinements",
          "Record of campaign changes",
        ],
      },
      {
        title: "Results assessment",
        deliverables: [
          "Plain assessment against campaign goals",
          "Review notes and recommended next steps",
        ],
      },
    ],
  },
] as const satisfies readonly ServiceCategory[];

export function GoogleAdsDeliverables() {
  return (
    <ServiceDeliverables
      id="google-ads-deliverables"
      title="What we deliver."
      categories={categories}
    />
  );
}
