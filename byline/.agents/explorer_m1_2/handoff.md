# Handoff Report: Milestone 1 R1 Navigation & Sidebar Investigation

This handoff contains findings, design notes, and an implementation roadmap for the Worker to rebuild the Byline dashboard layout, sidebar, topbar, and mobile responsive collapsing.

---

## 1. Observation
1. **Layout Container & Tab State (`DashboardLayout.tsx`)**:
   - `activeTab` state controls page rendering:
     - Line 18: `const [activeTab, setActiveTab] = useState<DashTab>("overview");`
     - Line 62-70: `renderTab()` returns components for `"overview"`, `"desk"`, `"signal"`, `"activity"`, and `"settings"`.
   - Layout consists of `<TopBar>` followed by a row holding `<LeftPanel>` (on desktop) and the active tab component:
     - Line 103-109:
       ```tsx
       {!isMobile && (
         <LeftPanel
           isRunning={isRunning}
           runningAgent={runningAgent}
           onRun={runPipeline}
         />
       )}
       ```
2. **Top Bar Header (`TopBar.tsx`)**:
   - Tab definitions:
     - Line 4: `export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings";`
     - Line 6-12:
       ```typescript
       const TABS: { id: DashTab; label: string }[] = [
         { id: "overview",  label: "Overview" },
         { id: "desk",      label: "The Desk" },
         { id: "signal",    label: "Signal" },
         { id: "activity",  label: "Activity" },
         { id: "settings",  label: "Settings" },
       ];
       ```
   - Center navigation rendering:
     - Line 70-89: Centered navigation tabs button map (`{!isMobile && ... TABS.map(tab => ...)}`).
3. **Left Panel (`LeftPanel.tsx`)**:
   - Renders project selection list, agent visual state pipeline, agent config settings/skills toggles, and Quick Start guides.
4. **Style Variables (`byline-tokens.css`)**:
   - Backgrounds: `--by-bg` (`#0F0F0D`), `--by-bg-2` (`#1A1A18`), `--by-bg-3` (`#21262D`).
   - Borders: `--by-border` (`rgba(245,244,240,0.1)`).
   - Brand Accent: `--by-accent` (`#E85E2C`).
   - Status: `--by-green` (`#3FB950`), `--by-amber` (`#F59E0B`), `--by-red` (`#F87171`).
5. **Existing Helper Files**:
   - `src/app/components/dispatch/CommandPalette.tsx` is already built. It supports search input filtering and list selections.
   - `src/app/components/dispatch/DocsSection.tsx` is available and manages documentation pages layout and categories.

---

## 2. Logic Chain
1. **Transitioning to Persistent Sidebar**:
   - Currently, `LeftPanel` is shown on desktop as a fixed-width left block.
   - Since the v2 spec dictates replacing the 5-tab top bar with a persistent left sidebar containing 6 items (Overview, Desk, Signal, Activity, Settings, Docs), we should completely swap the `LeftPanel` with a new `Sidebar` component.
   - The settings, pipeline details, and quick start guides currently in `LeftPanel` should be moved to the Settings Tab, Agent Rail, and Docs Tab respectively.
2. **Tab and Type Updates**:
   - Since "Docs" is now a top-level tab in the left sidebar, the `DashTab` type in `TopBar.tsx` (or a global types file) must be extended to include `"docs"`.
   - The rendering switch case `renderTab()` in `DashboardLayout.tsx` must be updated to return the Docs component when `activeTab === "docs"`.
3. **Simplifying TopBar & Lift Project State**:
   - The top bar is currently cluttered with navigation. Removing centered tabs will clear layout space.
   - Since the project switcher will now reside in the TopBar instead of the sidebar or left panel, the active project state must be lifted out of the old left panel into `DashboardLayout.tsx` and fed into `TopBar` as props.
   - Adding a ⌘K button to the top bar provides an explicit, visible shortcut trigger for the existing `CommandPalette`.
4. **Implementing Mobile Collapsing**:
   - Currently, `DashboardLayout` toggles `isMobile` state at `900px` width.
   - On mobile, the new left sidebar needs to hide by default.
   - Triggering the hamburger icon in mobile `TopBar` should toggle a backdrop and slide the Left Sidebar out as an overlay menu drawer.

---

## 3. Caveats
- No LLM execution logic or graph state modifications were analyzed or checked since this task focuses strictly on UI Navigation & Sidebar Layout.
- It is assumed that the active project list is retrieved via `listProjects()` from `src/app/api.ts` or fits the local database schema.

---

## 4. Conclusion
The current dashboard layout can be updated to support the new sidebar-first structure by:
1. Extending `DashTab` type to include `"docs"` and mapping it in `DashboardLayout`'s rendering switch.
2. Removing centered navigation tabs from `TopBar.tsx`.
3. Creating a new `Sidebar` component of fixed width `232px` styled with design tokens.
4. Implementing a project dropdown switcher and ⌘K trigger button in `TopBar.tsx`.
5. Adding drawer overlay logic in `DashboardLayout.tsx` for mobile viewports below `900px`.

---

## 5. Verification Method
After implementation, verify the following:
1. **Desktop Viewport (> 900px)**:
   - Check that the Left Sidebar is persistent, is `232px` wide, and renders the 6 navigation items.
   - Hover and click tabs to ensure colors change (`--by-accent` left border active indicator, warm white text).
   - Ensure the TopBar has no centered tabs and contains the project switcher and ⌘K search button.
   - Verify that clicking ⌘K or pressing Cmd+K opens the command palette.
2. **Mobile Viewport (< 900px)**:
   - Check that the Left Sidebar collapses.
   - Verify that clicking the hamburger menu button in the mobile TopBar opens the sidebar drawer.
   - Clicking a sidebar item should close the mobile drawer and switch the active view.
3. **Build & Lint Checks**:
   - Run the frontend build command (e.g. `npm run build` or `next build`) in `apps/web` or `byline/` to verify no typescript/build compilation errors.

---

## 6. Remaining Work (Worker Roadmap)
1. Re-declare `DashTab` and the `NAV_ITEMS` array.
2. Create the `Sidebar.tsx` component in `src/app/components/dispatch/dashboard/`.
3. Re-structure `TopBar.tsx` (remove centered tabs, add project switcher dropdown, and ⌘K button).
4. Re-configure `DashboardLayout.tsx` to host the new `Sidebar`, handle lifted project state, integrate the command palette, and control mobile overlay rendering.
5. Create slide-in animation styles for the mobile sidebar drawer.
