import { ServiceHero } from "@/components/services/service-page";

export function GoogleAdsHero() {
  return (
    <ServiceHero
      id="google-ads-title"
      lines={["Reach people looking", "for your services."]}
      description="Focused Google Search campaigns, useful landing pages and clear results reviews."
      next="#why-google-ads"
    />
  );
}
