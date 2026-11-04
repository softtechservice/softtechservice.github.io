# SoftTech Service — softtechservice.site

The company site for **SoftTech Service**, an independent Android studio. It is a static
site hosted on GitHub Pages, with a landing page and privacy policy for every product we ship.

Live at **https://softtechservice.site**
Google Play: **https://play.google.com/store/apps/dev?id=8966016201726803166**

## Structure

```
/
├── index.html          # Company landing page (catalogue, services, contact)
├── styles.css          # Shared homepage and product styles
├── script.js           # Catalogue filters, galleries, and contact form
├── demos.js            # Interactive product previews
├── images/
│   ├── logo.png        # Brand mark (also favicon / apple-touch-icon)
│   ├── logo_trans.png  # Transparent mark, used in the footer
│   ├── hero-banner.jpg # Open Graph / Twitter card image
│   ├── apps/           # One icon per product
│   └── previews/       # Optimized product images from Google Play listings
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

Defined in `styles.css`. Space Grotesk and Inter pair with an off-white canvas and per-product
accent colours. Product pages use gallery images from verified Google Play listings, existing
product artwork, or a labelled illustration. Entrance, scroll, and hover effects respect
`prefers-reduced-motion: reduce`.

## Search metadata

When adding a landing page, include its canonical URL in `sitemap.xml`. Keep its title,
description, share image, and structured data aligned with the visible product details.
The sitemap is advertised in `robots.txt` and can be submitted to Search Console and Bing Webmaster Tools.

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

Then open <http://localhost:5173>. Shared CSS and JavaScript are referenced with a `?v=`
query string — bump it when you deploy so browsers pick up changes instead of a cached copy.

## Contact

Email: **contect@softtechservice.site**
SoftTech Service — Proprietor: Maurya Neha Devi Ajitkumar

---

© SoftTech Service. All rights reserved.
