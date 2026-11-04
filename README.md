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
  booking.html        Checkout: appointment summary + details + payment, then confirmation
  service.html        Per-service explainer (?s=01..09), e.g. service.html?s=03
  contact.html        Contact form (name, email, phone, message)
no-booking/
  index.html          Homepage (call-to-book only)
  service.html        Per-service explainer (?s=01..09)
  contact.html        Contact form
assets/
  styles.css          Shared stylesheet (brand tokens, responsive layout)
  app.js              Shared script: renders services/team/why-us, service pages,
                      nav, booking widget, checkout and contact form
images/               Photos (hero, 9 service images) + map snapshot
.nojekyll             Serve files as-is on GitHub Pages
```

Each of the 9 service cards links to `service.html?s=NN`, a mini page explaining the
treatment (what it is, what to expect, related treatments). The copy lives in
`SERVICE_DETAILS` in `assets/app.js`.

## Notes on the booking version

- The checkout is a **front-end demo** — clicking *Pay & Confirm* shows the "You're booked in" screen but **takes no real payment**. A live deposit needs a small backend (e.g. a Stripe Checkout session or Payment Intent created server-side); card details must never be handled by static pages.
- The date/time slots are **dummy data** in `assets/app.js`; wire them to the clinic's real diary for production.
- The **contact form** (`contact.html`) confirms on screen but does not deliver messages yet. To receive them for free, point the form at a handler such as [Formspree](https://formspree.io) (set the form's `action` and `method`) or Web3Forms, or wire it to the clinic's email.

## Languages

The site is fully multilingual in **English, German, French, Greek and Russian**. Flags
in the top-right switch the language on every page; the choice is remembered (localStorage)
and applied across the homepage, service pages, booking and contact. All copy lives in
`assets/styles.css`'s sibling `assets/i18n.js` (one dictionary per language); `assets/app.js`
fills every `[data-i18n]` / `[data-i18n-html]` / `[data-i18n-ph]` element and renders the
data-driven sections in the active language. Flag icons come from the `flag-icons` CDN.
Team names and GDC numbers are the same in every language.

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
