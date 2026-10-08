import { organizationGraph } from "@/lib/schema";

/** Inline JSON-LD. The payload is always a static literal; the < escape is Next's own guard. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function StructuredData() {
  return <JsonLd data={organizationGraph} />;
}
