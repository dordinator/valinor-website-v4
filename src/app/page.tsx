import type { Metadata } from "next";
import { HomeHero, PortalPreview } from "@/components/home-hero/home-hero";
import { ScrollPreview } from "@/components/home-hero/scroll-preview";
import { HomeWireframe } from "@/components/wireframe/pages/home-wireframe";
import { StructuredData } from "@/components/seo/structured-data";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import { HomeStatistics } from "@/components/home-statistics/home-statistics";
import { HomeAiTools } from "@/components/home-ai-tools/home-ai-tools";
import styles from "./home.module.css";

export const metadata: Metadata = {
  // Inherits the root default title and description.
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className={styles.page} data-fluid-page>
      <StructuredData />
      <FluidBackground fullPage />
      <HomeHero showPreview={false} sharedBackground viewport scrollPreview />
      <ScrollPreview><PortalPreview standalone /></ScrollPreview>
      <HomeAiTools />
      <HomeStatistics />
      <HomeWireframe />
    </div>
  );
}
