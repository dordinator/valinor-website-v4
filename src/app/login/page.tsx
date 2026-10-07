import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FluidBackground } from "@/components/home-hero/fluid-background";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Client login",
  robots: { index: false, follow: false },
};

// Accounts and authentication remain in the existing private portal.
const portalLoginUrl = "https://valinorsystems.co.uk/login";
const portalAccessUrl = "https://valinorsystems.co.uk/access";

export default function ClientLoginPage() {
  return (
    <main className={styles.page} data-fluid-page>
      <FluidBackground fullPage />
      <Link href="/" className={styles.back}>
        <span aria-hidden="true">←</span> Back to website
      </Link>

      <section className={styles.login} aria-labelledby="login-title">
        <Image
          className={styles.mark}
          src="/assets/brand/valinor-mark-transparent.png"
          alt="Valinor Systems"
          width={107}
          height={94}
          sizes="56px"
          preload
        />
        <h1 id="login-title">Log in to Valinor</h1>
        <a className={styles.continue} href={portalLoginUrl}>
          Continue with email
        </a>
        <p className={styles.help}>
          First time here? <a href={portalAccessUrl}>Get your link</a>
        </p>
      </section>
    </main>
  );
}
