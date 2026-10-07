# Valinor Systems website v4

A minimal website wireframe: Home, SEO, Web Design, Google Ads, Google Ad Grants, Options & pricing, and Contact. This is a working structure and visual direction, not a finished public launch.

The homepage uses a navy animated background, a clean silver Book a call button and a demo portal preview. The preview starts beneath the hero and grows by about 10vw and 10vh as you scroll. Reduced motion keeps it static.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3217. Check the production build, TypeScript and lint with `npm run check`.

The contact booking interface is a local wireframe; it does not submit information or send email. Client portal links redirect to the existing live portal. The portal pictured in the hero is fictional demo UI with no connection to client accounts.

This repository contains only the public website and its referenced assets. CRM, authentication, private portal, database, email workers, backup workflows and environment files stay in the original private project. Search indexing is disabled for this unfinished wireframe. Pricing, proposed scope, scheduling and the privacy notice still need final approval before launch.

The animated background uses @paper-design/shaders; notices and licence are in `public/licenses`.
