import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import GrantsWireframe from "@/components/wireframe/pages/grants-wireframe";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";

const DESCRIPTION = "Setup and ongoing campaign support for eligible UK charities using the Google Ad Grants programme.";

const schema = pageGraph(
  { name: "Google Ad Grants", description: DESCRIPTION, path: "/google-ad-grants" },
  serviceSchema({ name: "Google Ad Grants", serviceType: "Google Ad Grants management", description: DESCRIPTION, path: "/google-ad-grants" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Google Ad Grants", description: DESCRIPTION, path: "/google-ad-grants" }),
};

export default function GoogleAdGrantsPage() {
  return <><JsonLd data={schema} /><GrantsWireframe /></>;
}
