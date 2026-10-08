"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./volunteer-enquiry.module.css";

const roles = [
  { title: "Kitchen volunteer", description: "Prepare ingredients and serve meals." },
  { title: "Meal serving", description: "Welcome visitors and help serve lunch." },
] as const;
const times = ["Saturday lunch", "Weekday mornings"] as const;

function CharityMark() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 18h24a12 12 0 0 1-24 0Z" fill="currentColor" /><path d="M16 15c-1-7 3-11 10-11-1 7-4 10-10 11ZM14 15C8 14 6 11 6 6c6 0 9 3 8 9Z" fill="#91ada3" /></svg>;
}
function DetailIcon({ calendar = false }: { calendar?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{calendar ? <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h2M15 14h2M7 17h2" /></> : <><path d="M5 3v7M2 3v4a3 3 0 0 0 6 0V3M5 10v11M17 3c-3 3-4 6-4 10h4M17 3v18" /></>}</svg>;
}
function Chevron() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>;
}

export function GrantsVolunteerEnquiry() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [availability, setAvailability] = useState<string>(times[0]);
  const [question, setQuestion] = useState("Can I visit before signing up?");
  const [prepared, setPrepared] = useState(false);
  const id = useId();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const roleField = useRef<HTMLSelectElement>(null);
  const [connection, setConnection] = useState({ width: 1, height: 1, path: "", x1: 0, y1: 0, x2: 0, y2: 0 });
  const role = roles[roleIndex];

  useEffect(() => {
    const scene = root.current;
    if (!scene) return;
    let alive = true;
    const measure = () => {
      if (!alive || !source.current || !form.current) return;
      const box = scene.getBoundingClientRect(), button = source.current.getBoundingClientRect(), enquiry = form.current.getBoundingClientRect();
      const x1 = button.right - box.left - 8, y1 = button.top - box.top + button.height / 2;
      const x2 = enquiry.left - box.left, y2 = enquiry.top - box.top + 32;
      const bend = Math.max(24, (x2 - x1) * .7);
      setConnection({ width: box.width, height: box.height, path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 });
    };
    const observer = new ResizeObserver(measure);
    [scene, source.current, form.current].forEach(element => { if (element) observer.observe(element); });
    measure();
    void document.fonts.ready.then(measure);
    return () => { alive = false; observer.disconnect(); };
  }, []);

  function chooseRole(value: string) {
    setRoleIndex(Number(value));
    setPrepared(false);
  }
  function askAboutRole() {
    roleField.current?.focus({ preventScroll: true });
    form.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "instant" : "smooth" });
  }
  function previewEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
  }

  return <div id="grants-volunteer-enquiry" className={styles.scene} aria-label="Illustrative journey from charity information to a volunteer enquiry">
    <div ref={root} className={styles.pair}>
      <div className={styles.websiteColumn}>
        <p className={styles.exampleLabel}>Illustrative example · Fictional charity</p>
        <div className={styles.website} role="group" aria-label="Example Community Kitchen volunteer page">
          <div className={styles.websiteNav}><CharityMark /><strong>Example Community Kitchen</strong><span aria-hidden="true">☰</span></div>
          <Image src="/assets/google-ad-grants/illustrative-community-kitchen.png" alt="Illustrative community kitchen with preparation counters, utensils and fresh vegetables" width={1536} height={1024} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 360px" className={styles.kitchenImage} />
          <div className={styles.websiteBody}>
            <h3>Volunteer with your community.</h3>
            <p className={styles.intro}>Kitchen and serving roles in St Albans.</p>
            <div className={styles.detail}><DetailIcon /><div><strong>What you’ll do</strong><p>{role.description}</p></div></div>
            <div className={styles.detail}><DetailIcon calendar /><div><strong>When you can help</strong><p>Weekday mornings or Saturday lunch.</p></div></div>
            <div className={styles.availableRole}><label htmlFor={`${id}-available-role`}>Available role</label><div className={styles.lightSelect}><select id={`${id}-available-role`} value={roleIndex} onChange={event => chooseRole(event.target.value)} aria-controls={`${id}-enquiry`}>{roles.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}</select><Chevron /></div></div>
            <button ref={source} type="button" className={styles.askButton} onClick={askAboutRole} aria-controls={`${id}-enquiry`}>Ask about this role <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
      <div className={styles.enquiryColumn}>
        <p className={styles.exampleLabel}>Volunteering enquiry</p>
        <form ref={form} id={`${id}-enquiry`} className={styles.enquiry} aria-labelledby={`${id}-enquiry-title`} onSubmit={previewEnquiry}>
          <h3 id={`${id}-enquiry-title`}>Tell us how you’d like to help.</h3>
          <label htmlFor={`${id}-role`}>Role</label><div className={styles.darkSelect}><select ref={roleField} id={`${id}-role`} value={roleIndex} onChange={event => chooseRole(event.target.value)}>{roles.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}</select><Chevron /></div>
          <label htmlFor={`${id}-availability`}>Availability</label><div className={styles.darkSelect}><select id={`${id}-availability`} value={availability} onChange={event => { setAvailability(event.target.value); setPrepared(false); }}>{times.map(time => <option key={time}>{time}</option>)}</select><Chevron /></div>
          <label htmlFor={`${id}-question`}>Your question</label><textarea id={`${id}-question`} rows={3} maxLength={2000} value={question} onChange={event => { setQuestion(event.target.value); setPrepared(false); }} />
          <button type="submit" className={styles.sendButton}>Send enquiry <span aria-hidden="true">→</span></button>
          <div role="status" aria-live="polite">{prepared && <p className={styles.status}>Example enquiry prepared: {role.title}, {availability.toLowerCase()}. Nothing has been sent.</p>}</div>
        </form>
        <p className={styles.note}>Illustrative journey · Nothing is submitted.</p>
      </div>
      <svg className={styles.connection} viewBox={`0 0 ${connection.width} ${connection.height}`} fill="none" aria-hidden="true"><path d={connection.path} stroke="currentColor" strokeWidth="1.2" /><circle cx={connection.x1} cy={connection.y1} r="3" fill="currentColor" /><circle cx={connection.x2} cy={connection.y2} r="3" fill="currentColor" /></svg>
    </div>
    <aside className={styles.explanation} aria-label="Why a clear next step matters"><p className={styles.explanationTitle}>A clear next step</p><p>Useful information helps someone choose a role. A short enquiry gives your charity the details to start a conversation.</p></aside>
  </div>;
}

