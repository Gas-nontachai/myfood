import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  use: {
    baseURL: process.env.NEXT_PUBLIC_POS_APP_URL || 'http://localhost:3001',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'] }
    }
  ]
});
