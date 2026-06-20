import { test, expect } from '@playwright/test';

// Dismiss onboarding if visible
async function dismissOnboarding(page: any) {
  const skipButton = page.locator('button:has-text("Skip all"), button:has-text("Skip")');
  if (await skipButton.count() > 0) {
    await skipButton.first().click();
    await page.waitForTimeout(300);
  }
}

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#dashboard');
    await page.locator('button:has-text("Overview")').first().waitFor({ state: 'visible' });
    await dismissOnboarding(page);
  });

  test('should render sidebar correctly (232px wide)', async ({ page }) => {
    // Find the LeftSidebarNavigation container by locating a button inside it
    const overviewBtn = page.locator('button:has-text("Overview")').first();
    const sidebar = page.locator('div[data-testid="sidebar"]').first();
    await expect(sidebar).toBeVisible();
    
    const boundingBox = await sidebar.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBe(232);
  });

  test('should display 6 navigation items', async ({ page }) => {
    const expectedTabs = ['Overview', 'Desk', 'Signal', 'Activity', 'Settings', 'Docs'];
    for (const tabName of expectedTabs) {
      const btn = page.locator(`button:has-text("${tabName}")`).first();
      await expect(btn).toBeVisible();
    }
  });

  test('should switch active content when a navigation link is clicked', async ({ page }) => {
    // Switch to The Desk
    await page.locator('button:has-text("Desk")').first().click();
    await expect(page.locator('button:has-text("Drafts")').first()).toBeVisible();

    // Switch to Signal
    await page.locator('button:has-text("Signal")').first().click();
    await expect(page.locator('text=SIGNAL FEED').first()).toBeVisible();

    // Switch to Activity
    await page.locator('button:has-text("Activity")').first().click();
    await expect(page.locator('text=sahil').first()).toBeVisible();

    // Switch to Settings
    await page.locator('button:has-text("Settings")').first().click();
    await expect(page.locator('text=Approval Mode').first()).toBeVisible();

    // Switch to Docs
    await page.locator('button:has-text("Docs")').first().click();
    await expect(page.locator('text=Getting Started').first()).toBeVisible();
  });

  test('active navigation item should show orange active styling', async ({ page }) => {
    const overviewBtn = page.locator('button:has-text("Overview")').first();
    const color = await overviewBtn.evaluate(el => window.getComputedStyle(el).color);
    const borderLeftColor = await overviewBtn.evaluate(el => window.getComputedStyle(el).borderLeftColor);
    
    // Check color has orange/amber component.
    // Active styling should use var(--by-accent) = #E85E2C = rgb(232, 94, 44)
    const isOrange = color.includes('232, 94') || borderLeftColor.includes('232, 94') ||
                     color.includes('232, 89') || borderLeftColor.includes('232, 89') ||
                     color.includes('232, 93') || borderLeftColor.includes('232, 93') ||
                     color.includes('240, 165') || borderLeftColor.includes('240, 165') ||
                     color.includes('245, 94') || borderLeftColor.includes('245, 94');
                     
    expect(isOrange, `Active styling is not orange. color: ${color}, border: ${borderLeftColor}`).toBe(true);
  });
});

test.describe('Simplified TopBar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#dashboard');
    await page.locator('button:has-text("Overview")').first().waitFor({ state: 'visible' });
    await dismissOnboarding(page);
  });

  test('should not render centered navigation tabs', async ({ page }) => {
    // The TopBar should not contain centered nav links
    const topBar = page.locator('div[data-testid="topbar"]').first();
    const topBarOverview = topBar.locator('button:has-text("Overview")');
    // Topbar shouldn't have nav tabs directly inside it anymore
    await expect(topBarOverview).toHaveCount(0);
  });

  test('should render logo, project switcher, avatar, and K shortcut', async ({ page }) => {
    // Logo
    await expect(page.locator('button:has-text("byline_")').first()).toBeVisible();

    // Project switcher
    await expect(page.locator('#project-switcher-btn')).toBeVisible();

    // Avatar
    const avatar = page.locator('div').filter({ has: page.locator('svg') }).last();
    await expect(avatar).toBeVisible();

    // K shortcut pill containing "⌘K"
    const shortcutPill = page.locator('button:has-text("⌘K")').first();
    await expect(shortcutPill).toBeVisible();
  });
});

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#dashboard');
    await page.locator('button:has-text("Overview")').first().waitFor({ state: 'visible' });
    await dismissOnboarding(page);
  });

  test('should open when clicking the TopBar shortcut pill', async ({ page }) => {
    const shortcutPill = page.locator('button:has-text("⌘K")').first();
    await shortcutPill.click();

    const input = page.locator('input[placeholder="Search commands…"]');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('should open on Cmd+K or Ctrl+K keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Control+K');

    const input = page.locator('input[placeholder="Search commands…"]');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('should close when Escape key is pressed', async ({ page }) => {
    await page.keyboard.press('Control+K');
    const input = page.locator('input[placeholder="Search commands…"]');
    await expect(input).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(input).toBeHidden();
  });

  test('should fuzzy match navigation destinations', async ({ page }) => {
    await page.keyboard.press('Control+K');
    const input = page.locator('input[placeholder="Search commands…"]');
    await input.fill('navset');

    const settingsOption = page.locator('div:has-text("Navigate to Settings")').last();
    await expect(settingsOption).toBeVisible();
  });

  test('should fuzzy match Doc headings', async ({ page }) => {
    await page.keyboard.press('Control+K');
    const input = page.locator('input[placeholder="Search commands…"]');
    await input.fill('getstart');

    // Should display "Getting Started" or matching doc heading
    const docOption = page.locator('div:has-text("Getting Started")').last();
    await expect(docOption).toBeVisible();
  });

  test('should show "Dispatch: \'{text}\'" when typing unmatched queries', async ({ page }) => {
    await page.keyboard.press('Control+K');
    const input = page.locator('input[placeholder="Search commands…"]');

    const unmatchedText = 'some completely random query';
    await input.fill(unmatchedText);

    // Should display "Dispatch: 'some completely random query'" option
    const dispatchOption = page.locator(`div:has-text("Dispatch: '${unmatchedText}'")`).last();
    await expect(dispatchOption).toBeVisible();
  });
});

test.describe('Mobile Responsive Nav', () => {
  test('should display hamburger menu and open sidebar overlay on click under 900px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/#dashboard');
    await page.locator('button').filter({ has: page.locator('svg') }).first().waitFor({ state: 'visible' });
    await dismissOnboarding(page);

    // Hamburger button should be visible (icon menu)
    const hamburger = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(hamburger).toBeVisible();

    // Click hamburger to open mobile sidebar drawer
    await hamburger.click();

    // Mobile sidebar navigation container should become visible
    const sidebarDrawer = page.locator('span:has-text("byline_")').locator('..').locator('..');
    await expect(sidebarDrawer).toBeVisible();

    // Close button inside mobile menu should close the menu
    const closeBtn = sidebarDrawer.locator('button').first();
    await closeBtn.click();
    await expect(sidebarDrawer).toBeHidden();
  });
});
