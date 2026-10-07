import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettings } from "./cookie-settings";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy and cookies",
  description:
    "How Valinor Systems handles personal data and cookies: what the site stores, why, and how to withdraw consent.",
  alternates: { canonical: "/privacy" },
};

/*
 * PLACEHOLDERS — Harry to confirm before this is treated as final. Each one
 * is a statement about the business that only he can make, and a privacy
 * notice that guesses at them is worse than none. Search this file for
 * "TO CONFIRM".
 *
 *   1. Registered company number and registered office address.
 *   2. Whether Valinor is registered with the ICO (a data controller running
 *      analytics and holding client data almost certainly needs to be — it
 *      is a £52/year tier-one fee) and, if so, the registration number.
 *   3. Retention periods: enquiry emails, portal tickets, portal accounts
 *      after a client leaves. The periods below are conservative guesses.
 *   4. The processor list. Netlify, Google, Resend and Cloudflare are read
 *      off the codebase and DNS; confirm nothing else touches visitor data.
 */
const LAST_UPDATED = "23 September 2026";

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <p className={styles.brand}>Valinor Systems</p>
      <h1 className={styles.title}>Privacy and cookies</h1>
      <p className={styles.updated}>Last updated {LAST_UPDATED}</p>

      <p>
        This page covers what happens to your information when you visit
        valinorsystems.co.uk, send us an enquiry, or use the client portal.
        Valinor Systems Ltd is the data controller. We are a web design and
        SEO studio based in Hertfordshire.
      </p>
      <p>
        Company number: <strong>TO CONFIRM</strong>. Registered office:{" "}
        <strong>TO CONFIRM</strong>. ICO registration:{" "}
        <strong>TO CONFIRM</strong>. You can reach us about anything on this
        page through the <Link href="/contact">contact page</Link>.
      </p>

      <h2>Cookies and similar storage</h2>
      <p>
        Cookies that are strictly necessary to deliver the site are set
        without asking, because the site cannot work without them. Everything
        else waits for your consent, and you can change your mind at any time
        using the controls at the bottom of this page.
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Lasts</th>
              <th>Needs consent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>_ga</code>
              </td>
              <td>
                Google Analytics. Distinguishes one visitor from another so we
                can count how many people read a page.
              </td>
              <td>2 years</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>
                <code>_ga_S61KELM6GL</code>
              </td>
              <td>
                Google Analytics. Keeps the state of your current visit so a
                single session is not counted several times over.
              </td>
              <td>2 years</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>
                <code>valinor.cookie-consent</code>
              </td>
              <td>
                Remembers the choice you made on the cookie banner. Stored in
                your browser, never sent to us.
              </td>
              <td>Until cleared</td>
              <td>No — strictly necessary</td>
            </tr>
            <tr>
              <td>Portal session</td>
              <td>
                Keeps you signed in to the client portal. Set only after you
                log in, never on the public site.
              </td>
              <td>The session</td>
              <td>No — strictly necessary</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        We do not use advertising or cross-site tracking cookies on this site,
        and we do not sell anyone&rsquo;s data. Until you accept, Google
        Analytics runs in a mode that sets no cookies and cannot identify you
        between visits.
      </p>

      <h2>Information you give us</h2>
      <ul>
        <li>
          <strong>Enquiries.</strong> The contact form takes your name, email
          address and message so we can reply. The lawful basis is legitimate
          interest — you asked us to get in touch. TO CONFIRM: we keep
          enquiries for 24 months, then delete them.
        </li>
        <li>
          <strong>Client portal.</strong> Clients have an account holding
          their name, email address, the tickets they raise and any files
          attached to them. The lawful basis is performance of our contract
          with you. TO CONFIRM: accounts and their tickets are deleted 12
          months after the engagement ends.
        </li>
        <li>
          <strong>Analytics.</strong> If you accept cookies, Google Analytics
          records the pages you visit, roughly where in the world you are, and
          how you arrived. The lawful basis is consent. Data is retained for
          14 months.
        </li>
      </ul>

      <h2>Who else handles it</h2>
      <p>
        We use a small number of suppliers who process data on our behalf,
        under contract and only on our instructions.
      </p>
      <ul>
        <li>
          <strong>Netlify</strong> — hosting. Serves the site and keeps server
          logs, which include IP addresses, for a short period.
        </li>
        <li>
          <strong>Google (Analytics)</strong> — the analytics described above,
          only with your consent.
        </li>
        <li>
          <strong>Resend</strong> — sends the emails the portal and contact
          form generate.
        </li>
        <li>
          <strong>Cloudflare</strong> — DNS and email routing.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask us for a copy of what we hold about you, ask
        us to correct or delete it, object to how we use it, or ask us to
        restrict it. Where we rely on consent you can withdraw it at any time,
        and doing so is as easy as giving it. Ask through the{" "}
        <Link href="/contact">contact page</Link> and we will respond within
        one month.
      </p>
      <p>
        If you are unhappy with how we have handled your information you can
        complain to the Information Commissioner&rsquo;s Office at{" "}
        <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk</a> or on
        0303 123 1113.
      </p>

      <h2>Your cookie choices</h2>
      <CookieSettings />
    </main>
  );
}
