# Valinor Systems website v4

The public website: Home, SEO, Web Design, Google Ads, Google Ad Grants, Pricing, Contact, Privacy, a client-portal entry page and a 404 page. Home, SEO, Pricing, Contact and Privacy are built out. Web Design, Google Ads and Google Ad Grants are still wireframes.

The look is a navy animated background, Montserrat headings and DM Sans text, a silver Book a call button and a liquid-glass Book a call button in the navigation. Reduced motion keeps everything static.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3217. Check the production build, TypeScript and lint with `npm run check`.

## Search and indexing

- `robots.txt` is open to all crawlers and points at `sitemap.xml`.
- The sitemap lists Home, SEO, Pricing, Contact and Privacy.
- Web Design, Google Ads and Google Ad Grants are indexed and in the sitemap (owner decision), although their content is still wireframe.
- Every page has its own title, description, canonical URL, share tags and JSON-LD (`src/lib/metadata.ts`, `src/lib/schema.ts`). FAQ schema is built from the same text the page shows.
- The share image is generated in `src/app/opengraph-image.tsx`.

## Cookies and analytics

A small card asks about analytics cookies, with Accept, Decline and a per-category choice. Google Analytics (`G-S61KELM6GL`) is not loaded at all until a visitor accepts, and only on `valinorsystems.co.uk`, so it cannot be seen firing on localhost or preview addresses. Withdrawing consent on the Privacy page stops it and clears its cookies.

## Contact and the client portal

Book a call links go to Calendly (`src/lib/booking.ts`). The Contact page also shows hello@valinorsystems.co.uk. The site has no form and stores nothing.

Client portal links open a minimal `/login` page whose button goes to `https://valinorsystems.co.uk/login`; first-time access goes to `https://valinorsystems.co.uk/access`. Authentication, recovery and invitations stay in that existing private portal. The portal pictured in the hero is fictional demo UI with no connection to client accounts.

Before moving this site onto the live `valinorsystems.co.uk` domain, give the private portal its own reachable login and access URLs and update `portalLoginUrl` and `portalAccessUrl` in `src/app/login/page.tsx`; otherwise the link would return to this entry page.

## Still to confirm before launch

- The three wireframe pages.
- Pricing wording marked "Proposed" and "to confirm" on the Pricing and SEO pages.
- The Privacy page's host name (Vercel) and retention wording.

This repository contains only the public website and its assets. CRM, authentication, the private portal, database, email workers and environment files stay in the original private project.

The animated background uses @paper-design/shaders; notices and licence are in `public/licenses`.
