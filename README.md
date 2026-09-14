# SoftTech Service — softtechservice.site

The company site for **SoftTech Service**, an independent Android studio. It is a static
site hosted on GitHub Pages, with a landing page and privacy policy for every product we ship.

Live at **https://softtechservice.site**
Google Play: **https://play.google.com/store/apps/dev?id=8966016201726803166**

## Structure

```
/
├── index.html          # Company landing page (services, products, process, contact)
├── styles.css          # Design system + all page styles
├── script.js           # Nav, scroll reveal, counters, portfolio filter, contact form
├── images/
│   ├── logo.png        # Brand mark (also favicon / apple-touch-icon)
│   ├── logo_trans.png  # Transparent mark, used in the footer
│   ├── about-us.jpg    # Photo in the "Why us" section
│   ├── hero-banner.jpg # Open Graph / Twitter card image
│   └── apps/           # One icon per product (see below)
├── app-ads.txt         # AdMob authorised sellers
├── sellers.json        # Publisher declaration
├── CNAME               # Custom domain
└── <product>/          # One folder per product: index.html + privacy-policy.html
```

Each subfolder (`ultraplay/`, `sdm/`, `superholeio/`, …) is a self-contained product page.
Google Play requires a reachable privacy policy URL for every listing, so those pages must
stay online even for products that are not currently published.

### Product icons — `images/apps/`

| Type | Source |
|---|---|
| `.png` | The official Play Store icon, downloaded at 256 px |
| `.svg` | Generated icon for products not yet on Play, using that product page's own brand colours |

The SVGs are produced by a small script; both types render identically in the grid
(same squircle, size and shadow), so the catalogue looks consistent.

## Design system

Defined as CSS custom properties at the top of `styles.css`:

- **Type** — Plus Jakarta Sans (headings) + Inter (body)
- **Palette** — near-black ink on white/off-white, one restrained blue accent (`--brand-600`)
- **Depth** — five shadow steps, hairline `--line` borders, 8–32 px radii
- **Motion** — IntersectionObserver scroll reveals, count-up stats, card lift on hover.
  Everything is disabled under `prefers-reduced-motion: reduce`.

## Contact form

The site is static, so there is **no server to post to**. The form validates input and then
opens the visitor's own mail client with a pre-filled message to `contect@softtechservice.site`.
Nothing is stored and nothing is sent without the visitor pressing send in their mail app.

To deliver submissions straight to an inbox instead, point the `<form>` at a form relay
(Formspree, FormSubmit, Basin) and drop the `mailto:` handoff in `script.js`.

## Local development

```bash
python3 -m http.server 5173
```

Then open <http://localhost:5173>. `styles.css` and `script.js` are referenced with a `?v=`
query string — bump it when you deploy so browsers pick up changes instead of a cached copy.

## Contact

Email: **contect@softtechservice.site**
SoftTech Service — Proprietor: Maurya Neha Devi Ajitkumar

---

© SoftTech Service. All rights reserved.
