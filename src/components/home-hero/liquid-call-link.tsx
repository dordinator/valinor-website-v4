import Link from "next/link";
import styles from "./liquid-call-link.module.css";

/** Shared call action with a restrained frosted finish; no liquid fill animation. */
export function LiquidCallLink({ href = "/contact#book" }: { href?: string }) {
  return <Link href={href} className={styles.button}>
    <span className={styles.label}>Book a call <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></span>
  </Link>;
}
