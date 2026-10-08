import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeHeader } from "@/components/home-hero/home-hero";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { SeoContent } from "@/components/seo/seo-content";
import { JsonLd } from "@/components/seo/structured-data";
import { seoFaqs } from "@/components/seo/seo-faqs";
import { pageGraph, serviceSchema } from "@/lib/schema";
import styles from "@/components/seo/seo-content.module.css";

const SEO_DESCRIPTION = "SEO and AI search from Valinor Systems: useful content, technical fixes, links and website improvements that help suitable customers find your business.";

const schema = pageGraph(
  { name: "SEO & AI search", description: SEO_DESCRIPTION, path: "/seo", faqs: seoFaqs },
  serviceSchema({ name: "SEO and AI search", serviceType: "Search engine optimisation", description: SEO_DESCRIPTION, path: "/seo", monthlyPrice: 995 }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "SEO & AI search", description: SEO_DESCRIPTION, path: "/seo" }),
};

export default function SeoPage() {
  return <div className={`${styles.page} ${headingFont.variable} ${bodyFont.variable}`} data-fluid-page>
    <JsonLd data={schema} />
    <FluidBackground fullPage />
    <HomeHeader overHero />
    <SeoContent />
    <SiteFooter />
  </div>;
}
