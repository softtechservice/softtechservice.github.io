# SpeedoMeter Pro public pages

Static website content for SOFTTECH SERVICE. These files are prepared locally; publishing the website and changing Play Console listing fields are separate actions.

## Public links after hosting

| Page | URL |
| --- | --- |
| App landing page | https://softtechservice.site/speedpro/ |
| Privacy policy | https://softtechservice.site/speedpro/privacy-policy.html |
| Account and data deletion | https://softtechservice.site/speedpro/delete-account.html |
| Refunds and cancellation | https://softtechservice.site/speedpro/refund-policy.html |
| Terms | https://softtechservice.site/speedpro/terms.html |
| Pro subscriptions | https://softtechservice.site/speedpro/subscriptions.html |
| Permissions | https://softtechservice.site/speedpro/permissions.html |
| Data handling summary | https://softtechservice.site/speedpro/data-safety.html |
| Support and FAQs | https://softtechservice.site/speedpro/support.html |
| Driving and GPS safety | https://softtechservice.site/speedpro/disclaimer.html |

Use the privacy URL in the Play listing. Use the dedicated account-deletion URL for the listing's account/data deletion resource after it is hosted and checked. The deletion page offers instructions in the app and an email request without reinstalling. The mail link opens a draft; the user must send it, and the support team must verify ownership and handle the request. This static site does not automatically delete an account or process a refund.

## Hosting

Publish these files with the existing website repository. Include `legal.css` and `policy-links.js` alongside the HTML. Keep the existing parent `styles.css`, `images/`, `script.js` and `demos.js` assets: the app landing and policy pages use relative references to them. No build step, API keys, account credentials or document uploads are required.

For a local preview, serve the **website repository root**, then open `/speedpro/`. For example, `python3 -m http.server 8080` from the repository root serves it at `http://localhost:8080/speedpro/`.

## Compatibility and maintenance

Existing app versions use `privacy-policy.html#terms`, `#refund` and `#delete-account`. `policy-links.js` routes these to the dedicated pages. Related links with the same fragment IDs remain visible as a no-JavaScript fallback. `privacy.html` retains its original redirect to the canonical privacy page.

The approved support address is `contect@softtechservice.site`. The India plans are INR 99/month and INR 999/year, with no free trial or lifetime plan for sale. Actual Google Play checkout terms take precedence. Keep pricing, feature descriptions, privacy disclosures and retention wording aligned with the released app. Do not add guaranteed refund amounts, processing deadlines, or provider retention periods without confirming them.

Policies describe the app functionality reviewed on 6 November 2026. Before release, check all hosted links and ensure Play Console Data safety answers match the actual released app and its SDK settings. The data handling page is a user-facing summary, not a claim that Google has approved the listing.
