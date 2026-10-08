import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";
import { ServicePageShell } from "@/components/services/service-page";
import { WebDesignHero } from "@/components/services/web-design/hero";
import { WebDesignWhy } from "@/components/services/web-design/why";
import { WebDesignDeliverables } from "@/components/services/web-design/deliverables";
import { WebDesignFaq } from "@/components/services/web-design/faq";
import { WebDesignClosing } from "@/components/services/web-design/closing";

const DESCRIPTION = "Clear content, considered design and a straightforward next step. Websites built around your business, standalone or alongside SEO.";

const schema = pageGraph(
  { name: "Web design", description: DESCRIPTION, path: "/web-design" },
  serviceSchema({ name: "Web design", serviceType: "Web design", description: DESCRIPTION, path: "/web-design" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Web design", description: DESCRIPTION, path: "/web-design" }),
};

export default function WebDesignPage() {
  return (
    <ServicePageShell>
      <JsonLd data={schema} />
      <WebDesignHero />
      <WebDesignWhy />
      <WebDesignDeliverables />
      <WebDesignFaq />
      <WebDesignClosing />
    </ServicePageShell>
  );
}
