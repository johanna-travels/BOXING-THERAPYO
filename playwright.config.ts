import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4321';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: isCI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: process.env.PW_WATCH ? 400 : 0,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        ...devices['iPhone 13'],
      },
    },
  ],
  webServer: isCI
    ? {
        command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4321',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : {
        command: 'npm run dev -- --host 127.0.0.1 --port 4321',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
