# Handoff Report — Milestone 1: R1 Navigation & Sidebar

## 1. Observation

- **Dashboard Layout File**: `src/app/components/dispatch/dashboard/DashboardLayout.tsx`
  - Lines 18-20:
    ```typescript
    const [activeTab, setActiveTab] = useState<DashTab>("overview");
    const [logOpen, setLogOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    ```
  - Lines 78-88:
    ```typescript
    <TopBar
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onPublish={handlePublish}
      onLandingClick={onLandingClick}
      logOpen={logOpen}
      onToggleLog={toggleLog}
      isRunning={isRunning}
      isMobile={isMobile}
      onMenuClick={() => setMobileMenuOpen(v => !v)}
    />
    ```
  - Lines 103-109:
    ```typescript
    {!isMobile && (
      <LeftPanel
        isRunning={isRunning}
        runningAgent={runningAgent}
        onRun={runPipeline}
      />
    )}
    ```

- **TopBar File**: `src/app/components/dispatch/dashboard/TopBar.tsx`
  - Lines 4-12:
    ```typescript
    export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings";

    const TABS: { id: DashTab; label: string }[] = [
      { id: "overview",  label: "Overview" },
      { id: "desk",      label: "The Desk" },
      { id: "signal",    label: "Signal" },
      { id: "activity",  label: "Activity" },
      { id: "settings",  label: "Settings" },
    ];
    ```
  - Lines 70-89: Center tabs on desktop:
    ```typescript
    {!isMobile && (
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 0 }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
              color: activeTab === tab.id ? "var(--by-text)" : "var(--by-text-2)",
              background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === tab.id ? "#E85E2C" : "transparent"}`,
              height: 44, padding: "0 14px", cursor: "pointer", whiteSpace: "nowrap",
              transition: "color 100ms",
            }}
            ...
          >
            {tab.label}
          </button>
        ))}
      </div>
    )}
    ```

- **LeftPanel File**: `src/app/components/dispatch/dashboard/LeftPanel.tsx`
  - Lines 78-79: Left panel style:
    ```typescript
    return (
      <div style={{ width: 248, flexShrink: 0, height: "100%", background: "var(--by-bg-2)", borderRight: "0.5px solid var(--by-border)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
    ```

- **Design Tokens**: `src/styles/byline-tokens.css`
  - Lines 6-25:
    ```css
    :root, [data-theme="dark"] {
      /* Backgrounds — match landing page dark mode */
      --by-bg:    #0F0F0D;  /* page background */
      --by-bg-2:  #1A1A18;  /* sidebar, cards, panels */
      --by-bg-3:  #21262D;  /* inputs, hovered rows, code blocks */

      /* Borders — use alpha like landing page */
      --by-border:  rgba(245,244,240,0.1);

      /* Text — warm white, alpha-based like landing page */
      --by-text:   #F5F4F0;  /* primary text */
      --by-text-2: rgba(245,244,240,0.6);  /* muted labels */
      --by-text-3: rgba(245,244,240,0.35);  /* timestamps, placeholders */

      /* Semantic colors */
      --by-accent: #E85E2C;
      --by-green:  #3FB950;
      --by-amber:  #F59E0B;
      --by-red:    #F87171;
    ```

- **Project Metadata & Plan**: `PROJECT.md`
  - Lines 4-15:
    ```markdown
    ## Architecture
    - **Framework**: Next.js 14 App Router layout (`src/app/components/dispatch/dashboard`)
    - **Layout Structure**: 
      - Left Sidebar Navigation (232px, `var(--by-bg-2)`, right border)
      - TopBar (simplified: logo, project switcher, `⌘K` shortcut button, avatar)
      - Right Agent Rail (collapsible: 56px collapsed / 280px expanded / fullscreen, animated)
      - Center Content Pane (renders active tab component: Overview, Desk, Signal, Activity, Settings, Docs)
    - **State Management**:
      - `activeTab` (`overview` | `desk` | `signal` | `activity` | `settings` | `docs`) managed in `DashboardLayout.tsx`
      ```

---

## 2. Logic Chain

1. From `PROJECT.md` Architecture, we see `activeTab` state in `DashboardLayout.tsx` needs to support `docs` in addition to the 5 existing tabs. This matches the 6 navigation items requested.
2. From the observation of `TopBar.tsx`, the center navigation tabs are currently rendered absolutely centered in the desktop TopBar. Removing them removes the top navigation tabs completely, preparing the layout to shift navigation to the Left Sidebar.
3. Repurposing `LeftPanel.tsx` to act as the new persistent 232px Navigation Sidebar allows us to render navigation links (Overview, Desk, Signal, Activity, Settings, Docs) on the left side of the dashboard, fulfilling the persistent sidebar requirement.
4. Implementing an active border highlight using `var(--by-accent)` (`#E85E2C`) on the active navigation item aligns the sidebar state visually with the Byline design token definitions in `byline-tokens.css`.
5. Adding the project switcher and the `⌘K` capsule button to `TopBar.tsx` satisfies the requirements for a simplified global header that maintains project context and search triggers.
6. The `isMobile` check (`innerWidth < 900`) is already present in `DashboardLayout.tsx`. Reusing the new `LeftPanel` (the Left Sidebar Navigation) inside a fixed position drawer overlay when `isMobile && mobileMenuOpen` allows robust support for mobile viewports without duplicate component structures.

---

## 3. Caveats

- We assumed that all existing contents inside `LeftPanel.tsx` (projects list, agent config, skills list, pipeline trace) are to be replaced by the navigation buttons in Milestone 1. Per `PROJECT.md` plans, the projects switcher will move to the TopBar, and the agent pipeline/customizations are planned to move into a right-side collapsible Agent Rail in Milestone 3. During Milestone 1, these left panel details will be removed to clear space for the new left sidebar navigation.
- No back-end API changes were investigated since this milestone concerns only frontend layout restructurings.

---

## 4. Conclusion

- The implementation of Milestone 1 (R1 Navigation & Sidebar) is highly actionable and scoped strictly to:
  1. `src/app/components/dispatch/dashboard/DashboardLayout.tsx` (state management, command palette listener, and mobile overlay drawer render).
  2. `src/app/components/dispatch/dashboard/TopBar.tsx` (simplification, removal of center tabs, adding project switcher and ⌘K button).
  3. `src/app/components/dispatch/dashboard/LeftPanel.tsx` (transformation from agent configuration pane to a persistent 232px navigation sidebar).
- Design variables from `byline-tokens.css` (specifically `--by-accent`, `--by-bg-2`, and `--by-border`) must be strictly applied.

---

## 5. Verification Method

- Run the client development server:
  `npm run dev` or `vite` (approved command line runner).
- Inspect the visual structure on desktop (width > 900px):
  - Verify left sidebar is exactly `232px` wide, has a right border matching `var(--by-border)`, and renders the 6 items.
  - Verify active tab has a left border matching `var(--by-accent)` and a background matching `rgba(232, 94, 44, 0.08)`.
  - Verify `TopBar` displays the project switcher next to the logo and a capsule search button with `⌘K` next to the avatar.
  - Press `⌘K` (or `Ctrl+K`) and check that the Command Palette modal opens.
- Inspect the visual structure on mobile (resize viewport below 900px):
  - Verify the Left Sidebar collapses and disappears.
  - Verify clicking the hamburger button slides in/opens the mobile overlay drawer displaying the Left Sidebar.
  - Verify clicking a tab in the drawer changes the active view and closes the drawer.
