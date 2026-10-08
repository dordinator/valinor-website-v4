"use client";

import { useState, type FormEvent } from "react";
import styles from "./contact-wireframe.module.css";

export function ContactBookingPreview() {
  const [preview, setPreview] = useState<{ name: string; email: string; website: string; context: string } | null>(null);

  function showPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreview({
      name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""),
      website: String(data.get("website") ?? ""), context: String(data.get("context") ?? ""),
    });
  }

  return (
    <details className={styles.draft}>
      <summary>Preview request details · local only</summary>
      <p className={styles.small}>Local preview only. Nothing is sent or saved; details clear on reload.</p>
      <form onSubmit={showPreview}>
        <div className={styles.fieldPair}>
          <label htmlFor="booking-name">Name<input id="booking-name" name="name" autoComplete="name" required /></label>
          <label htmlFor="booking-email">Email<input id="booking-email" name="email" type="email" autoComplete="email" required /></label>
        </div>
        <label htmlFor="booking-website">Website <span>(optional)</span><input id="booking-website" name="website" type="text" inputMode="url" autoComplete="url" /></label>
        <label htmlFor="booking-context">What would you like to discuss? <span>(optional)</span><textarea id="booking-context" name="context" rows={3} /></label>
        <button type="submit" className={styles.button}>Preview booking request</button>
      </form>
      <div aria-live="polite" aria-atomic="true">
        {preview && <div className={styles.summary}>
          <h4>Request preview · no appointment booked</h4>
          <dl>
            <div><dt>Name</dt><dd>{preview.name}</dd></div>
            <div><dt>Email</dt><dd>{preview.email}</dd></div>
            <div><dt>Website</dt><dd>{preview.website || "Not supplied"}</dd></div>
            <div><dt>Context</dt><dd>{preview.context || "We can work this out in conversation."}</dd></div>
            <div><dt>Appointment</dt><dd>No date or time selected. Scheduler not connected.</dd></div>
          </dl>
        </div>}
      </div>
    </details>
  );
}
