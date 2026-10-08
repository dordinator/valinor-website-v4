import { PageIntro, Placeholder, Section, WireframePage } from "@/components/wireframe/wireframe";
import { ContactBookingPreview } from "./contact-booking-preview";
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

    </WireframePage>
  );
}
