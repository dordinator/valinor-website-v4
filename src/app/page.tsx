import type { Metadata } from "next";
import { HomeHero, PortalPreview } from "@/components/home-hero/home-hero";
import { ScrollPreview } from "@/components/home-hero/scroll-preview";
import { HomeWireframe } from "@/components/wireframe/pages/home-wireframe";
import { StructuredData } from "@/components/seo/structured-data";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeStatistics } from "@/components/home-statistics/home-statistics";
import styles from "./home.module.css";

export const metadata: Metadata = {
  // Inherits the root default title: "Valinor Systems | Web Design, SEO and Google Ads".
  description:
    "Valinor Systems is a UK web design and SEO studio. We build fast, high-converting websites and run the Google Ads that grow them.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className={styles.page} data-fluid-page>
      <StructuredData />
      <FluidBackground fullPage />
      <HomeHero showPreview={false} sharedBackground viewport scrollPreview />
      <ScrollPreview><PortalPreview standalone /></ScrollPreview>
      <HomeStatistics />
      <HomeWireframe />
    </div>
  );
}
