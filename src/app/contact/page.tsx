import type { Metadata } from "next";
import { ContactWireframe } from "@/components/wireframe/pages/contact-wireframe";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Valinor Systems. Tell us what you want to build and we will shape the clearest route forward.",
  alternates: { canonical: "https://valinorsystems.co.uk/contact" },
};

export default function ContactPage() {
  return <ContactWireframe />;
}
