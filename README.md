# BLACK AMBRELLA

An independent creative universe shaping sound, nightlife and digital culture. The current flagship is a responsive, single-page experience built with React, TypeScript and Vite. Its visual system uses an original umbrella emblem, editorial typography, cinematic CSS artwork, reduced-motion support and keyboard-visible focus styles.

## Run locally

```sh
npm install
npm run dev
```

Build with `npm run build`; preview with `npm run preview`. `npm run typecheck` and `npm run lint` are also available.

## Current experience

- Cinematic home and manifesto
- UNDER THE UMBRELLA discovery rooms linking into Sound, After Dark, Collective, Archive and Objects
- Music, radio, event, artist, editorial and merchandise sections with honest empty states
- Collaboration and partnership pathways
- Editorial photo feature using the supplied BLACK AMBRELLA setup images
- Newsletter form with accessible validation and response messages
- SEO description, social metadata, robots and sitemap starter

All releases, events, contributors and products are intentionally presented as not yet announced. Abstract artwork is generated in CSS. No audio playback, event listing, artist roster, inventory, payment, live stream, or external social account is represented as active. The email field only reports success when the configured endpoint returns HTTP 2xx; without it, visitors are told that their address was not saved.

## Integrations before launch

Set `VITE_PUBLIC_FORMS_ENDPOINT` to an HTTPS server endpoint that accepts `POST` JSON `{ "email": "...", "source": "black-ambrella-newsletter" }`. The server must validate consent and email, apply abuse protection/rate limits, persist the request, and return 2xx only after saving it. Do not put credentials in `VITE_*` values; Vite exposes these to the browser.

Still to configure: production domain and canonical/social image; consent and privacy pages; newsletter backend and abuse protection; media hosting and licensed audio sources; content database/CMS and admin authentication; event/ticket provider; commerce inventory, fulfilment and payment provider; analytics with consent controls; official social accounts. Admin mutations are not enabled because no server or authentication service exists in this repository.

## Deployment

The static Vite build outputs to `dist/` and can be hosted on Cloudflare Pages or another static host. Connect the repository, use `npm install` (commit the generated `package-lock.json` for reproducible CI installs), `npm run build`, and `dist` as the output directory. Add only the public forms endpoint URL as a build-time environment variable if configured. Replace the example domain in `public/sitemap.xml` and add a real social-sharing image before launch.

## Data and administration

There is no database or admin console yet. A future content service should keep public reads separate from authenticated server-side mutations. Recommended initial entities: releases/tracks, mixes/episodes, artists, events/lineups, articles, products, enquiries and newsletter subscriptions. Add schema migrations, server-side validation, role-based authorization, rate limits, and audit records alongside the backend implementation; no mock login or public write endpoint is included.
