import { test } from '@playwright/test';

test('take screenshot at 1512px', async ({ page }) => {
  await page.setViewportSize({ width: 1512, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(2500); // Allow entrance animations to fully complete
  await page.screenshot({ path: 'C:/Users/shanu/.gemini/antigravity-cli/brain/5caae54d-0854-4073-a985-46553c8b6dd1/navbar_fix_preview.png' });
  console.log('Screenshot taken successfully at 1512px width');
});
