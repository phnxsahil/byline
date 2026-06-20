# Handoff Report — Milestone 1 Navigation & Sidebar Verification

## 1. Observation
We reviewed the layout implementation across the dashboard components and executed the project build and playwright test scripts.

### 1.1 Command Execution and Test Failures
- **Build Command**: `npm run build` ran successfully:
  ```
  vite v6.3.5 building for production...
  ✓ built in 13.73s
  ```
- **Test Command**: `npx playwright test` failed 1 test:
  ```
  1) scripts\byline-audit.spec.ts:38:3 › Landing Page › navbar: full links visible at 1280px ───────
    Error: expect(locator).toBeVisible() failed
    Locator: locator('nav a:has-text("github")').first()
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
  ```
  All other 12 tests passed, including all of the dashboard specific tests.

### 1.2 Missing active state markup (`LeftSidebarNavigation.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\LeftSidebarNavigation.tsx`
- **Lines**: 86-94
- **Verbatim Code**:
  ```tsx
  <button
    key={tab.id}
    onClick={() => {
      onTabChange(tab.id);
      if (isMobile && onCloseMobile) {
        onCloseMobile();
      }
    }}
  ```
- **Consequence**: The standard accessibility attribute `aria-current="page"` is omitted. This bypasses the Playwright test `active sidebar item uses orange, not blue` (which queries using `[aria-current="page"]` and silently skips testing if no elements match).

### 1.3 Mobile layout overflow (`ChatPanel.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\ChatPanel.tsx`
- **Lines**: 156-161
- **Verbatim Code**:
  ```tsx
  return (
    <div style={{
      position: "fixed", top: 44, right: 0, bottom: 28, width: 400, zIndex: 60,
      background: "var(--by-bg-2)", borderLeft: "0.5px solid var(--by-border)",
      display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.3)",
      fontFamily: "'Inter', sans-serif",
    }}>
  ```
- **Consequence**: The panel has a fixed width of `400px` without mobile responsive scaling, causing layout overflow on standard mobile screens (<400px width).

### 1.4 Mobile layout compression (`RunLogPanel.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\RunLogPanel.tsx`
- **Line**: 121
- **Verbatim Code**:
  ```tsx
  <div style={{ position: "fixed", bottom: 28, left: 248, right: 0, height: "340px", background: "#0E0D0B", borderTop: "0.5px solid var(--by-border)", display: "flex", flexDirection: "column", zIndex: 45, fontFamily: "'IBM Plex Mono', monospace" }}>
  ```
- **Consequence**: The panel has `position: "fixed"`, `left: 248`, and `right: 0`. On small screen widths (e.g. mobile 375px), it is squeezed to a width of just `127px`, rendering it unusable.

### 1.5 Non-functional Keyboard Shortcut Label (`StatusBar.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\StatusBar.tsx`
- **Line**: 49
- **Verbatim Code**:
  ```tsx
  <button style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#E85E2C", background: "none", border: "none", cursor: "pointer", padding: 0 }}>⌘K</button>
  ```
- **Consequence**: Styled as an interactive button but lacks an `onClick` callback, meaning clicking it does nothing.

### 1.6 Case-sensitive Keydown Event Handler (`DashboardLayout.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\DashboardLayout.tsx`
- **Lines**: 47-52
- **Verbatim Code**:
  ```typescript
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandPaletteOpen(prev => !prev);
    }
  };
  ```
- **Consequence**: If the Caps Lock key is active or Shift is pressed, `e.key` resolves to `"K"` (uppercase) and the shortcut fails.

### 1.7 Mobile Menu State Leak (`DashboardLayout.tsx`)
- **File Path**: `D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\DashboardLayout.tsx`
- **Lines**: 97-99
- **Verbatim Code**:
  ```typescript
  useEffect(() => {
    if (isMobile) setMobileMenuOpen(false);
  }, [activeTab, isMobile]);
  ```
