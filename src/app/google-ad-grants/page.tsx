import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";
import { ServicePageShell } from "@/components/services/service-page";
import { GoogleAdGrantsHero } from "@/components/services/google-ad-grants/hero";
import { GoogleAdGrantsWhy } from "@/components/services/google-ad-grants/why";
import { GoogleAdGrantsDeliverables } from "@/components/services/google-ad-grants/deliverables";
import { GoogleAdGrantsFaq } from "@/components/services/google-ad-grants/faq";
import { GoogleAdGrantsClosing } from "@/components/services/google-ad-grants/closing";

const DESCRIPTION = "Google Ad Grants setup and ongoing management for your charity. Discuss programme readiness, Search campaigns, website needs, tracking and reporting with Valinor Systems.";

const schema = pageGraph(
  { name: "Google Ad Grants", description: DESCRIPTION, path: "/google-ad-grants" },
  serviceSchema({ name: "Google Ad Grants", serviceType: "Google Ad Grants management", description: DESCRIPTION, path: "/google-ad-grants" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Google Ad Grants", description: DESCRIPTION, path: "/google-ad-grants" }),
};

export default function GoogleAdGrantsPage() {
  return (
    <ServicePageShell>
      <JsonLd data={schema} />
      <GoogleAdGrantsHero />
      <GoogleAdGrantsWhy />
      <GoogleAdGrantsDeliverables />
      <GoogleAdGrantsFaq />
      <GoogleAdGrantsClosing />
    </ServicePageShell>
  );
}
