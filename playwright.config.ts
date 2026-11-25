import { defineConfig, devices } from "@playwright/test";

const localURL = "http://127.0.0.1:4173";
const baseURL = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  forbidOnly: Boolean(process.env.CI),
  use: {
    baseURL: baseURL || localURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: baseURL
    ? undefined
    : {
        command: "pnpm build && pnpm serve",
        url: localURL,
        reuseExistingServer: !process.env.CI,
      },
});
