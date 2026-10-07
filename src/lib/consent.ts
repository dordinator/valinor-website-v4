/**
 * Where the visitor's cookie choice lives, and how the two components that
 * care about it (the banner and the analytics tag) stay in step.
 *
 * The choice itself is kept in localStorage rather than a cookie. Storing a
 * preference on the visitor's device is "strictly necessary" under PECR
 * either way, so neither needs consent — but localStorage keeps it off every
 * HTTP request, which matters on a site fronted by Netlify's cache: a cookie
 * here would vary responses and cost us static hits for nothing.
 */

const STORAGE_KEY = "valinor.cookie-consent.v1";
const CHANGE_EVENT = "valinor:cookie-consent";

export type ConsentChoice = "granted" | "denied";

/** null means the visitor has not answered yet — the banner is waiting. */
export type ConsentState = ConsentChoice | null;

/**
 * Every read and write is wrapped: localStorage throws outright in Safari's
 * private mode and when a visitor has blocked site data. A visitor we cannot
 * remember is a visitor who has not consented, which is the safe answer.
 */
function read(): ConsentState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Consent Mode stops gtag writing NEW cookies, but it does not clear ones
 * already on the device. Withdrawing has to actually take the `_ga` pair
 * away, or "declined" would leave the visitor identified for another two
 * years. Deleting needs the same path and domain the tag wrote with, and GA
 * sets its cookies on the registrable domain, so we clear both spellings.
 */
function deleteAnalyticsCookies() {
  const names = document.cookie
    .split("; ")
    .map((pair) => pair.split("=")[0])
    .filter((name) => name.startsWith("_ga"));
  const host = window.location.hostname;
  for (const name of names) {
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; path=/${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}

export function setConsent(choice: ConsentChoice) {
  if (choice === "denied") deleteAnalyticsCookies();
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Unwritable storage is not a reason to ignore the click: the event
    // still fires, so the choice holds for this page view and the banner
    // closes. It simply will not be remembered on the next visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Reopens the banner from the "Cookie settings" link on /privacy. */
export function clearConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // As above.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* --- the useSyncExternalStore contract ------------------------------- */

export function subscribeToConsent(onChange: () => void) {
  // The custom event covers this tab; "storage" covers the site open in a
  // second tab, so answering the banner once settles both.
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export const getConsentSnapshot = read;

/**
 * On the server nobody has consented — and this is what keeps the root
 * layout statically rendered, since the alternative is reading the choice
 * per request. The client corrects it immediately after hydration.
 */
export const getConsentServerSnapshot = (): ConsentState => null;
