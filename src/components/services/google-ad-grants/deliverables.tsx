import {
  ServiceDeliverables,
  type ServiceCategory,
} from "../service-page";

const categories = [
  {
    id: "getting-started",
    label: "Getting started",
    note: "Google decides eligibility, approval and programme availability. Your charity supplies the required information.",
    items: [
      {
        title: "Readiness review",
        deliverables: [
          "Charitable eligibility and website review notes",
          "Required account and website access checklist",
        ],
      },
      {
        title: "Application support",
        deliverables: [
          "Application guidance and charity information checklist",
          "Account activation support, subject to Google approval",
        ],
      },
      {
        title: "Scope & access plan",
        deliverables: [
          "Agreed campaign goals and management scope",
          "Account ownership and access plan",
        ],
      },
    ],
  },
  {
    id: "new-campaigns",
    label: "New campaigns",
    note: "Campaign work starts after approval. Tracking depends on access, consent and your website setup.",
    items: [
      {
        title: "Campaign setup",
        deliverables: [
          "Search campaigns, ad groups and keyword lists",
          "Initial negative keywords and campaign settings",
        ],
      },
      {
        title: "Ad copy",
        deliverables: [
          "Ad headlines and descriptions",
          "Ads added to the agreed campaign structure",
        ],
      },
      {
        title: "Conversion tracking",
        deliverables: [
          "Conversion setup and tracking checks, where practical",
          "Record of consent, access or website limitations",
        ],
      },
    ],
  },
  {
    id: "ongoing-management",
    label: "Ongoing management",
    note: "Management follows the agreed scope and available data. Spend and results are not guaranteed.",
    items: [
      {
        title: "Existing account review",
        deliverables: [
          "Existing account and campaign review notes",
          "Account access check and agreed priorities",
        ],
      },
      {
        title: "Review & refinement",
        deliverables: [
          "Search term and programme policy checks",
          "Agreed keyword, ad and exclusion updates",
        ],
      },
      {
        title: "Tracking & reporting",
        deliverables: [
          "Tracking checks and campaign performance report",
          "Recorded changes and recommended next actions",
        ],
      },
    ],
  },
] as const satisfies readonly ServiceCategory[];

export function GoogleAdGrantsDeliverables() {
  return (
    <ServiceDeliverables
      id="google-ad-grants-deliverables"
      title="What we deliver."
      categories={categories}
    />
  );
}
