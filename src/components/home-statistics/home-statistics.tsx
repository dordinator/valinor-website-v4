import { bodyFont } from "@/components/home-hero/fonts";
import styles from "./home-statistics.module.css";

const findings = [
  {
    value: "54%",
    theme: "website",
    title: "Your website still matters.",
    caption: "of consumers would check a business’s website after positive reviews",
    explanation: "54% of respondents said they would check a business’s website after reading positive reviews.",
    source: "BrightLocal · Local Consumer Review Survey 2026",
    scope: "Survey of 1,002 US adults",
    href: "https://www.brightlocal.com/research/local-consumer-review-survey/",
  },
  {
    value: "10×",
    theme: "search",
    title: "Search position makes a difference.",
    caption: "More likely to be clicked: Google result #1 versus #10",
    explanation: "Google’s first organic result was ten times more likely to receive a click than the tenth in Backlinko’s study.",
    source: "Backlinko · Organic click-through-rate study",
    scope: "4 million search results · historical benchmark",
    href: "https://backlinko.com/google-ctr-stats",
  },
  {
    value: "6% → 45%",
    theme: "ai",
    title: "Discovery is changing.",
    caption: "Consumers using AI for local recommendations, 2025–26",
    explanation: "Use of AI for local business recommendations rose from 6% to 45% across BrightLocal’s 2025 and 2026 surveys.",
    source: "BrightLocal · AI and local recommendations",
    scope: "US consumer surveys · 2025–2026",
    href: "https://www.brightlocal.com/research/lcrs-ai-trust/",
  },
] as const;

/** Third-party research; full wording and sample scope remain available with each source. */
export function HomeStatistics() {
  return <section id="why-it-matters" aria-labelledby="home-statistics-title" className={`${styles.section} ${bodyFont.variable}`}>
    <div className={styles.inner}>
      <h2 id="home-statistics-title">Why your online presence matters.</h2>
      <div className={styles.findings}>
        {findings.map(finding => <article key={finding.theme} className={`${styles.finding} ${styles[finding.theme]}`}>
          <p className={styles.value}>{finding.value}</p>
          <p className={styles.caption}>{finding.caption}</p>
          <details className={styles.source}>
            <summary>Source &amp; context<span className="sr-only"> for {finding.value}: {finding.caption}</span></summary>
            <div className={styles.context}>
              <h3>{finding.title}</h3>
              <p>{finding.explanation}</p>
              <a href={finding.href} target="_blank" rel="noopener noreferrer">{finding.source}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
              <span>{finding.scope}</span>
            </div>
          </details>
        </article>)}
      </div>
    </div>
  </section>;
}
