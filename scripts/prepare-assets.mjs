import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const liberty =
  "C:/Users/goroz/Documents/Codex/2026-10-12/files-pasted-by-the-user-codex/outputs/liberty-shine";
const ember = path.resolve(root, "../ember-olive-restaurant-demo");
const stockpilot = path.resolve(root, "../stockpilot-demo");
const selections = {
  "liberty-shine": {
    source: liberty,
    repo: "https://github.com/rwesterngeorgia-glitch/Liberty-Shine",
    files: {
      home: "marketing/screenshots/home-desktop-viewport.png",
      mobile: "marketing/screenshots/home-mobile-viewport.png",
      services: "marketing/screenshots/services-1440.png",
      contact: "marketing/screenshots/contact-1440.png",
      detail: "marketing/screenshots/about-1440.png",
      presentation: "marketing/desktop-presentation-16x9.png",
    },
  },
  "ember-and-olive": {
    source: ember,
    repo: "https://github.com/rwesterngeorgia-glitch/Demo-2",
    files: {
      home: "marketing/desktop-homepage-viewport.png",
      mobile: "marketing/mobile-homepage-viewport.png",
      menu: "marketing/digital-menu-viewport.png",
      dashboard: "marketing/admin-dashboard-viewport.png",
      editor: "marketing/menu-editor.png",
      scheduling: "marketing/staff-scheduling-viewport.png",
      reservations: "marketing/reservation-management-viewport.png",
    },
  },
  stockpilot: {
    source: stockpilot,
    repo: "https://github.com/rwesterngeorgia-glitch/Demo3",
    files: {
      home: "marketing/screenshots/dashboard.png",
      landing: "marketing/screenshots/landing.png",
      mobile: "marketing/screenshots/mobile.png",
      inventory: "marketing/screenshots/inventory.png",
      purchasing: "marketing/screenshots/purchase-orders.png",
      recipes: "marketing/screenshots/recipes.png",
      waste: "marketing/screenshots/waste.png",
    },
  },
};
const manifest = {};
const provenance = [];
const contactTiles = [];
for (const [slug, project] of Object.entries(selections)) {
  const outputDir = path.join(root, "public/portfolio", slug);
  await fs.mkdir(outputDir, { recursive: true });
  manifest[slug] = {};
  for (const [key, file] of Object.entries(project.files)) {
    const source = path.join(project.source, file);
    const sourceBuffer = await fs.readFile(source);
    const metadata = await sharp(sourceBuffer).metadata();
    const width = Math.min(metadata.width, 1600);
    const destination = path.join(outputDir, `${key}.webp`);
    await sharp(sourceBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(destination);
    const result = await sharp(destination).metadata();
    const src = `/portfolio/${slug}/${key}.webp`;
    let srcSet = "";
    if (width > 800 && key !== "mobile") {
      await sharp(sourceBuffer)
        .resize({ width: 800 })
        .webp({ quality: 88 })
        .toFile(path.join(outputDir, `${key}-800.webp`));
      srcSet = `/portfolio/${slug}/${key}-800.webp 800w, ${src} ${result.width}w`;
    }
    manifest[slug][key] = {
      src,
      srcSet,
      width: result.width,
      height: result.height,
    };
    provenance.push({
      project: slug,
      repository: project.repo,
      sourcePath: source,
      sourceSHA256: crypto
        .createHash("sha256")
        .update(sourceBuffer)
        .digest("hex"),
      destination: src,
      originalBytes: sourceBuffer.length,
      optimizedBytes: (await fs.stat(destination)).size,
    });
    const tile = await sharp(sourceBuffer)
      .resize(360, 240, { fit: "contain", background: "#e8e9e5" })
      .png()
      .toBuffer();
    contactTiles.push(tile);
  }
}
await fs.writeFile(
  path.join(root, "src/data/images.json"),
  JSON.stringify(manifest, null, 2),
);
await fs.writeFile(
  path.join(root, "docs/asset-provenance.json"),
  JSON.stringify(provenance, null, 2),
);
await sharp({
  create: {
    width: 1080,
    height: Math.ceil(contactTiles.length / 3) * 240,
    channels: 3,
    background: "#e8e9e5",
  },
})
  .composite(
    contactTiles.map((input, i) => ({
      input,
      left: (i % 3) * 360,
      top: Math.floor(i / 3) * 240,
    })),
  )
  .png()
  .toFile(path.join(root, "docs/asset-contact-sheet.png"));

const favicon = path.join(root, "public/brand/favicon-source.png");
for (const [name, size] of [
  ["favicon-32", 32],
  ["icon-192", 192],
  ["apple-touch-icon", 180],
]) {
  await sharp(favicon)
    .resize(size, size)
    .png()
    .toFile(path.join(root, `public/brand/${name}.png`));
}
// Use the actual supplied logo on a contrasting panel; original assets are preserved.
const logo = await sharp(
  path.join(root, "public/brand/logo-horizontal-transparent.png"),
)
  .resize({ width: 270 })
  .png()
  .toBuffer();
const social = Buffer.from(
  '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#151719"/><rect x="60" y="50" width="310" height="115" rx="2" fill="#f4f3ee"/><text x="60" y="290" font-family="Arial,sans-serif" font-size="76" font-weight="bold" fill="#f4f3ee">Websites &amp; software</text><text x="60" y="390" font-family="Arial,sans-serif" font-size="76" font-weight="bold" fill="#97b2d0">for your business.</text><path d="M1040 500H1130V410M1130 500L1040 410" stroke="#97b2d0" stroke-width="5" fill="none"/><text x="62" y="550" font-family="Arial,sans-serif" font-size="22" fill="#bbc0c5">WEB DEVELOPMENT · BUSINESS SOFTWARE · AUTOMATION</text></svg>',
);
await sharp(social)
  .composite([{ input: logo, left: 80, top: 67 }])
  .png()
  .toFile(path.join(root, "public/brand/social-preview.png"));
console.log(
  `Prepared ${provenance.length} real portfolio screenshots, responsive variants, icons and social preview.`,
);
