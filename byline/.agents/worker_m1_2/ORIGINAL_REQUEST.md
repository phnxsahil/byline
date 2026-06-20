## 2026-06-19T16:37:35Z
You are the Worker (teamwork_preview_worker) for Milestone 1 Fixes.
Your working directory is D:\Projects\dispatch\byline\.agents\worker_m1_2\.
Please apply the following quality, styling, and accessibility bug fixes to the Byline codebase:

1. **Fix hardcoded colors & opacities in TopBar.tsx**:
   Open `src/app/components/dispatch/dashboard/TopBar.tsx` and:
   - Replace `#E85E2C` with `var(--by-accent)`.
   - Replace `#F5F2EC` with `var(--by-text)`.
   - Replace `#C7501E` (hover color) with `color-mix(in srgb, var(--by-accent) 85%, black)`.
   - Replace `rgba(232,94,44,0.1)` with `color-mix(in srgb, var(--by-accent) 10%, transparent)`.
   - Replace `rgba(232,94,44,0.12)` with `color-mix(in srgb, var(--by-accent) 12%, transparent)`.
   - Replace `rgba(232,94,44,0.25)` with `color-mix(in srgb, var(--by-accent) 25%, transparent)`.
   - Replace `rgba(232,94,44,0.3)` with `color-mix(in srgb, var(--by-accent) 30%, transparent)`.

2. **Add keyboard accessibility and ARIA support to ProjectSwitcher in TopBar.tsx**:
   - In `ProjectSwitcher` component, add `aria-haspopup="listbox"`, `aria-expanded={open}`, `id="project-switcher-btn"`, and `aria-controls="project-switcher-menu"` to the main trigger button.
   - Add `role="listbox"`, `id="project-switcher-menu"`, and `aria-labelledby="project-switcher-btn"` to the dropdown container div.
   - Add `role="option"`, `id={`project-option-${i}`}`, and `aria-selected={activeProject === i}` to each project option button.
   - Add a `useEffect` inside `ProjectSwitcher` listening to keydown events when the dropdown is open: if the `Escape` key is pressed, set `open(false)`.

3. **Fix hardcoded opacity in LeftSidebarNavigation.tsx**:
   Open `src/app/components/dispatch/dashboard/LeftSidebarNavigation.tsx` and replace `rgba(232, 94, 44, 0.08)` on line 102 with `color-mix(in srgb, var(--by-accent) 8%, transparent)`.

4. **Fix keyboard shortcut & mobile menu resize bugs in DashboardLayout.tsx**:
   Open `src/app/components/dispatch/dashboard/DashboardLayout.tsx` and:
   - In the `Cmd+K`/`Ctrl+K` keydown event listener:
     - Check `e.key.toLowerCase() === "k"` to support Caps Lock.
     - Add a check to avoid intercepting keydowns when typing inside editable inputs: if `(e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).isContentEditable` is true, return early without calling `e.preventDefault()`.
   - Modify the sidebar cleanup effect:
     ```typescript
     useEffect(() => {
       setMobileMenuOpen(false);
     }, [activeTab, isMobile]);
     ```
     This ensures the menu properly closes on resize transitions and active tab switches.

5. **Fix DocsTab headings style override**:
   Open `src/app/components/dispatch/dashboard/DocsTab.tsx` and remove the hardcoded `fontFamily: "'Inter', sans-serif"` from the `h1` element style so that headings inherit the global typography correctly.

6. **Verify compilation & tests**:
   Confirm that `npm run build` compiles without errors and run Playwright tests to make sure all tests pass.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

When complete, create a handoff.md in your working directory and send a message back to the invoking sub-orchestrator.
