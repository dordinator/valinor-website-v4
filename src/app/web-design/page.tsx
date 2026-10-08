import type { Metadata } from "next";
import { ServicePageShell } from "@/components/services/service-page";
import { WebDesignHero } from "@/components/services/web-design/hero";
import { WebDesignWhy } from "@/components/services/web-design/why";
import { WebDesignDeliverables } from "@/components/services/web-design/deliverables";
import { WebDesignFaq } from "@/components/services/web-design/faq";
import { WebDesignClosing } from "@/components/services/web-design/closing";

export const metadata: Metadata = {
  title: "Web design",
  description: "Clear content, considered design and a straightforward next step. Websites built around your business, standalone or alongside SEO.",
  alternates: { canonical: "/web-design" },
};

export default function WebDesignPage() {
  return (
    <ServicePageShell>
      <WebDesignHero />
      <WebDesignWhy />
      <WebDesignDeliverables />
      <WebDesignFaq />
      <WebDesignClosing />
    </ServicePageShell>
  );
}
