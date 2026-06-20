## 2026-06-19T16:28:00Z
You are the Worker (teamwork_preview_worker) for Milestone 1: R1 Navigation & Sidebar.
Your working directory is D:\Projects\dispatch\byline\.agents\worker_m1_1\.
Please implement the following changes in the Byline workspace (D:\Projects\dispatch\byline):

1. **Create DocsTab placeholder**:
   Create a new file `src/app/components/dispatch/dashboard/DocsTab.tsx` with a placeholder view for documentation.
2. **Create LeftSidebarNavigation component**:
   Create `src/app/components/dispatch/dashboard/LeftSidebarNavigation.tsx` that replaces LeftPanel for navigation. Width: 232px. BG: var(--by-bg-2). Border-right: 0.5px solid var(--by-border).
   Support 6 tabs: Overview, Desk, Signal, Activity, Settings, Docs.
   Active border: left 2px solid var(--by-accent). Inactive text: var(--by-text-2), hover/active text: var(--by-text). Active background: rgba(232, 94, 44, 0.08) or similar dark orange tint.
   Should support mobile close button when `isMobile` is true.
3. **Modify TopBar**:
   Modify `src/app/components/dispatch/dashboard/TopBar.tsx` to:
   - Remove centered horizontal tabs.
   - Add a project switcher dropdown next to the logo. Display avatar (using `boring-avatars`) and project name. Clicking outside closes the dropdown.
   - Add a visible ⌘K shortcut button styled with IBM Plex Mono for the keyboard hint.
4. **Modify DashboardLayout**:
   Modify `src/app/components/dispatch/dashboard/DashboardLayout.tsx` to:
   - Extend `DashTab` type to include "docs".
   - Render `LeftSidebarNavigation` instead of the old LeftPanel on desktop.
   - Add keydown event listener for Cmd+K / Ctrl+K to open CommandPalette.
   - Integrate the existing `CommandPalette` component with commands (navigate to tabs, run pipeline, toggle logs, toggle chat).
   - Support mobile view (<900px wide): persistent sidebar is hidden, clicking TopBar hamburger toggles drawer overlay for sidebar navigation with a blurry dark backdrop (rgba(0,0,0,0.55), backdrop-filter blur). Choosing a tab closes the drawer and navigates.
   - Lift projects list state (DEFAULT_PROJECTS) and activeProject selection state, passing them to TopBar.
5. **Compilation Verification**:
   Verify the build succeeds by running the frontend build command (e.g. `npm run build` or `npm run typecheck` or standard tools).
