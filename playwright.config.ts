import { defineConfig, devices } from '@playwright/test';

const basePath = '/BOXING-THERAPYO';
const baseURL = `http://127.0.0.1:4321${basePath}/`;
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
        // Build runs as a separate CI step so failures surface clearly.
        command: 'npm run preview -- --host 127.0.0.1 --port 4321',
        url: baseURL,
        reuseExistingServer: false,
        stdout: /ready/i,
        timeout: 60_000,
      }
    : {
        command: 'npm run dev -- --host 127.0.0.1 --port 4321',
        url: baseURL,
        reuseExistingServer: true,
        stdout: /ready/i,
        timeout: 60_000,
      },
});
