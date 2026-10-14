import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import routes from "../src/config/routes.json" with { type: "json" };
import site from "../src/config/site.json" with { type: "json" };
import { projects } from "../src/data/projects";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "window.turnstile={render(element,options){queueMicrotask(()=>options.callback('test-turnstile-token'));return 'test-widget';},remove(){}};",
      }),
  );
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "Your inquiry has been sent to Veyro.",
      }),
    }),
  );
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(viewport.name, () => {
    test.use({ viewport });
    for (const route of routes) {
      test(`${route.path}: loads, metadata, images, layout and accessibility`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page).toHaveTitle(route.title);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          "content",
          route.description,
        );
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          site.canonicalOrigin + route.path,
        );
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          await Promise.all(
            [...document.images].map((image) => image.decode()),
          );
          window.scrollTo(0, 0);
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        expect(
          await page.evaluate(() =>
            [...document.images].every(
              (image) => image.complete && image.naturalWidth > 0,
            ),
          ),
        ).toBe(true);
        const audit = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          audit.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        ).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

test("desktop navigation, services anchors and pricing links", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(
    page.getByRole("link", { name: "Business automation", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Business automation", exact: true })
    .click();
  await expect(page).toHaveURL(/#automation$/);
  await expect(page.locator("#automation")).toBeInViewport();
  await page
    .locator(".price-row")
    .nth(3)
    .getByRole("link", { name: "Request a quote" })
    .click();
  await expect(page).toHaveURL(/contact\?project=automation/);
  await expect(page.getByLabel("Type of project")).toHaveValue("automation");
});

test("portfolio filters show the right real projects", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator(".portfolio-grid article")).toHaveCount(3);
  await page.getByRole("button", { name: /^Websites/ }).click();
  await expect(page.locator(".portfolio-grid article")).toHaveCount(2);
  await expect(page.locator(".portfolio-grid")).toContainText(
    "Liberty Shine Cleaning",
  );
  await expect(page.locator(".portfolio-grid")).not.toContainText("StockPilot");
  await page.getByRole("button", { name: /^Business software/ }).click();
  await expect(page.locator(".portfolio-grid article")).toHaveCount(2);
  await expect(page.locator(".portfolio-grid")).toContainText("StockPilot");
  await expect(page.locator(".portfolio-grid")).not.toContainText(
    "Liberty Shine Cleaning",
  );
  await page.getByRole("button", { name: /^All projects/ }).click();
  await expect(page.locator(".portfolio-grid article")).toHaveCount(3);
  await expect(page.getByRole("status")).toHaveText("3 projects");
});

test("all case studies use exact demo destinations and image dialogs restore focus", async ({
  page,
}) => {
  for (const project of projects) {
    await page.goto(`/work/${project.slug}`);
    for (const link of project.links) {
      const anchor = page.getByRole("link", {
        name: new RegExp(`^${link.label}`),
      });
      await expect(anchor).toHaveAttribute("href", link.href);
      await expect(anchor).toHaveAttribute("target", "_blank");
      await expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    }
    const trigger = page.getByRole("button", { name: /^Enlarge/ }).first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close image preview" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test("mobile menu traps focus, closes with Escape and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Explore Veyro" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Our work/ })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".portfolio-grid article")).toHaveCount(3);
});

test("contact validation and delivery send only after valid input and do not persist details", async ({
  page,
}) => {
  const sent: unknown[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/api/inquiry"))
      sent.push(request.postDataJSON());
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please check these details",
  );
  await expect(page.getByRole("alert")).toBeFocused();
  await expect(page.getByLabel("Name *", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page
    .getByRole("alert")
    .getByRole("link", { name: /^Email:/ })
    .click();
  await expect(page.getByLabel("Email *", { exact: true })).toBeFocused();
  await page.getByLabel("Name *", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email *", { exact: true }).fill("invalid");
  await page.getByLabel("Type of project").selectOption("website");
  await page
    .getByLabel("Project details")
    .fill("A website inquiry for a fictional business used in testing.");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Enter a valid email address",
  );
  expect(sent).toEqual([]);
  await page.getByLabel("Email *", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Business name").fill("Example Business");
  await page.getByLabel("Budget range").selectOption("$1,000–$2,499");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your inquiry has been sent." }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "reply to the email address",
  );
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({
    email: "visitor@example.com",
    business: "Example Business",
    project: "website",
    turnstileToken: "test-turnstile-token",
  });
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  expect(await page.context().cookies()).toEqual([]);
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.getByLabel("Name *", { exact: true })).toHaveValue("");
  await page.reload();
  await expect(page.getByLabel("Name *", { exact: true })).toHaveValue("");
});

test("delivery errors preserve the inquiry and never show a false success", async ({
  page,
}) => {
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Please retry or email us." }),
    }),
  );
  await page.goto("/contact?project=website&offer=launch");
  await page.getByLabel("Name *", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email *", { exact: true }).fill("visitor@example.com");
  await page
    .getByLabel("Project details")
    .fill("A fictional inquiry to check the delivery failure experience.");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please retry or email us.",
  );
  await expect(
    page.getByRole("heading", { name: "Your inquiry has been sent." }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Name *", { exact: true })).toHaveValue(
    "Test Visitor",
  );
  await expect(page.getByLabel("Budget range")).toHaveValue(
    "$300 launch offer",
  );
});

test("network failure keeps the message and gives a useful retry path", async ({
  page,
}) => {
  await page.route("**/api/inquiry", (route) => route.abort());
  await page.goto("/contact?project=website");
  await page.getByLabel("Name *", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email *", { exact: true }).fill("visitor@example.com");
  await page
    .getByLabel("Project details")
    .fill("A fictional inquiry to check what happens when the network fails.");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "couldn’t confirm your inquiry was sent",
  );
  await expect(page.getByLabel("Project details")).toHaveValue(
    "A fictional inquiry to check what happens when the network fails.",
  );
});

test("unknown paths, skip link, FAQ and reduced motion", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Page not found",
  );
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  await page.goto("/services");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("h1")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});

test("narrow 320px phone has no overflow on every page", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of routes) {
    await page.goto(route.path);
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route.path,
    ).toBe(true);
  }
});

test("only self-hosted resources and the approved security check are requested", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (
      new URL(request.url()).origin !==
        new URL(process.env.BASE_URL ?? "http://127.0.0.1:5188").origin &&
      !request.url().startsWith("data:") &&
      new URL(request.url()).origin !== "https://challenges.cloudflare.com"
    )
      external.push(request.url());
  });
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
  }
  expect(external).toEqual([]);
});

test("trailing slash routes retain the correct title and canonical", async ({
  page,
}) => {
  for (const route of routes.filter((r) => r.path !== "/")) {
    await page.goto(`${route.path}/`);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      site.canonicalOrigin + route.path,
    );
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("open dialogs and contact error/review states remain accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.goto("/work/ember-and-olive");
  await page
    .getByRole("button", { name: /^Enlarge/ })
    .first()
    .click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByLabel("Name *", { exact: true }).fill("Demo Reviewer");
  await page.getByLabel("Email *", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Type of project").selectOption("software");
  await page
    .getByLabel("Project details")
    .fill("A demonstration inquiry for a tailored operations workspace.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Your inquiry has been sent." }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
