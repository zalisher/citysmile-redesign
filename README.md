# CitySmile — website redesign

A fast, responsive, HTTPS-ready rebuild of the website for **CitySmile Dental Practice**, 37–39 Mare Street, Hackney, London E8 4RP · 020 7739 4275.

Rebuilt as static HTML/CSS/JS from the design spec (no build step, no framework) so it can be hosted free on GitHub Pages.

## Two versions

| Version | Folder | What it is |
|---|---|---|
| **A — with online booking** | [`with-booking/`](with-booking/) | Homepage + a live date/time picker and a checkout page (`booking.html`) that takes a refundable deposit. |
| **B — without booking** | [`no-booking/`](no-booking/) | The same site as a brochure — every CTA calls the practice. No booking widget, no payment. |

The root [`index.html`](index.html) is a chooser that links to both.

## Live site (GitHub Pages)

- Chooser: `https://<user>.github.io/citysmile-redesign/`
- Version A: `.../citysmile-redesign/with-booking/`
- Version B: `.../citysmile-redesign/no-booking/`

## Structure

```
index.html            Chooser landing
with-booking/
  index.html          Homepage (with "Book online" section + sticky mobile book bar)
  booking.html        Checkout: appointment summary + details + payment → confirmation
no-booking/
  index.html          Homepage (call-to-book only)
assets/
  styles.css          Shared stylesheet (brand tokens, responsive layout)
  app.js              Shared script: renders services/team/why-us, nav, booking widget, checkout
images/               Photos + map snapshot
.nojekyll             Serve files as-is on GitHub Pages
```

## Notes on the booking version

- The checkout is a **front-end demo** — clicking *Pay & Confirm* shows the "You're booked in" screen but **takes no real payment**. A live deposit needs a small backend (e.g. a Stripe Checkout session or Payment Intent created server-side); card details must never be handled by static pages.
- The date/time slots are **dummy data** in `assets/app.js` — wire them to the clinic's real diary for production.

## Placeholders to supply before launch

- `£[PRICE]` for each treatment and the `£[DEPOSIT]` amount.
- Real availability (current slots are examples).
- Privacy / cookies / complaints policy pages.

## Design system

- **Fonts:** Inter Tight (400/500/600); Playfair Display italic for heading accents.
- **Brand colours** (CitySmile's own): navy `#2B3990`, sky `#00ADEE`, teal `#00A79D`, pink `#EF557B` / button `#D6335E`, light-blue backgrounds `#EAF7FD` / `#F4FBFF`.
- Secondary text is navy at 60–80% opacity by design; "text-safe" darker shades are used for small accent text.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```