- **Consequence**: When the user rotates or resizes a device, going from mobile to desktop sets `isMobile` to `false`. Since the check only resets the state if `isMobile` is `true`, `mobileMenuOpen` stays `true` behind the scenes, and the menu pops open again if the viewport returns to mobile size.

### 1.8 Color Token Inconsistencies
- **Active selection background/borders** use different token values across files:
  - `CommandPalette.tsx` uses Amber (`#F0A500` / `rgba(240, 165, 0, 0.08)`):
    ```tsx
    backgroundColor: isSelected ? "rgba(240,165,0,0.08)" : "transparent",
    borderLeft: isSelected ? "2px solid #F0A500" : "2px solid transparent",
    ```
  - `LeftSidebarNavigation.tsx` uses Orange (`var(--by-accent)` / `#E85E2C` / `rgba(232, 94, 44, 0.08)`):
    ```tsx
    background: isActive ? "rgba(232, 94, 44, 0.08)" : "transparent",
    borderLeft: `2px solid ${isActive ? "var(--by-accent)" : "transparent"}`,
    ```

---

## 2. Logic Chain

1. **Observation 1.1** shows that landing page navigation test fails because of a missing element matching the `"github"` link in the navbar.
2. **Observation 1.2** demonstrates that the `[aria-current="page"]` selector is not present in the button markup of `LeftSidebarNavigation.tsx`. Therefore, the automated Playwright test `active sidebar item uses orange, not blue` (line 175) does not evaluate any elements because the selector returned `count: 0`.
3. **Observation 1.3** shows that `ChatPanel` has a hardcoded `width: 400`. Because mobile viewports are typically `320px` to `390px`, this panel is guaranteed to overflow horizontally or get clipped.
4. **Observation 1.4** shows `RunLogPanel` has `left: 248`. On a standard `375px` viewport, the width calculations resolve to `375 - 248 = 127px`, which is too small to fit the log lines.
5. **Observation 1.5** shows that the `⌘K` button in the status bar does not have any `onClick` logic or listener registered, which violates UI heuristics.
6. **Observation 1.6** checks for `e.key === "k"`. Since keyboard events return uppercase `"K"` when caps-lock is enabled or shift is active, the strict lowercase equality fails.
7. **Observation 1.7** shows the cleanup handler for `mobileMenuOpen` is skipped when `isMobile` changes to `false`. Hence, the menu visibility state is leaked on screen rotation/resizes.
8. **Observation 1.8** shows that different components use different semantic colors (`#F0A500` vs `#E85E2C`) to represent active selection and hover highlights.

---

## 3. Caveats
No caveats. All investigated files were fully reviewed, and the local dev server and test runner were executed.

---

## 4. Conclusion
While the dashboard layout compiles correctly (`npm run build`), there are seven core design, accessibility, interaction, and responsiveness flaws:
1. Missing `aria-current="page"` markup in sidebar links which masks accessibility issues and causes testing tool evasion.
2. Viewport-overflowing hardcoded width layout rules (`400px` on ChatPanel) and rigid left offsets (`248px` on RunLogPanel) that render poorly on mobile widths.
3. A dead `⌘K` label button in the status bar.
4. A case-sensitive keyboard handler for command palette triggers.
5. Leaked mobile menu drawer states upon viewport resize.
6. Color code differences (Orange vs Amber active styles) across layout elements.
7. An integration test failure on the landing page navbar.

---

## 5. Verification Method
To verify the issues:
1. Run `npm run build` in `byline` to ensure project building.
2. Run `npx vite --port 5174` in one process, then run `npx playwright test` to see the landing page failure.
3. Open `byline/src/app/components/dispatch/dashboard/LeftSidebarNavigation.tsx` and observe the lack of `aria-current` on line 86.
4. Set the browser viewport to `375px` width and observe the distorted widths of `ChatPanel` and `RunLogPanel`.
