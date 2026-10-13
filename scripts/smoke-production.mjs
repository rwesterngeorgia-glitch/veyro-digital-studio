import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.PRODUCTION_PREVIEW_URL ?? "http://127.0.0.1:4173";
const routes = JSON.parse(await fs.readFile("src/config/routes.json", "utf8"));
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const results = [];
try {
  for (const route of routes) {
    const errors = [];
    const onError = (error) => errors.push(error.message);
    page.on("pageerror", onError);
    const response = await page.goto(origin + route.path, {
      waitUntil: "networkidle",
    });
    await page.locator("h1").waitFor();
    assert.equal(response.status(), 200);
    assert.equal(await page.title(), route.title);
    const html = await response.text();
    assert(
      html.includes(route.title.replaceAll("&", "&amp;")),
      `Server-delivered title missing: ${route.path}`,
    );
    assert(
      html.includes(route.description.replaceAll("&", "&amp;")),
      `Server-delivered description missing: ${route.path}`,
    );
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(errors.length, 0);
    results.push({
      route: route.path,
      status: response.status(),
      title: await page.title(),
      errors,
    });
    page.off("pageerror", onError);
  }
  await fs.writeFile(
    "docs/production-smoke.json",
    JSON.stringify(
      { checkedAt: new Date().toISOString(), origin, results },
      null,
      2,
    ),
  );
  console.log(
    `Production preview: ${results.length} pages returned HTTP 200, correct server-delivered metadata and rendered without uncaught errors.`,
  );
} finally {
  await browser.close();
}
