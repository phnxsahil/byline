import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  timeout: 30000,
  use: {
    baseURL: process.env.BYLINE_URL || 'http://localhost:5174',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  reporter: [['list'], ['json', { outputFile: 'fix-logs/results.json' }]],
});
