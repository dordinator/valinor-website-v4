import Link from "next/link";
import { ActionLink, PageIntro, Section, WireframePage } from "@/components/wireframe/wireframe";
import styles from "./web-design-wireframe.module.css";

const projects = [
  ["UniFluent", "https://unifluent.co.uk/", "Emesord product"],
  ["NJH Sports Therapy and Pilates", "https://www.njhsportstherapy.co.uk/", "Independent practice"],
  ["Canadian Citizenship Hub", "https://www.canadiancitizenshiphub.com/", "Specialist service"],
];
export default function WebDesignWireframe() {
  return <WireframePage>
    <PageIntro title="A website built around your business." price={<><strong>Around £3,000</strong> · Separately quoted to scope.</>}>
      <p>Clear content, considered design and a straightforward next step. Standalone or alongside SEO.</p>
    </PageIntro>
    <Section id="project" title="The essentials, considered together.">
      <div className={styles.inclusions}><span>Structure and copy</span><span>Responsive design and development</span><span>Required functions and migration</span></div>
      <p>Agree the plan, approve the work and launch.</p>
      <Link className={styles.textLink} href="/working-together#options">Website and SEO payment options ↗</Link>
    </Section>
    <Section id="work" title="Selected websites." tone="dark">
      <div className={styles.projects}>{projects.map(([name, href, context]) => <a className={styles.project} key={name} href={href} target="_blank" rel="noopener noreferrer">
        <div className={styles.imageSlot} aria-hidden="true">Project image to select</div>
        <span className={styles.projectName}>{name} ↗</span><span className={styles.context}>{context}</span><span className="sr-only"> — external website, opens in a new tab</span>
      </a>)}</div>
    </Section>
    <Section id="start" title="What should your website do?">
      <p>Bring a brief, your current site or simply what needs to change.</p>
      <ActionLink>Book a call ↗</ActionLink>
      <p className={styles.small}>Standalone care is quoted separately. <Link href="/working-together#ownership">Managed-site and ownership conditions ↗</Link></p>
    </Section>
  </WireframePage>;
}
