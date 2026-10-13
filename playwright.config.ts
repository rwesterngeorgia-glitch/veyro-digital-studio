import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "docs/qa-results.json" }],
  ],
  webServer: process.env.BASE_URL ? undefined : {command:"npm run dev -- --port 5188",url:"http://127.0.0.1:5188",reuseExistingServer:!process.env.CI},
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:5188",
    headless: true,
    launchOptions: { channel: process.env.CI ? undefined : "chrome" },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
