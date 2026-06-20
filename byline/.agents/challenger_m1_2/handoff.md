# Handoff Report — Challenger 2 (teamwork_preview_challenger)

This report details the empirical layout and functional verification of Milestone 1: R1 Navigation & Sidebar for the Byline dashboard.

---

## 1. Observations

### Code Audit Observations
- **`DashboardLayout.tsx` (lines 47-52)**: Keydown event handler is case-sensitive:
  ```typescript
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandPaletteOpen(prev => !prev);
    }
  };
  ```
- **`LeftSidebarNavigation.tsx` (lines 102-103)**: Active background uses a hardcoded color value instead of CSS accent variables:
  ```typescript
  background: isActive ? "rgba(232, 94, 44, 0.08)" : "transparent",
  borderLeft: `2px solid ${isActive ? "var(--by-accent)" : "transparent"}`,
  ```
- **`LeftSidebarNavigation.tsx` (lines 115-116)**: Hover background uses hardcoded opacity rather than the hover token:
  ```typescript
  e.currentTarget.style.color = "var(--by-text)";
  e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
  ```
- **`TopBar.tsx` (lines 72-82, 122, 253, 263)**: Hardcoded active/hover variables are scattered in style declarations:
  - Project Switcher hover: `background = "rgba(255,255,255,0.06)"`
  - Project Switcher active background: `rgba(232,94,44,0.08)`
  - Self-hosted badge: `background: "rgba(232,94,44,0.1)", color: "#E85E2C"`
  - Search trigger hover: `background = "rgba(255,255,255,0.03)"`
  - Run Log toggle active: `background: logOpen ? "rgba(232,94,44,0.12)" : "transparent"`, `color: logOpen ? "#E85E2C" : "var(--by-text-3)"`
  - Quick Publish button: `background: "#E85E2C"`, `color: "#F5F2EC"`
- **`DocsTab.tsx` (lines 22-24)**: The heading font overrides the global `'Space Grotesk'` token:
  ```typescript
  <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 600, margin: 0 }}>
    Documentation
  </h1>
  ```

### Build & Test Output Observations
1. **Build Success**: Spawning `npm run build` completed successfully:
   ```
   vite v6.3.5 building for production...
   ✓ 8418 modules transformed.
   built in 15.69s
   ```
2. **Test Runs**: Running `npx playwright test` yielded 10 passed and 3 failed tests (failures occurred strictly on the public Landing Page; all 10 Dashboard tests passed):
   - **Passed Dashboard Tests**:
     - `dashboard page has dark background` (body style matches `var(--by-bg)`)
     - `no blue accent on active sidebar state`
     - `active sidebar item uses orange, not blue` (verified active item colors are orange/amber)
     - `voice score chart: no unicode escape in label`
     - `milestone table: no rows with score 0`
     - `posts/week chart: no purple for X/Twitter`
   - **Failed Landing Page Tests**:
     - `navbar: full links visible at 1280px`: Expected finding of element `nav a:has-text("github")` failed since the GitHub CTA is placed outside the main Radix-based `<nav>` container.
     - `navbar: dark mode toggle is NOT between two CTA buttons`: Timed out waiting for `a:has-text("dashboard")` since there is no "dashboard" link on the public landing navbar.
     - `hero: no large gap between CTA buttons and trust badges`: Failed because the gap measured between the CTA buttons and the "Self-hostable" badge was `3920.67px` instead of `≤ 40px`.

---

## 2. Logic Chain

1. **Cmd+K Case Sensitivity**:
   - KeyboardEvent `e.key` returns `"K"` (uppercase) if the Shift key is pressed or Caps Lock is on, but `"k"` (lowercase) otherwise.
   - The condition `e.key === "k"` checks strictly for lowercase.
   - Therefore, Cmd+Shift+K or Cmd+K with Caps Lock active will fail to open the command palette.
   - *Recommendation*: Use `e.key.toLowerCase() === "k"`.

2. **Hardcoded Color Style Discrepancies**:
   - The token sheet `byline-tokens.css` defines the primary accent color as `--by-accent: #E85E2C` and the hover surface color as `--by-bg-3: #21262D`.
   - The inline styles in `LeftSidebarNavigation.tsx` and `TopBar.tsx` hardcode `#E85E2C` (hex format) and `rgba(232, 94, 44, ...)` (rgb format).
   - This prevents colors from updating dynamically if theme tokens change.
   - *Recommendation*: Use CSS variables: e.g. `var(--by-accent)` and `color-mix(in srgb, var(--by-accent) 8%, transparent)` or similar opacity tokens.

3. **Typography Token Override**:
   - `App.tsx` and `theme.css` define `Space Grotesk` as the display font for `h1, h2, h3`.
   - `DocsTab.tsx` overrides this by setting `fontFamily: "'Inter', sans-serif"` inline on the `h1` element.
   - *Recommendation*: Remove the inline `fontFamily` declaration from the header in `DocsTab.tsx` to inherit the correct global display font.

---

## 3. Caveats
- Landing page elements (Hero badge gaps, navbar CTA links) were not within the core review scope, though their failures were captured in the audit runner output.
- All testing was performed under a simulated headful/headless browser viewport environment via Playwright on a Windows host machine.

---

## 4. Conclusion
The dashboard components (`DashboardLayout.tsx`, `LeftSidebarNavigation.tsx`, `TopBar.tsx`, `DocsTab.tsx`) have robust structural boundaries and correct viewport-responsiveness controls. However, they suffer from case sensitivity in command palette keydown handlers, hardcoded values instead of proper CSS tokens for hover backgrounds and color states, and typography mismatches in `DocsTab.tsx`.

---

## 5. Verification Method

To verify these findings:
1. Run Vite build to ensure no TypeScript compiling regressions:
   ```bash
   npm run build
   ```
2. Spawn the Vite preview server:
   ```bash
   npx vite preview --port 5174
   ```
3. Run the audit specs:
   ```bash
   npx playwright test
   ```
4. Verify keydown behavior manually by focusing the dashboard and pressing `Caps Lock + Ctrl + K` to confirm it fails to trigger the command palette.
