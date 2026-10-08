import type { Metadata } from "next";
import { ServicePageShell } from "@/components/services/service-page";
import { GoogleAdGrantsHero } from "@/components/services/google-ad-grants/hero";
import { GoogleAdGrantsWhy } from "@/components/services/google-ad-grants/why";
import { GoogleAdGrantsDeliverables } from "@/components/services/google-ad-grants/deliverables";
import { GoogleAdGrantsFaq } from "@/components/services/google-ad-grants/faq";
import { GoogleAdGrantsClosing } from "@/components/services/google-ad-grants/closing";

export const metadata: Metadata = {
  title: "Google Ad Grants",
  description:
    "Google Ad Grants setup and ongoing management for your charity. Discuss programme readiness, Search campaigns, website needs, tracking and reporting with Valinor Systems.",
  alternates: { canonical: "/google-ad-grants" },
};

export default function GoogleAdGrantsPage() {
  return (
    <ServicePageShell>
      <GoogleAdGrantsHero />
      <GoogleAdGrantsWhy />
      <GoogleAdGrantsDeliverables />
      <GoogleAdGrantsFaq />
      <GoogleAdGrantsClosing />
    </ServicePageShell>
  );
}
