# Veyro Digital Studio

Business websites, custom business software and automation. The public contact method is email-first at veyro350@gmail.com; the optional helper prepares a draft and does not send or persist it.

## Build and validate

Use Node.js 22.12+ or 24. Run `npm ci`, `npm run lint`, `npm run build`, `npm run verify:build`, `npx playwright install chromium`, and `npm test`. Local tests use installed Chrome; CI uses bundled Chromium. `node scripts/security-smoke.mjs` tests the generated response headers on a temporary loopback port.

Development: `npm run dev`. Production static output: `dist/`. Cloudflare Pages serves the full prerendered marketing pages, route metadata, 404 page, robots/sitemap, security headers and canonical redirects. No server runtime, analytics or paid integrations are required.

The canonical domain is https://veyro350.com. Cloudflare's zone redirect rule sends www requests to the apex while preserving paths and query strings. `src/config/site.json` owns contact information, indexing mode and pricing. Maintenance and custom software use a custom quote. Set previewMode to true for a deliberately excluded preview; production uses false.

Portfolio demos are fictional concepts, not paid client commissions. Their management tools store only browser-local fictional data and have no production authentication or backend. Asset/photo/font credits are retained under `docs/credits`.

The launch campaign is controlled by `launchOffer` in `src/config/site.json`: simple websites cost $300 for the first 10 clients, with custom launch quotes for larger projects. Client eligibility is agreed directly; the site does not invent a remaining-spots count. Set `launchOffer.active` to false when the offer ends to restore the regular prices and remove the campaign sections.

## Release

Validation runs on pull requests and main. Publish only a reviewed commit with passing validation. Deployment is an explicit Cloudflare release step; the GitHub workflow does not contain deployment credentials or an automatic publish step. Keep the previous Cloudflare deployment ID for rollback. Verify public headers, canonical redirects, deep links, 404, contact actions and social metadata after every release.
