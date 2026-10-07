# Valinor Systems website v4

A minimal website wireframe: Home, SEO, Web Design, Google Ads, Google Ad Grants, Options & pricing, and Contact. This is a working structure and visual direction, not a finished public launch.

The homepage uses a navy animated background, a clean silver Book a call button and a demo portal preview. The preview starts beneath the hero and grows by about 10vw and 10vh as you scroll. Reduced motion keeps it static.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3217. Check the production build, TypeScript and lint with `npm run check`.

The contact booking interface is a local wireframe; it does not submit information or send email. Client portal links open a minimal `/login` page: the existing brand mark, Geist typography and one Continue with email action. That action opens `https://valinorsystems.co.uk/login`; first-time access opens `https://valinorsystems.co.uk/access`. Authentication, recovery and invitations remain in that existing live portal. Direct visits to the entry screen do not collect credentials or load analytics/cookie prompts. The portal pictured in the hero is fictional demo UI with no connection to client accounts.

Before moving this public site onto the live `valinorsystems.co.uk` domain, give the private portal distinct reachable login/access URLs and update `portalLoginUrl` and `portalAccessUrl` in `src/app/login/page.tsx`; otherwise the handoff would return to this entry page. This repository does not migrate the private authentication backend.

This repository contains only the public website and its referenced assets. CRM, authentication, private portal, database, email workers, backup workflows and environment files stay in the original private project. Search indexing is disabled for this unfinished wireframe. Pricing, proposed scope, scheduling and the privacy notice still need final approval before launch.

The animated background uses @paper-design/shaders; notices and licence are in `public/licenses`.
