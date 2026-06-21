import { test } from '@playwright/test';

test('check dashboard errors', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5175/#dashboard');
  await page.waitForTimeout(2000);
});
