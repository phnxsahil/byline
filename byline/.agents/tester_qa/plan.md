# Test Plan: Byline Dashboard Rebuild Smoke Testing

## Objective
Establish a Playwright smoke test suite in `scripts/dashboard-smoke.spec.ts` to verify the dashboard layout, sidebar navigation, simplified TopBar, command palette, and mobile responsiveness.

## Test Cases

### 1. Sidebar Navigation
- Verify the sidebar has a width of 232px.
- Verify 6 navigation items are displayed: "Overview", "The Desk", "Signal", "Activity", "Settings", "Docs".
- Click each navigation item and verify the active content view switches accordingly.
- Verify active navigation items exhibit the orange active styling (`--by-accent`).

### 2. Simplified TopBar
- Verify there are no centered navigation tabs in the TopBar.
- Verify the presence of:
  - Logo (`byline_`)
  - Project switcher dropdown
  - User avatar
  - Visible search pill containing "⌘K" or "Search"

### 3. Command Palette
- Trigger command palette via keyboard (`⌘K` or `Ctrl+K`) and click on the TopBar search shortcut.
- Verify list of fuzzy-matched destinations is shown.
- Verify unmatched queries display a "Dispatch: '{text}'" option/action or message.
- Verify pressing Escape closes the command palette.

### 4. Mobile Responsive Navigation
- Resize viewport to < 900px (e.g., 375px).
- Verify the mobile hamburger button is visible in the TopBar.
- Click the hamburger button and verify the sidebar navigation overlay opens.
- Click an item or the backdrop and verify it closes.

## Execution & Verification
1. Start the dev server if not already running.
2. Execute the smoke tests via `npx playwright test scripts/dashboard-smoke.spec.ts`.
3. Report any failures (e.g., unmatched dispatch fallback, missing doc headings) in a findings report.
