import { ServiceHero } from "@/components/services/service-page";

export function WebDesignHero() {
  return (
    <ServiceHero
      id="web-design-title"
      lines={["A website built around", "your business."]}
      description="Clear content, considered design and a straightforward next step. Standalone or alongside SEO."
      next="#why-web-design"
    />
  );
}
