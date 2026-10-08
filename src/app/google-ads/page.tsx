import type { Metadata } from "next";
import { ServicePageShell } from "@/components/services/service-page";
import { GoogleAdsHero } from "@/components/services/google-ads/hero";
import { GoogleAdsWhy } from "@/components/services/google-ads/why";
import { GoogleAdsDeliverables } from "@/components/services/google-ads/deliverables";
import { GoogleAdsFaq } from "@/components/services/google-ads/faq";
import { GoogleAdsClosing } from "@/components/services/google-ads/closing";

export const metadata: Metadata = {
  title: "Google Ads",
  description:
    "Focused Google Search campaigns, useful landing pages and clear results reviews. Discuss a new or existing campaign with Valinor Systems.",
  alternates: { canonical: "/google-ads" },
};

export default function GoogleAdsPage() {
  return (
    <ServicePageShell>
      <GoogleAdsHero />
      <GoogleAdsWhy />
      <GoogleAdsDeliverables />
      <GoogleAdsFaq />
      <GoogleAdsClosing />
    </ServicePageShell>
  );
}
