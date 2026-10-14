# Veyro Digital Studio

Business websites, custom business software and automation. Email hello@veyro350.com forwards to the verified business Gmail inbox. The contact form sends inquiries directly through Cloudflare using Turnstile, server validation, fixed email recipients and rate limits.

## Build and validate

Use Node.js 22.12+ or 24. Run `npm ci`, `npm run lint`, `npm run build`, `npm run verify:build`, `npx playwright install chromium`, and `npm test`. Local tests use installed Chrome; CI uses bundled Chromium. `node scripts/security-smoke.mjs` tests the generated response headers on a temporary loopback port.

Development: `npm run dev`. Production static output: `dist/`. Cloudflare Pages serves the prerendered marketing pages and metadata. Only `/api/inquiry` invokes a Pages Function, which calls the private `veyro-inquiries` Worker. Worker and Pages configuration files are included; Turnstile's private secret must be configured through Cloudflare and must never be committed. Sending is restricted to the verified owner inbox and does not require a paid email subscription.

The canonical domain is https://veyro350.com. Cloudflare's zone redirect rule sends www requests to the apex while preserving paths and query strings. `src/config/site.json` owns public contact information, Turnstile's public site key, indexing mode and pricing. Maintenance and custom software use a custom quote. Production uses previewMode false.

Portfolio demos are fictional concepts, not paid client commissions. Their management tools store only browser-local fictional data and have no production authentication or backend. Asset/photo/font credits are retained under `docs/credits`.

The launch campaign is controlled by `launchOffer` in `src/config/site.json`: simple websites cost $300 for the first 10 clients, with custom launch quotes for larger projects. Client eligibility is agreed directly; the site does not invent a remaining-spots count. Set `launchOffer.active` to false when the offer ends to restore the regular prices and remove the campaign sections.

## Release

Validation runs on pull requests and main. Publish only a reviewed commit with passing validation. Deploy the delivery Worker with `npx wrangler deploy --config workers/wrangler.jsonc`, configure its TURNSTILE_SECRET securely, then deploy Pages with the root wrangler configuration. Keep previous deployment versions for rollback. Verify actual mail delivery as well as public headers and contact failures. Automated tests mock email and Turnstile; they never send real inquiries or validate production challenges.
