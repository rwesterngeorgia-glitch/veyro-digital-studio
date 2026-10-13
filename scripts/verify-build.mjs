import fs from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";

const site = JSON.parse(await fs.readFile("src/config/site.json", "utf8"));
const routes = JSON.parse(await fs.readFile("src/config/routes.json", "utf8"));
const sitemap = await fs.readFile("dist/sitemap.xml", "utf8");
const robots = await fs.readFile("dist/robots.txt", "utf8");
for (const route of routes) {
  const rawHtml = await fs.readFile(
    path.join(
      "dist",
      route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`,
    ),
    "utf8",
  );
  const html = rawHtml.replace(/\s+/g, " ");
  assert(html.includes('<h1'), `Missing prerendered page heading: ${route.path}`);
  assert(html.includes('<main'), `Missing prerendered page content: ${route.path}`);
  const escapedTitle = route.title.replaceAll("&", "&amp;");
  assert(
    html.includes(`<title>${escapedTitle}</title>`),
    `Missing title: ${route.path}`,
  );
  assert(
    html.includes(`content="${route.description.replaceAll("&", "&amp;")}"`),
    `Missing description: ${route.path}`,
  );
  assert(
    html.includes(
      `rel="canonical" href="${site.canonicalOrigin}${route.path}"`,
    ),
    `Missing canonical: ${route.path}`,
  );
  assert(
    html.includes(
      'property="og:image" content="https://veyro350.com/brand/social-preview.png"',
    ),
  );
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  assert(sitemap.includes(`<loc>${site.canonicalOrigin}${route.path}</loc>`));
  if (site.previewMode)
    assert(html.includes('name="robots" content="noindex, nofollow"'));
  const paths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)].map(
    (match) => match[1],
  );
  for (const asset of paths) await fs.access(path.join("dist", asset.slice(1)));
}
if (site.previewMode) assert(robots.includes("Disallow: /"));
else {
  assert(robots.includes('Allow: /'));
  assert(!robots.includes('Disallow: /'));
  assert(!(await fs.readFile('dist/_headers','utf8')).includes('X-Robots-Tag: noindex'));
}
assert((await fs.readFile('dist/404.html','utf8')).includes('Page not found'));
const contactHtml = await fs.readFile('dist/contact.html','utf8');
assert(!contactHtml.includes('<form'), 'The optional client-only form must not submit a native request without JavaScript.');
await fs.access("dist/brand/favicon-32.png");
await fs.access("dist/brand/social-preview.png");
const images = JSON.parse(await fs.readFile("src/data/images.json", "utf8"));
for (const project of Object.values(images))
  for (const asset of Object.values(project))
    await fs.access(path.join("dist", asset.src.slice(1)));
console.log(
  `Verified ${routes.length} static metadata routes, sitemap, preview indexing restrictions, fonts/scripts, icons and 20 image destinations.`,
);
