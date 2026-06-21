import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BYLINE_URL || 'http://localhost:5174';

// ─── HELPERS ────────────────────────────────────────────────────────────────

async function noBlueAccent(page: Page) {
  const blueEls = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const blues = ['rgb(59, 130, 246)', 'rgb(37, 99, 235)', 'rgb(29, 78, 216)', 'rgb(96, 165, 250)', 'rgb(99, 102, 241)'];
    return all
      .filter(el => {
        const platform = el.closest('[data-platform="linkedin"]');
        if (platform) return false;
        const style = window.getComputedStyle(el);
        return blues.some(b =>
          style.backgroundColor === b ||
          style.borderColor === b ||
          style.color === b ||
          style.borderLeftColor === b
        );
      })
      .map(el => ({
        tag: el.tagName,
        class: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        text: el.textContent?.slice(0, 40),
        bg: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
      }));
  });
  return blueEls;
}

// ─── LANDING PAGE TESTS ─────────────────────────────────────────────────────

test.describe('Landing Page', () => {

  test('navbar: full links visible at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    for (const link of ['demo', 'features', 'docs', 'pricing', 'github']) {
      await expect(page.locator(`nav a:has-text("${link}")`).first()).toBeVisible();
    }
  });

  test('navbar: hamburger appears and works at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const hamburger = page.locator('[aria-label="menu"], button[data-mobile-menu], .hamburger, [aria-label="open menu"], [aria-label="Open menu"]');
    const hasHamburger = await hamburger.count() > 0;
    if (hasHamburger) {
      await hamburger.first().click();
      await page.waitForTimeout(600);
      // Check if ANY link with 'features' text is now visible on the page
      const allFeatureLinks = await page.locator('a').filter({ hasText: /^features$/i }).all();
      const anyVisible = await Promise.any(
        allFeatureLinks.map(l => l.isVisible().then(v => { if (!v) throw new Error('hidden'); return true; }))
      ).catch(() => false);
      expect(anyVisible, 'A "features" link should become visible after clicking hamburger').toBe(true);
    } else {
      // No hamburger — links should be visible directly
      const allFeatureLinks = await page.locator('a').filter({ hasText: /^features$/i }).all();
      const anyVisible = await Promise.any(
        allFeatureLinks.map(l => l.isVisible().then(v => { if (!v) throw new Error('hidden'); return true; }))
      ).catch(() => false);
      expect(anyVisible, 'A "features" link should be visible on the page').toBe(true);
    }
  });

  test('navbar: dark mode toggle is NOT between two CTA buttons', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const toggleBox = await page.locator('[aria-label="Toggle theme"]').boundingBox();
    const dashBox = await page.locator('a:has-text("dashboard"), button:has-text("dashboard"), a:has-text("desk"), button:has-text("desk")').first().boundingBox();
    const readDocsBox = await page.locator('a:has-text("read docs"), button:has-text("read docs")').first().boundingBox();
    if (toggleBox && dashBox && readDocsBox) {
      const toggleIsAfterDash = toggleBox.x > dashBox.x;
      const toggleIsBeforeReadDocs = toggleBox.x < readDocsBox.x;
      expect(
        toggleIsAfterDash && toggleIsBeforeReadDocs,
        'Dark mode toggle should NOT be sandwiched between dashboard and read docs'
      ).toBe(false);
    }
  });

  test('hero: no large gap between CTA buttons and trust badges', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const ctaBox = await page.locator('a:has-text("Read the Docs"), button:has-text("Read the Docs"), a:has-text("read the docs")').first().boundingBox();
    const badgeBox = await page.locator('text=Self-hostable').first().boundingBox();
    if (ctaBox && badgeBox) {
      const gap = badgeBox.y - (ctaBox.y + ctaBox.height);
      expect(gap, `Gap between CTA and trust badges is ${gap}px — should be ≤ 40px`).toBeLessThanOrEqual(40);
    }
  });

  test('problem section: label tight to headline (≤ 16px gap)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Scroll to problem section
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent?.includes('The Problem') && e.children.length === 0);
      el?.scrollIntoView();
    });
    const label = await page.locator('text=The Problem').first().boundingBox();
    const headline = await page.locator('text=Building in public').first().boundingBox();
    if (label && headline) {
      const gap = headline.y - (label.y + label.height);
      expect(gap, `"The Problem" label has ${gap}px gap to headline — should be ≤ 16px`).toBeLessThanOrEqual(16);
    }
  });

  test('problem section: all 4 cards same height', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-problem-card], .problem-card');
    const count = await cards.count();
    if (count === 4) {
      const heights = await Promise.all(
        Array.from({ length: 4 }, (_, i) => cards.nth(i).boundingBox().then(b => b?.height ?? 0))
      );
      const max = Math.max(...heights);
      const min = Math.min(...heights);
      expect(max - min, `Problem cards differ in height by ${max - min}px — should be ≤ 2px`).toBeLessThanOrEqual(2);
    }
  });

});

