import fs from "node:fs/promises";
import { chromium } from "playwright";

await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const pages = [
  ["home", "/"],
  ["services", "/services"],
  ["work", "/work"],
  ["liberty-shine", "/work/liberty-shine"],
  ["ember-and-olive", "/work/ember-and-olive"],
  ["stockpilot", "/work/stockpilot"],
  ["industries", "/industries"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
];
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const [name, route] of pages) {
    if (
      viewport.name === "tablet" &&
      !["home", "contact", "work"].includes(name)
    )
      continue;
    await page.goto(`http://127.0.0.1:5173${route}`, {
      waitUntil: "networkidle",
    });
    await page.locator("h1").waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      await Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      );
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: `docs/screenshots/${name}-${viewport.name}.png`,
      fullPage: true,
    });
    if (name === "home")
      await page.screenshot({
        path: `docs/screenshots/home-${viewport.name}-viewport.png`,
      });
    if (name === "contact" && viewport.name === "desktop") {
      await page.locator(".optional-inquiry > summary").click();
      await page
        .getByRole("button", { name: "Review inquiry" })
        .click();
      await page.screenshot({
        path: "docs/screenshots/contact-validation-desktop.png",
        fullPage: true,
      });
    }
    console.log(`Captured ${name} / ${viewport.name}`);
  }
  await context.close();
}
await browser.close();
