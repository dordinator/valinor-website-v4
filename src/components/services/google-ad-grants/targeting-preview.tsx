"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./targeting-preview.module.css";

const goals = [
  { id: "volunteers", label: "Volunteers", keyword: "Volunteer", searches: "Local volunteering opportunities", query: (location: string) => `volunteer at a community kitchen in ${location}`, title: (location: string) => `at our ${location} community kitchen`, description: "Help prepare and serve meals. Explore local volunteer roles and find out how to get involved.", explanation: "A volunteering goal focuses the ad on people looking for local roles. Change the goal to focus on donations or access to services.", path: "volunteer" },
  { id: "donations", label: "Donations", keyword: "Donate", searches: "Ways to support a local charity", query: (location: string) => `donate to a community kitchen in ${location}`, title: (location: string) => `to support community meals in ${location}`, description: "Help your local kitchen provide meals. See how your donation can support the community.", explanation: "A donation goal focuses the ad on people looking to support a local cause. The message directs them to information about giving.", path: "donate" },
  { id: "services", label: "Access to services", keyword: "Find", searches: "Community meals and local support", query: (location: string) => `community meals in ${location}`, title: (location: string) => `community meals in ${location}`, description: "Find a welcoming place for a meal. Check opening times, where to visit and how to get support.", explanation: "A service goal focuses the ad on people looking for help. The message explains what is available and where they can find it.", path: "community-meals" },
] as const;
const locations = ["St Albans", "Harpenden", "Watford"] as const;

function GoalIcon({ goal }: { goal: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {goal === "volunteers" ? <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5" /></> : goal === "donations" ? <path d="M20 5c-2-2-6-2-8 1-2-3-6-3-8-1-3 3-1 7 8 15 9-8 11-12 8-15Z" /> : <><path d="M6 3h9l4 4v14H6ZM14 3v5h5M9 12h7M9 16h7" /></>}
  </svg>;
}

export function GrantsTargetingPreview() {
  const [active, setActive] = useState(0);
  const [location, setLocation] = useState<string>(locations[0]);
  const goal = goals[active];
  const id = useId();
  const scene = useRef<HTMLDivElement>(null);
  const keyword = useRef<HTMLElement>(null);
  const selected = useRef<HTMLLabelElement>(null);
  const [connection, setConnection] = useState({ width: 1, height: 1, path: "", x1: 0, y1: 0, x2: 0, y2: 0 });

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    let alive = true;
    const measure = () => {
      if (!alive || !keyword.current || !selected.current) return;
      const box = root.getBoundingClientRect(), word = keyword.current.getBoundingClientRect(), choice = selected.current.getBoundingClientRect();
      const x1 = word.right - box.left + 6, y1 = word.top - box.top - 8;
      const x2 = choice.left - box.left, y2 = choice.top - box.top + choice.height / 2;
      const bend = Math.max(30, (x2 - x1) * .6);
      setConnection({ width: box.width, height: box.height, path: `M ${x1} ${y1} C ${x1 + bend} ${y1 - 16}, ${x2 - 50} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 });
    };
    const observer = new ResizeObserver(measure);
    [root, keyword.current, selected.current].forEach(element => { if (element) observer.observe(element); });
    measure();
    void document.fonts.ready.then(measure);
    return () => { alive = false; observer.disconnect(); };
  }, [active, location]);

  return <div id="grants-campaign-focus" ref={scene} className={styles.scene} aria-label="Explore how a charity’s goals shape its search advertising">
    <div className={styles.previewColumn}>
      <p className={styles.exampleLabel}>Illustrative example · Fictional charity</p>
      <div id={`${id}-preview`} className={styles.search} role="group" aria-label="Illustrative Google search preview" aria-live="polite" aria-atomic="true">
        <p className={styles.google} aria-label="Google"><span aria-hidden="true"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span></p>
        <div className={styles.query}><span>{goal.query(location)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></div>
        <div className={styles.searchTabs} aria-hidden="true"><span>All</span><span>Images</span><span>Maps</span><span>More</span></div>
        <div className={styles.result}><p className={styles.sponsored}>Sponsored</p>
          <div className={styles.identity}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 18h24a12 12 0 0 1-24 0Z" fill="currentColor" /><path d="M16 15c-1-7 3-11 10-11-1 7-4 10-10 11ZM14 15C8 14 6 11 6 6c6 0 9 3 8 9Z" fill="#a4c4b4" /></svg><div>Example Community Kitchen<small>example.org/{goal.path}</small></div></div>
          <p className={styles.adTitle}><mark ref={keyword}>{goal.keyword}</mark>{" "}{goal.title(location)}</p>
          <p className={styles.description}>{goal.description}</p>
        </div>
      </div>
    </div>
    <div className={styles.controlsColumn}>
      <div className={styles.controls}>
        <p className={styles.controlLabel}>Campaign focus</p>
        <h3>What does your charity want to achieve?</h3>
        <p className={styles.controlIntro}>Choose a goal to shape the searches and ads you target.</p>
        <fieldset className={styles.goals}><legend className="sr-only">Your charity’s goal</legend>{goals.map((option, index) =>
          <label key={option.id} ref={active === index ? selected : undefined} className={styles.goal} data-selected={active === index || undefined}>
            <input type="radio" name={`${id}-goal`} value={option.id} checked={active === index} onChange={() => setActive(index)} aria-controls={`${id}-preview`} />
            <GoalIcon goal={option.id} /><span>{option.label}</span>
          </label>
        )}</fieldset>
        <label className={styles.locationLabel} htmlFor={`${id}-location`}>People in your area</label>
        <div className={styles.selectWrap}><select id={`${id}-location`} value={location} onChange={event => setLocation(event.target.value)} aria-controls={`${id}-preview`}>{locations.map(place => <option key={place}>{place}</option>)}</select><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg></div>
        <p className={styles.searchesLabel}>Searches to reach</p><p className={styles.searches}>{goal.searches}</p>
        <p className={styles.explanation}>{goal.explanation}</p>
      </div>
      <p className={styles.note}>Preview only · These are example settings.</p>
    </div>
    <svg className={styles.connection} viewBox={`0 0 ${connection.width} ${connection.height}`} aria-hidden="true" fill="none">
      <path d={connection.path} stroke="currentColor" strokeWidth="1.2" /><circle cx={connection.x1} cy={connection.y1} r="2.5" fill="currentColor" /><circle cx={connection.x2} cy={connection.y2} r="2.5" fill="currentColor" />
    </svg>
  </div>;
}

