import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
  test('Dashboard loads and displays core zones', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:5173/#dashboard');

    // Wait for the main layout to load
    await expect(page.locator('text=Agent Workspace')).toBeVisible({ timeout: 10000 });

    // Check if TopBar is rendered
    await expect(page.locator('text=[ b ] byline')).toBeVisible();

    // Check if SignalHub is rendered
    await expect(page.locator('text=GitHub Signals')).toBeVisible();

    // Check if FeedPanel is rendered
    await expect(page.locator('text=What did you ship today?')).toBeVisible();

    // Take a screenshot of the initial load
    await page.screenshot({ path: 'tests/screenshots/dashboard-initial.png' });
  });

  test('Settings overlay opens and closes', async ({ page }) => {
    await page.goto('http://localhost:5173/#dashboard');
    
    // Click settings button
    await page.click('button:has-text("Settings")');

    // Verify settings overlay is visible
    await expect(page.locator('h2:has-text("Workspace Settings")')).toBeVisible();

    // Verify API config tab is visible
    await expect(page.locator('h3:has-text("Backend Connection")')).toBeVisible();

    // Close settings
    await page.locator('button > svg.tabler-icon-x').click();
  });

  test('Analytics overlay opens and closes', async ({ page }) => {
    await page.goto('http://localhost:5173/#dashboard');
    
    // Click analytics button
    await page.click('button:has-text("Analytics")');

    // Verify analytics overlay is visible
    await expect(page.locator('h2:has-text("Performance Analytics")')).toBeVisible();

    // Close analytics
    await page.click('button:has-text("Close Analytics")');
  });

  test('Running an agent pipeline simulation', async ({ page }) => {
    await page.goto('http://localhost:5173/#dashboard');

    // Type a milestone in the input
    await page.fill('textarea[placeholder*="Ask the agents"]', 'just shipped dark mode support');

    // Press Send
    await page.keyboard.press('Enter');

    // Wait for the agent thinking state
    await expect(page.locator('text=Synthesizing')).toBeVisible();

    // Wait for the mock pipeline to finish and show Review Draft button
    await expect(page.locator('text=Review & Refine Draft →').first()).toBeVisible({ timeout: 15000 });

    // Click Review Draft to open Desk Drawer
    await page.locator('button:has-text("Review & Refine Draft →")').first().click();

    // Verify Desk Drawer opens
    await expect(page.locator('text=The Desk')).toBeVisible();

    // Verify Drafts are loaded
    await expect(page.locator('text=Platform Drafts')).toBeVisible();

    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-pipeline-done.png' });
  });
});
