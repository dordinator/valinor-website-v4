import { bodyFont } from "@/components/home-hero/fonts";
import styles from "./home-ai-tools.module.css";

/** Valinor's own AI search tooling. The claim is the owner's; nothing here describes features beyond it. */
export function HomeAiTools() {
  return <section id="ai-search-tools" aria-labelledby="home-ai-tools-title" className={`${styles.section} ${bodyFont.variable}`}>
    <div className={styles.statement}>
      <h2 id="home-ai-tools-title">We have developed in-house proprietary tools for AI search evaluation <span>allowing for cutting edge optimisations for Google AI Overviews and generative AI.</span></h2>
    </div>
  </section>;
}
