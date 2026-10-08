import { ServiceHero } from "../service-page";

export function GoogleAdGrantsHero() {
  return (
    <ServiceHero
      id="google-ad-grants-title"
      lines={["Google Ad Grants", "for your charity."]}
      description="Search advertising can help people find your cause. Valinor offers setup and ongoing-management help."
      next="#why-google-ad-grants"
    />
  );
}
