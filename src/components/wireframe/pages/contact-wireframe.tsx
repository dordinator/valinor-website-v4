import { PageIntro, Placeholder, Section, WireframePage } from "@/components/wireframe/wireframe";
import { ContactBookingPreview, ContactEmail } from "./contact-booking-preview";
import styles from "./contact-wireframe.module.css";

export function ContactWireframe() {
  return (
    <WireframePage>
      <PageIntro title="Let’s talk about your business.">
        <p>Start with your website, an idea or something that needs attention. You don’t need to know exactly what you need.</p>
      </PageIntro>

      <Section id="book" title="Book a call">
        <span id="contact" className={styles.anchorAlias} aria-hidden="true" />
        <div className={styles.booking}>
          <p>A conversation about your business and a useful next step. No package or budget choice required.</p>
          <div className={styles.scheduler}>
            <Placeholder label="Scheduler preview · not connected">
              <p>Choose a date and time here once booking is connected. No appointments can be booked yet.</p>
            </Placeholder>
          </div>
          <ContactBookingPreview />
        </div>
      </Section>

      <Section id="email" title="Prefer email?" tone="dark">
        <ContactEmail />
        <p className={styles.clientLink}>Already a client? <a className={styles.textLink} href="/login">Open your portal ↗</a>. For access help, email us; never include your password.</p>
        <details className={styles.review}>
          <summary>Setup decisions for review</summary>
          <p>Confirm the booking provider, host, duration, format, timezone display, response expectations and this public email address before launch.</p>
          <p>Live confirmations need date/time details and reschedule/cancel links. No slots or a failed booking should offer email. Follow-up automation remains parked.</p>
          <a className={styles.textLink} href="/privacy">Privacy &amp; cookies ↗</a>
        </details>
      </Section>
    </WireframePage>
  );
}
