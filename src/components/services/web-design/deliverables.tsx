import {
  ServiceDeliverables,
  type ServiceCategory,
} from "@/components/services/service-page";

const categories = [
  {
    id: "structure-copy",
    label: "Structure & copy",
    note: "The page structure, content and assets are agreed for your project.",
    items: [
      {
        title: "Site structure",
        deliverables: [
          "Agreed page and navigation plan",
          "Key routes to enquiry",
        ],
      },
      {
        title: "Page copy",
        deliverables: [
          "Copy for the agreed pages",
          "Headings and calls to action",
        ],
      },
      {
        title: "Content & assets",
        deliverables: [
          "Page content and asset list",
          "Supplied images and brand assets organised",
        ],
      },
    ],
  },
  {
    id: "design-build",
    label: "Design & build",
    note: "Approve the design before we build the agreed site.",
    items: [
      {
        title: "Design approval",
        deliverables: [
          "Page layouts and visual direction",
          "Revisions within the agreed scope",
        ],
      },
      {
        title: "Responsive development",
        deliverables: [
          "Approved pages built",
          "Desktop, tablet and mobile layouts",
        ],
      },
      {
        title: "Functions & migration",
        deliverables: [
          "Agreed website functions implemented",
          "Agreed content and assets migrated",
        ],
      },
    ],
  },
  {
    id: "testing-launch",
    label: "Testing & launch",
    note: "We test the build, make final fixes and launch with your approval.",
    items: [
      {
        title: "Link & device checks",
        deliverables: [
          "Navigation and key links tested",
          "Desktop, tablet and mobile checks",
        ],
      },
      {
        title: "Form & function checks",
        deliverables: [
          "Included forms and submissions checked",
          "Agreed website functions tested",
        ],
      },
      {
        title: "Approved launch",
        deliverables: [
          "Final fixes within the agreed scope",
          "Launch after your approval",
        ],
      },
    ],
  },
] as const satisfies readonly ServiceCategory[];

export function WebDesignDeliverables() {
  return (
    <ServiceDeliverables
      id="web-design-deliverables"
      title="The essentials, considered together."
      categories={categories}
    />
  );
}
