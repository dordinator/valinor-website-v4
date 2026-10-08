import Image from "next/image";
import { ServiceWhyStory } from "../service-page";
import styles from "./why.module.css";

type WebsitePreviewProps = {
  name: string;
  context: string;
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

function WebsitePreview({ name, context, href, src, alt, width, height }: WebsitePreviewProps) {
  return (
    <figure className={styles.preview}>
      <Image
        className={styles.image}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 1100px) 90vw, 65vw"
      />
      <figcaption className={styles.caption}>
        <div className={styles.project}>
          <p className={styles.name}>{name}</p>
          <p className={styles.context}>{context}</p>
        </div>
        <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
          <span>View website <span aria-hidden="true">↗</span></span>
          <span className={styles.newTab}>Opens in a new tab</span>
        </a>
      </figcaption>
    </figure>
  );
}

const chapters = [
  {
    id: "clear-structure",
    statement: "Make your business easy to understand.",
    title: "Clear content. Clear structure.",
    description: "Organise your services, answer practical questions and help people find what matters.",
    visual: (
      <WebsitePreview
        name="Canadian Citizenship Hub"
        context="A specialist Canadian citizenship service."
        href="https://www.canadiancitizenshiphub.com/"
        src="/assets/studio-previews/canadian-citizenship-hub-hero.png"
        alt="Website homepage explaining Canadian citizenship by descent, with navigation for pathways, eligibility, the process and FAQs."
        width={1280}
        height={720}
      />
    ),
  },
  {
    id: "considered-design",
    statement: "A website that feels like your business.",
    title: "Design with a purpose.",
    description: "Shape the layout, imagery and detail around what you offer and who you want to reach.",
    visual: (
      <WebsitePreview
        name="UniFluent"
        context="An Emesord language-learning product."
        href="https://unifluent.co.uk/"
        src="/assets/studio-previews/unifluent-hero.png"
        alt="Product website showing the language-learning app on a phone alongside its download message."
        width={1440}
        height={900}
      />
    ),
  },
  {
    id: "simple-next-step",
    statement: "Make the next step feel simple.",
    title: "From interest to enquiry.",
    description: "Give visitors a clear route to ask a question, book a session or speak to your team.",
    visual: (
      <WebsitePreview
        name="NJH Sports Therapy and Pilates"
        context="An independent sports therapy and Pilates practice."
        href="https://www.njhsportstherapy.co.uk/"
        src="/assets/studio-previews/njh-sports-therapy-hero.png"
        alt="Practice homepage with a Book a session button and an Explore Pilates link beside a photograph of the studio."
        width={1280}
        height={720}
      />
    ),
  },
] as const;

export function WebDesignWhy() {
  return <ServiceWhyStory id="why-web-design" title="Why your website matters." chapters={chapters} />;
}