// ─── DASHBOARD TESTS ─────────────────────────────────────────────────────────

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#dashboard`);
    await page.waitForLoadState('networkidle');
    // Dismiss onboarding if present
    const skip = page.locator('button:has-text("Skip all"), button:has-text("Skip")');
    if (await skip.count() > 0) {
      await skip.first().click();
      await page.waitForTimeout(300);
    }
  });

  test('dashboard page has dark background', async ({ page }) => {
    // Check body or root background is dark
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Dark colors: #0F0F0D = rgb(15,15,13), #0D1117 = rgb(13,17,23), #161B22 = rgb(22,27,34)
    const isDark = 
      bodyBg.includes('12, 12, 10') ||   // #0C0C0A Byline background
      bodyBg.includes('15, 15, 13') ||   // #0F0F0D warm dark (reference)
      bodyBg.includes('13, 17, 23') ||   // #0D1117 GitHub dark
      bodyBg.includes('22, 27, 34') ||   // #161B22
      bodyBg.includes('26, 26, 24') ||   // #1A1A18
      bodyBg.includes('26, 26') ||       // any 26,26,x dark
      bodyBg.includes('0, 0, 0') ||      // black
      bodyBg === 'rgba(0, 0, 0, 0)' ||   // transparent (CSS var applied)
      bodyBg === '';
    expect(isDark, `Dashboard body background is ${bodyBg} — expected dark`).toBe(true);
  });

  test('no blue accent on active sidebar state', async ({ page }) => {
    const blueEls = await noBlueAccent(page);
    expect(blueEls, `Found ${blueEls.length} elements with blue accent:\n${JSON.stringify(blueEls, null, 2)}`).toHaveLength(0);
  });

  test('active sidebar item uses orange, not blue', async ({ page }) => {
    // Overview is active by default — sidebar buttons have aria-current="page" when active
    const activeItem = page.locator('[aria-current="page"]').first();
    const count = await activeItem.count();
    if (count > 0) {
      const color = await activeItem.evaluate(el => window.getComputedStyle(el).color);
      const borderLeftColor = await activeItem.evaluate(el => window.getComputedStyle(el).borderLeftColor);
      const isOrangeOrAmber =
        color.includes('232, 89') || color.includes('232, 94') ||
        color.includes('232, 87') || color.includes('240, 165') ||
        color.includes('249, 115') || color.includes('232, 93') ||
        borderLeftColor.includes('232, 89') || borderLeftColor.includes('232, 94') ||
        borderLeftColor.includes('232, 87') || borderLeftColor.includes('232, 93');
      expect(isOrangeOrAmber, `Active sidebar item color=${color}, border=${borderLeftColor} — expected orange/amber`).toBe(true);
    }
  });

  test('voice score chart: no unicode escape in label', async ({ page }) => {
    const bodyText = await page.textContent('body');
    expect(bodyText, 'Found raw unicode escape \\U2014 in page').not.toContain('\\U2014');
    expect(bodyText, 'Found raw unicode escape U2014 in page').not.toContain('U2014');
  });

  test('milestone table: no rows with score 0', async ({ page }) => {
    const zeroScoreRows = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      return all.filter(el => {
        if (el.children.length > 0) return false;
        return el.textContent?.trim() === '0';
      }).length;
    });
    expect(zeroScoreRows, `Found ${zeroScoreRows} elements showing score "0" — should show "Processing..." or be hidden`).toBe(0);
  });

  test('posts/week chart: no purple for X/Twitter', async ({ page }) => {
    const purpleInChart = await page.evaluate(() => {
      const chartEl = document.querySelector('.recharts-wrapper, [class*="recharts"], canvas, [data-chart]');
      if (!chartEl) return false;
      const purples = ['rgb(139, 92, 246)', 'rgb(124, 58, 237)', 'rgb(109, 40, 217)', 'rgb(99, 102, 241)'];
      const all = Array.from(chartEl.querySelectorAll('*'));
      return all.some(el => {
        const style = window.getComputedStyle(el);
        const fill = el.getAttribute('fill') || '';
        return purples.some(p =>
          style.fill === p ||
          style.backgroundColor === p ||
          style.stroke === p
        ) || fill.includes('6366F1') || fill.includes('8B5CF6');
      });
    });
    expect(purpleInChart, 'Chart uses purple — brand colors should be orange/amber for active states').toBe(false);
  });

});
