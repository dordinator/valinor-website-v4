import type { Metadata } from "next";
import { bodyFont } from "@/components/home-hero/fonts";
import { ScrollLab } from "@/components/scroll-lab/scroll-lab";

export const metadata: Metadata = {
  title: "Scroll studies",
  description: "Interactive motion studies for the Valinor website.",
  robots: { index: false, follow: false },
};

export default async function ScrollLabPage({ searchParams }: {
  searchParams: Promise<{ effect?: string | string[] }>;
}) {
  const { effect } = await searchParams;
  return <div className={bodyFont.variable}><ScrollLab initialEffect={typeof effect === "string" ? effect : "expand"} /></div>;
}
