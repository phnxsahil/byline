import { test, expect } from '@playwright/test';

test('dump console errors', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  await page.goto('http://localhost:5174/#dashboard');
  await page.waitForTimeout(2000);
});
