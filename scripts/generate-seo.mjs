import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from 'vite';
import { createHash } from 'node:crypto';

const site = JSON.parse(await fs.readFile("src/config/site.json", "utf8"));
const routes = JSON.parse(await fs.readFile("src/config/routes.json", "utf8"));
const schema=JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.fullName,url:site.canonicalOrigin,email:site.email,logo:site.canonicalOrigin+'/brand/logo-horizontal-transparent.png'}).replaceAll('<','\\u003c');
const schemaHash="'sha256-"+createHash('sha256').update(schema).digest('base64')+"'";
const shell = (await fs.readFile("dist/index.html", "utf8")).replace('</head>',`<script type="application/ld+json">${schema}</script></head>`);
const renderer = await createServer({server:{middlewareMode:true},appType:'custom'});
const { render } = await renderer.ssrLoadModule('/src/render.tsx');
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of routes) {
  const url = `${site.canonicalOrigin}${route.path}`;
  const meta = {
    description: route.description,
    "og:title": route.title,
    "og:description": route.description,
    "og:url": url,
    "og:image": `${site.canonicalOrigin}/brand/social-preview.png`,
    "twitter:title": route.title,
    "twitter:description": route.description,
    "twitter:image": `${site.canonicalOrigin}/brand/social-preview.png`,
    robots: site.previewMode ? "noindex, nofollow" : "index, follow",
  };
  let html = shell
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escape(route.title)}</title>`,
    )
    .replace(
      /<link\b(?=[^>]*rel="canonical")[^>]*>/,
      `<link rel="canonical" href="${escape(url)}" />`,
    );
  for (const [name, content] of Object.entries(meta)) {
    const attribute = name.startsWith("og:") ? "property" : "name";
    html = html.replace(/<meta\b[^>]*>/g, (tag) =>
      tag.includes(`${attribute}="${name}"`)
        ? `<meta ${attribute}="${name}" content="${escape(content)}" />`
        : tag,
    );
  }
  const destination = path.join(
    "dist",
    route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`,
  );
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, html.replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`));
}
await fs.writeFile('dist/404.html',shell.replace(/<title>[\s\S]*?<\/title>/,'<title>Page not found | Veyro</title>').replace('<div id="root"></div>',`<div id="root">${render('/__missing__')}</div>`));
await renderer.close();
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${escape(site.canonicalOrigin + r.path)}</loc></url>`).join("\n")}\n</urlset>\n`,
);
await fs.writeFile(
  "dist/robots.txt",
  site.previewMode
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nSitemap: ${site.canonicalOrigin}/sitemap.xml\n`,
);
// Hostname redirects are managed by Cloudflare's zone redirect rule.
await fs.writeFile('dist/_redirects','');
await fs.writeFile(
  "dist/_headers",
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com ${schemaHash}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'\n${site.previewMode ? "  X-Robots-Tag: noindex, nofollow\n" : ""}\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
);
console.log(
  `Prerendered ${routes.length} full marketing pages and a 404 page, sitemap, robots and static-host security headers. Preview indexing: ${site.previewMode ? "disabled" : "enabled"}.`,
);
