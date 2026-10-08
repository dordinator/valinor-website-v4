import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import GoogleAdsWireframe from "@/components/wireframe/pages/google-ads-wireframe";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";

const DESCRIPTION = "Targeted Google Search campaigns with conversion tracking and regular review, set up and managed by Valinor Systems.";

const schema = pageGraph(
  { name: "Google Ads", description: DESCRIPTION, path: "/google-ads" },
  serviceSchema({ name: "Google Ads management", serviceType: "Pay-per-click advertising management", description: DESCRIPTION, path: "/google-ads" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Google Ads", description: DESCRIPTION, path: "/google-ads" }),
};

export default function GoogleAdsPage() {
  return <><JsonLd data={schema} /><GoogleAdsWireframe /></>;
}
