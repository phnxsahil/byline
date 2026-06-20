# Forensic Audit & Handoff Report — Milestone 1 Fixes

**Work Product**: Byline Frontend Dashboard (Milestone 1)  
**Profile**: General Project  
**Verdict**: CLEAN  

---

## 1. Forensic Audit Report

### Phase Results
* **Hardcoded output detection**: **PASS** — No fixed test outcomes, mocked assertion conditions, or bypass codes were found in the codebase.
* **Facade detection**: **PASS** — Interactive components (`ProjectSwitcher`, `LeftSidebarNavigation`, `TopBar`, and `CommandPalette`) are implemented with full React state logic (`useState`, `useEffect`, `useCallback`) and DOM event binding, rather than facade placeholders.
* **Pre-populated artifact detection**: **PASS** — No pre-populated result logs or mock test result files exist prior to runs.
* **Build and run**: **PASS** — Running `npm run build` compiles the application cleanly without errors.
* **Output verification**: **PASS** — Running the Playwright test suite (`npx playwright test`) executes and passes all 13 tests.
* **Dependency audit**: **PASS** — All dependencies are standard and aligned with the project scope.

### Evidence
- **Build Success Output**:
  ```
  vite v6.3.5 building for production...
  transforming...
  ✓ 6827 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                     1.37 kB │ gzip:   0.65 kB
  dist/assets/favicon-DV-5Y69N.svg    1.39 kB │ gzip:   0.54 kB
  dist/assets/index-5QDxtKtM.css     90.85 kB │ gzip:  15.06 kB
  dist/assets/index-palgSg16.js     826.07 kB │ gzip: 215.67 kB
  ✓ built in 10.30s
  ```

- **Playwright Test Runner Output**:
  ```
  Running 13 tests using 2 workers

  BROWSER CONSOLE: debug [vite] connecting...
  BROWSER CONSOLE: debug [vite] connected.
  BROWSER CONSOLE: info %cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools font-weight:bold
    ok  2 scripts\byline-audit.spec.ts:38:3 › Landing Page › navbar: full links visible at 1280px (2.3s)
    ok  1 scripts\console-check.spec.ts:3:1 › dump console errors (3.4s)
    ok  3 scripts\byline-audit.spec.ts:47:3 › Landing Page › navbar: hamburger appears and works at 375px (2.5s)
    ok  4 scripts\byline-audit.spec.ts:72:3 › Landing Page › navbar: dark mode toggle is NOT between two CTA buttons (1.7s)
    ok  5 scripts\byline-audit.spec.ts:89:3 › Landing Page › hero: no large gap between CTA buttons and trust badges (1.7s)
    ok  6 scripts\byline-audit.spec.ts:101:3 › Landing Page › problem section: label tight to headline (≤ 16px gap) (1.7s)
    ok  7 scripts\byline-audit.spec.ts:118:3 › Landing Page › problem section: all 4 cards same height (1.8s)
    ok  8 scripts\byline-audit.spec.ts:151:3 › Dashboard › dashboard page has dark background (1.7s)
    ok  9 scripts\byline-audit.spec.ts:169:3 › Dashboard › no blue accent on active sidebar state (1.6s)
    ok 10 scripts\byline-audit.spec.ts:174:3 › Dashboard › active sidebar item uses orange, not blue (1.6s)
    ok 11 scripts\byline-audit.spec.ts:191:3 › Dashboard › voice score chart: no unicode escape in label (1.5s)
    ok 12 scripts\byline-audit.spec.ts:197:3 › Dashboard › milestone table: no rows with score 0 (1.5s)
    ok 13 scripts\byline-audit.spec.ts:208:3 › Dashboard › posts/week chart: no purple for X/Twitter (1.6s)

    13 passed (23.3s)
  ```

---

## 2. Observation

1. **ProjectSwitcher (ARIA & Dismissal)**:
   - **File**: `src/app/components/dispatch/dashboard/TopBar.tsx` (lines 38–173)
   - **Escape Key Listener**: Implemented via `useEffect` tracking the `open` state, attaching a `keydown` handler on `document` and calling `setOpen(false)` on `"Escape"`. Handler cleanly unmounts.
   - **ARIA Compliance**: The button trigger includes `aria-haspopup="listbox"`, `aria-expanded={open}`, `aria-controls="project-switcher-menu"`. The dropdown container has `role="listbox"` and `aria-labelledby="project-switcher-btn"`. Dropdown items have `role="option"` and `aria-selected={activeProject === i}`.

