import { test } from '@playwright/test';

test('check hero buttons', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(1000);

  const buttonStyles = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));
    const primary = anchors.find(a => a.textContent?.includes('Read the Docs'));
    const ghost = anchors.find(a => a.textContent?.includes('Star on GitHub'));
    
    return {
      primary: primary ? {
        text: primary.textContent?.trim(),
        color: window.getComputedStyle(primary).color,
        bgColor: window.getComputedStyle(primary).backgroundColor,
        border: window.getComputedStyle(primary).border,
      } : null,
      ghost: ghost ? {
        text: ghost.textContent?.trim(),
        color: window.getComputedStyle(ghost).color,
        bgColor: window.getComputedStyle(ghost).backgroundColor,
        border: window.getComputedStyle(ghost).border,
      } : null,
    };
  });

  console.log('Primary button style:', JSON.stringify(buttonStyles.primary, null, 2));
  console.log('Ghost button style:', JSON.stringify(buttonStyles.ghost, null, 2));
});
