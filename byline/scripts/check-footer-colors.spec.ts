import { test } from '@playwright/test';

test('check footer colors', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(1000);

  // Scroll to footer
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    footer?.scrollIntoView();
  });
  await page.waitForTimeout(500);

  const isDarkInitially = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log(`Initial theme: ${isDarkInitially ? 'DARK' : 'LIGHT'}`);
  await page.screenshot({ path: 'C:/Users/shanu/.gemini/antigravity-cli/brain/5caae54d-0854-4073-a985-46553c8b6dd1/footer_initial.png' });

  // Toggle theme
  const toggle = page.locator('[aria-label="Toggle theme"]').first();
  await toggle.click();
  await page.waitForTimeout(500);

  const isDarkAfterToggle = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log(`Theme after toggle: ${isDarkAfterToggle ? 'DARK' : 'LIGHT'}`);
  await page.screenshot({ path: 'C:/Users/shanu/.gemini/antigravity-cli/brain/5caae54d-0854-4073-a985-46553c8b6dd1/footer_toggled.png' });
});
