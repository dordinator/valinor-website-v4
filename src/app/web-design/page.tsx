import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import WebDesignWireframe from "@/components/wireframe/pages/web-design-wireframe";
import { JsonLd } from "@/components/seo/structured-data";
import { pageGraph, serviceSchema } from "@/lib/schema";

const DESCRIPTION = "Clear, professional websites designed and built around your business and the way your customers enquire or book.";

const schema = pageGraph(
  { name: "Web design", description: DESCRIPTION, path: "/web-design" },
  serviceSchema({ name: "Web design", serviceType: "Web design", description: DESCRIPTION, path: "/web-design" }),
);

export const metadata: Metadata = {
  ...pageMetadata({ title: "Web design", description: DESCRIPTION, path: "/web-design" }),
};

export default function WebDesignPage() {
  return <><JsonLd data={schema} /><WebDesignWireframe /></>;
}
