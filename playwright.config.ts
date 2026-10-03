import { defineConfig, devices } from "@playwright/test";

const previewPort = process.env.AVENTURA_PREVIEW_PORT || "3147";
const baseURL = `http://127.0.0.1:${previewPort}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run preview",
    url: baseURL,
    env: { AVENTURA_PREVIEW_PORT: previewPort },
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
