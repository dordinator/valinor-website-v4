import Link from "next/link";
import { ServiceFaq } from "@/components/services/service-page";

const items = [
  {
    id: "web-design-existing-site",
    question: "Do I need a completely new website?",
    answer: (
      <p>
        No. We can improve your existing website or build a new one. We assess
        what you already have and agree the work that makes sense for your
        business.
      </p>
    ),
  },
  {
    id: "web-design-scope-and-cost",
    question: "What’s included, and what does it cost?",
    answer: (
      <>
        <p>
          We agree the structure, copy, responsive design and development, plus
          any required functions or migration, in your scope. A standalone build
          is typically around £3,000, subject to scope and a separate quote, with
          50% due at kickoff and 50% on completion.
        </p>
        <p>
          <Link href="/working-together">See the full working arrangements.</Link>
        </p>
      </>
    ),
  },
  {
    id: "web-design-process",
    question: "How does the project work?",
    answer: (
      <p>
        We agree a plan, get your approval, then build, test and launch. You
        provide your business knowledge, access and approvals; we handle the
        agreed content, design and implementation. Timing depends on the scope
        and when the inputs and approvals are ready.
      </p>
    ),
  },
  {
    id: "web-design-with-seo",
    question: "Can web design be part of an SEO package?",
    answer: (
      <>
        <p>
          Yes. The SEO minimum term is three months from kickoff, including
          website build time. Pay your first six months of SEO before kickoff and
          we waive the agreed website build fee. With monthly SEO payment, the
          build is quoted separately.
        </p>
        <p>
          See the <Link href="/working-together#payments">website and SEO payment terms</Link>.
        </p>
      </>
    ),
  },
  {
    id: "web-design-ownership-and-care",
    question: "How do ownership and ongoing care work?",
    answer: (
      <>
        <p>
          During a managed engagement, Valinor owns and manages the website.
          Transfer is available under your service agreement; an early buyout
          fee may apply. Paying six months of SEO upfront waives the agreed build
          fee but does not transfer ownership. Standalone care is quoted
          separately.
        </p>
        <p>
          <Link href="/working-together#transfer">Read the full transfer terms.</Link>
        </p>
      </>
    ),
  },
] as const;

export function WebDesignFaq() {
  return (
    <ServiceFaq
      id="web-design-faq"
      title="A few useful answers."
      items={items}
    />
  );
}
