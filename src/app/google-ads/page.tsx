import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";
import { ServicePageShell } from "@/components/services/service-page";
import { GoogleAdsHero } from "@/components/services/google-ads/hero";
import { GoogleAdsWhy } from "@/components/services/google-ads/why";
import { GoogleAdsDeliverables } from "@/components/services/google-ads/deliverables";
import { GoogleAdsFaq } from "@/components/services/google-ads/faq";
import { GoogleAdsClosing } from "@/components/services/google-ads/closing";

const DESCRIPTION = "Focused Google Search campaigns, useful landing pages and clear results reviews. Discuss a new or existing campaign with Valinor Systems.";

const schema = pageGraph(
  { name: "Google Ads", description: DESCRIPTION, path: "/google-ads" },
  serviceSchema({ name: "Google Ads", serviceType: "Google Ads management", description: DESCRIPTION, path: "/google-ads" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Google Ads", description: DESCRIPTION, path: "/google-ads" }),
};

export default function GoogleAdsPage() {
  return (
    <ServicePageShell>
      <JsonLd data={schema} />
      <GoogleAdsHero />
      <GoogleAdsWhy />
      <GoogleAdsDeliverables />
      <GoogleAdsFaq />
      <GoogleAdsClosing />
    </ServicePageShell>
  );
}