2. **CSS Token Variables (TopBar & LeftSidebarNavigation)**:
   - **File**: `src/app/components/dispatch/dashboard/LeftSidebarNavigation.tsx` (lines 102–126)
     - Complies with tokens for active state using `color-mix(in srgb, var(--by-accent) 8%, transparent)` and `borderLeft: 2px solid var(--by-accent)`.
     - Inactive text maps to `var(--by-text-2)`.
     - Standard hover uses `rgba(255, 255, 255, 0.02)` for low-opacity white overlay.
   - **File**: `src/app/components/dispatch/dashboard/TopBar.tsx` (lines 76–169, 236–296)
     - Layout backgrounds and borders map correctly to `var(--by-bg-2)`, `var(--by-border)`, `var(--by-text)`.
     - We observed a hardcoded RGBA color `rgba(232,94,44,0.08)` at line 143 for the active project item background. Since `232, 94, 44` is the RGB format of the accent orange `#E85E2C`, it should ideally be refactored to `color-mix(in srgb, var(--by-accent) 8%, transparent)` for complete compliance.
     - Hardcoded hex values in `TopBar.tsx` are limited to the traffic light controls (`#FF5F57`, `#FF3B30`, `#FFBD2E`, `#FF9F0A`, `#28C840`, `#30D158`) and the custom colorful arrays passed to the third-party `boring-avatars` component.
     - Hardcoded white transparencies (`rgba(255, 255, 255, 0.03)` / `0.05` / `0.06`) are used for hover state overlays due to a lack of opacity/transparency tokens in `byline-tokens.css`.

3. **Keyboard Shortcut Filtering (Cmd+K / Ctrl+K)**:
   - **File**: `src/app/components/dispatch/dashboard/DashboardLayout.tsx` (lines 46–62)
   - **Caps Lock Support**: Uses `e.key.toLowerCase() === "k"` to capture capital `"K"` inputs generated when Caps Lock is active.
   - **Input Elements Bypass**: Explicitly checks `(e.target as HTMLElement).tagName` against `"INPUT"`, `"TEXTAREA"`, and checks `.isContentEditable`, returning early and bypassing the event handler.

4. **Mobile Menu State Cleanup**:
   - **File**: `src/app/components/dispatch/dashboard/DashboardLayout.tsx` (lines 104–106)
   - **Implementation**: Uses a `useEffect` hook listening to `[activeTab, isMobile]`, which triggers `setMobileMenuOpen(false)` whenever the active tab changes or the window is resized across the 900px breakpoint.

---

## 3. Logic Chain

1. **Authenticity of Logic**:
   - The implementation is checked under `development` integrity mode as specified in `ORIGINAL_REQUEST.md`. No prohibited cheating patterns (such as hardcoded test outcomes, dummy mock endpoints, or pre-calculated check states) were present.
   - All interactive UI flows are fully functional, managing states natively via React.

2. **Quality Compliance Check**:
   - Accessibility and dismissal behaviors in the `ProjectSwitcher` strictly conform to WAI-ARIA standards and UI specs.
   - Shortcut event capture features successfully support Caps Lock and correctly isolate inputs, preventing shortcuts from firing when typing in forms.
   - Mobile state resets are triggered reactively during window resize/tabs switching, avoiding layout overlay leaks.
   - CSS token variables are followed, although `rgba(232,94,44,0.08)` in `TopBar.tsx` is technically a hardcoded translation of the theme token color (`var(--by-accent)`). Under the lenient `development` mode, this is noted as a quality improvement rather than a strict integrity violation.

3. **Verification Command**:
   - Running Vite and Playwright locally proves that all tests (13/13) pass, confirming that both dashboard visual requirements and landing page regressions have been resolved.

---

## 4. Caveats

- Database migrations (`init.sql`), backend logic (`api/`), and agent prompt workflows were not audited as they are out-of-scope for the frontend UI Milestone 1.
- Audit is based on the local environment and the test criteria defined in `scripts/byline-audit.spec.ts`.

---

## 5. Verification Method

To replicate the audit findings:
1. Build the codebase:
   ```bash
   npm run build
   ```
2. Start the local server on port 5174:
   ```bash
   npx vite --port 5174
   ```
3. Run the Playwright test suite:
   ```bash
   npx playwright test
   ```
4. Confirm all 13 tests execute and pass.
