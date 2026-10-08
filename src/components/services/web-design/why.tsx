import { ServiceWhyStory } from "../service-page";
import { WebDesignExample } from "./website-example";
import styles from "./why.module.css";

const chapters = [
  {
    id: "clear-structure",
    statement: "Make your business easy to understand.",
    title: "Clear content. Clear structure.",
    description: "Organise your services, answer practical questions and help people find what matters.",
    visual: <WebDesignExample chapter="clarity" />,
  },
  {
    id: "considered-design",
    statement: "A website that feels like your business.",
    title: "Design with a purpose.",
    description: "Shape the layout, imagery and detail around what you offer and who you want to reach.",
    visual: <WebDesignExample chapter="design" />,
  },
  {
    id: "simple-next-step",
    statement: "Make the next step feel simple.",
    title: "From interest to enquiry.",
    description: "Give visitors a clear route to ask a question, book a session or speak to your team.",
    visual: <WebDesignExample chapter="mobile" />,
  },
] as const;

export function WebDesignWhy() {
  return <ServiceWhyStory id="why-web-design" title="Why your website matters." chapters={chapters} className={styles.story} />;
}
