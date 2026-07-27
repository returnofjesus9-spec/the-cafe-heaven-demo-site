# The Cafe Heaven — Next.js Demo Site

## Run it

```bash
cd cafe-heaven
npm install
npm run dev
```

Open http://localhost:3000. `npm run build && npm run start` for a production build.

Node 18+ recommended. Fonts (Fraunces, Work Sans, IBM Plex Mono) are self-hosted
via `@fontsource`, so no external font requests at runtime.

## Pages

- `/` — Home: hero, four menu pillars, signature dishes, ambience, reviews, CTA
- `/about` — Our Story
- `/menu` — Categorized menu
- `/gallery` — Photo grid
- `/contact` — Address, phone, map embed, demo enquiry form (front-end only, no backend)

## Design

- Palette, type (Fraunces / Work Sans / IBM Plex Mono) and the signature
  scrollwork + coffee-branch motif (`components/Sprig.jsx`) are drawn from the
  uploaded logo, used sparingly as a section divider rather than decoration.
- The "aesthetic risk" is the tiled-floor background pattern on light
  sections (`.tile-pattern` in `app/globals.css`), which echoes the cafe's
  real patterned floor from the interior photo rather than a generic texture.

## What's real vs. assumed

Pulled from public listings (Justdial, Zomato, Swiggy, Instagram, Wanderlog,
District.in) as of July 2026:
- Category: cafe serving continental cuisine, coffee, burgers, pizza, cakes;
  also books birthday parties (from Instagram bio).
- Location: Acharya Vihar, Bhubaneswar — 751013 (Justdial; matches the
  address fragment visible in the storefront photo). Zomato/magicpin also
  list a Gajapati Nagar listing for the same name — noted as a possible
  second/older listing, not confirmed as a second live branch.
- Rating: 4.4/5 from ~1,029 ratings (Justdial).
- Reviews reference hand-stretched, house-made pizza dough, custom toppings,
  blueberry cheesecake and tiramisu as standouts, and generally describe the
  ambience as warm/cozy/soothing with good service (one negative review was
  not used as representative).

Assumed / not verifiable and flagged in-app:
- Exact menu items and prices (full menu wasn't accessible without login on
  Zomato/Justdial) — the menu page is a representative build based on the
  cafe's known categories and standout dishes, with an on-page note saying so.
- Exact opening hours (used Justdial's "open until 10:00 pm" data point,
  assumed 11 AM open) — flagged in the footer.
- Years in operation, founders, awards/press — no reliable public source
  found, so these were left out rather than invented.
