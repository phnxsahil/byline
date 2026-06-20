# Byline Navigation & Sidebar Layout Analysis

This document provides a detailed technical analysis of Byline's current dashboard layout, navigation system, design tokens, and responsiveness. It serves as the foundation and implementation strategy for the worker agent to implement **Milestone 1: R1 Navigation & Sidebar**.

---

## 1. Current Codebase Status & Findings

### 1.1 Layout Structure & Tab Management (`DashboardLayout.tsx`)
- **Container**: `DashboardLayout` manages a full-viewport flex column backgrounded with `var(--by-bg)` (`#0F0F0D`).
- **State Management**:
  - `activeTab`: Maintained as local state using `const [activeTab, setActiveTab] = useState<DashTab>("overview");`.
  - `DashTab` type: Currently supports `"overview" | "desk" | "signal" | "activity" | "settings"`. It does *not* support `"docs"` yet.
  - Collapsibles: `logOpen` (RunLogPanel) and `chatOpen` (ChatPanel) are managed via boolean flags.
  - Responsiveness: `isMobile` is updated via a resize listener:
    ```typescript
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 900);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
    ```
- **Desktop Layout (`!isMobile`)**:
  - Header: Renders `<TopBar>` spanning 100% width.
  - Workspace Area: Flex row (`flex: 1`, `display: "flex"`) containing:
    - `<LeftPanel>`: Replaced on desktop with a fixed width of `248px` to manage projects list, agent pipeline, agent configuration/skills, and quick start commands.
    - Active Tab: Renders `{renderTab()}`.
    - `<RunLogPanel>`: A right-side collapsible terminal log.
    - `<ChatPanel>`: A floating assistant panel.
  - Footer: Renders `<StatusBar>`.

### 1.2 TopBar Component (`TopBar.tsx`)
- **Role**: Serves as the dashboard header, which is currently overloaded with centered tab buttons.
- **Centered Tabs**: Renders desktop centered tabs via a hardcoded `TABS` array:
  ```typescript
  const TABS: { id: DashTab; label: string }[] = [
    { id: "overview",  label: "Overview" },
    { id: "desk",      label: "The Desk" },
    { id: "signal",    label: "Signal" },
    { id: "activity",  label: "Activity" },
    { id: "settings",  label: "Settings" },
  ];
  ```
- **Header Elements**:
  - Left: macOS window control dots, logo button (`byline_`), and `"self-hosted"` badge.
  - Center: Centered desktop navigation tab buttons.
  - Right Actions: Run log toggle (terminal icon), publish button ("log dispatch" / "Run"), and user avatar (`boring-avatars`).

### 1.3 LeftPanel Component (`LeftPanel.tsx`)
- **Status**: It functions as an agent-control panel rather than a navigation sidebar.
- **Contents**:
  - Projects switcher/list (`DEFAULT_PROJECTS`).
  - Active project description & stack details.
  - Visual agent pipeline indicator (Strategist, Writers, Critic) with simulation run trigger.
  - Agent config toggles (Platform filters, voice strength, critic floor, post frequency).
  - Agent skill toggles (Storyteller mode, Thread architect, etc.).
  - Quick Start self-host guide containing terminal copy commands.

### 1.4 Design Tokens & Typography
- **Design Stylesheet (`byline-tokens.css`)**:
  - Main background: `--by-bg` (`#0F0F0D`) matches the warm dark editorial theme.
  - Container background: `--by-bg-2` (`#1A1A18`) for cards, panels, and sidebars.
  - Highlight background: `--by-bg-3` (`#21262D`) for hovered rows, active elements, inputs, and code blocks.
  - Border color: `--by-border` (`rgba(245,244,240,0.1)`).
  - Accent/Primary Brand color: `--by-accent` (`#E85E2C` - warm rust-orange).
  - Semantic Status:
    - Success/Done: `--by-green` (`#3FB950`)
    - Warning: `--by-amber` (`#F59E0B`)
    - Error/Blocked: `--by-red` (`#F87171`)
- **Typography (`fonts.css`)**:
  - Wordmark/Logo: `Space Grotesk`.
  - Body Copy & Navigation: `Inter`.
  - Code blocks, timestamps, and shortcut keys: `IBM Plex Mono` (or `JetBrains Mono`).

---

## 2. Recommended Re-architecture

To implement the navigation and sidebar layout specified in **Milestone 1**, the following layout changes must be made:

### 2.1 Navigation & Tab Type Update
1. Update `DashTab` type inside `TopBar.tsx` (or a shared types file) to include `"docs"`:
   ```typescript
   export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";
   ```
2. Update the tabs array to have 6 items:
   ```typescript
   export const NAV_ITEMS = [
     { id: "overview", label: "Overview", icon: IconLayoutDashboard },
     { id: "desk", label: "Desk", icon: IconInbox },
     { id: "signal", label: "Signal", icon: IconBolt },
     { id: "activity", label: "Activity", icon: IconActivity },
     { id: "settings", label: "Settings", icon: IconSettings },
     { id: "docs", label: "Docs", icon: IconBookOpen }
   ];
   ```
3. Update `renderTab()` in `DashboardLayout.tsx` to handle `"docs"`:
   - Import `DocsSection` (from `src/app/components/dispatch/DocsSection.tsx` or build a new `DocsTab` component).
   - Render it inside the dashboard container:
     ```typescript
     case "docs": return <DocsSection />;
     ```

### 2.2 Create a Persistent Left Sidebar Component (`Sidebar.tsx`)
Create a new Sidebar component (or replace `LeftPanel.tsx` entirely if all its config blocks are migrated) that features:
- **Dimensions**: Fixed width of `232px`.
- **Styling**: Background `var(--by-bg-2)`, right border `0.5px solid var(--by-border)`.
- **Navigation Buttons**:
  - Vertical stack of the 6 items.
  - Active state: Left border `2px solid var(--by-accent)` (`#E85E2C`), text/icon color `var(--by-text)` (`#F5F4F0`).
  - Inactive state: Left border `2px solid transparent`, text/icon color `var(--by-text-2)`.
  - Font: `Inter` (sans-serif), 13px, weight 500 when active, 400 when inactive.
  - Hover state: Text transitions to `var(--by-text)`.
- **Transitioning out LeftPanel elements**:
  - Project switcher: moves to the dropdown in `TopBar`.
  - Platform/Skills/Config options: move to `SettingsTab` under Group 4.3 (Pipeline Behavior) and 4.2 (Voice & Brand).
  - Quick Start code block: moves to the Docs tab.

### 2.3 Simplify TopBar
- **Centering Tabs**: Remove the absolute centered tabs container `{!isMobile && ( <div style={{ position: "absolute", ... }}> ... </div> )}`.
- **Project Switcher Dropdown**:
  - Lift the project list state (`projects`, `activeProject`) up to `DashboardLayout.tsx`.
  - Add a dropdown element in `TopBar` showing the current active project name (e.g. `fltrd.tech`) and a dropdown arrow (`IconChevronDown`).
  - Selecting another project updates the active project state.
- **⌘K Command Palette Shortcut Button**:
  - Place a text/keyboard shortcut pill next to the project switcher in `TopBar`:
    ```tsx
    <button onClick={onPaletteTrigger} style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "rgba(255,255,255,0.03)", border: "0.5px solid var(--by-border)",
      borderRadius: 4, padding: "3px 8px", cursor: "pointer",
      color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10
    }}>
      <span>Search</span>
      <kbd style={{ background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: 2 }}>⌘K</kbd>
    </button>
    ```

### 2.4 Mobile Menu & Collapse Under 900px
- Ensure the sidebar behaves responsively:
  - **Desktop (`!isMobile`)**: The `232px` sidebar is persistent and sits on the left.
  - **Mobile (`isMobile`)**:
    - Sidebar is hidden by default.
    - When `mobileMenuOpen` is true, render a backdrop `fixed` overlay, along with a `fixed` drawer containing the Sidebar (slid in from the left).
    - Style code example for mobile menu drawer in `DashboardLayout.tsx`:
      ```tsx
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)"
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0, width: 232, zIndex: 100,
              backgroundColor: "var(--by-bg-2)", borderRight: "1.5px solid var(--by-border)",
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
              animation: "sidebarSlideIn 200ms ease-out"
            }}
          >
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}
      ```
    - Keyframe animation `sidebarSlideIn` should be added to slide from `translateX(-100%)` to `translateX(0)`.

---

## 3. Step-by-Step Modification Strategy for the Worker

The implementer should execute the task using the following steps:

1. **Step 1: Update Types and State in Layout**
   - In `TopBar.tsx`, update the `DashTab` type to:
     `export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";`
   - In `DashboardLayout.tsx`, lift project state from `LeftPanel.tsx` by importing `listProjects` from `../../api` (or using a mock array if API is offline), and maintaining:
     `const [projects, setProjects] = useState<Project[]>([]);`
     `const [activeProject, setActiveProject] = useState<Project | null>(null);`

2. **Step 2: Implement the Sidebar Component**
   - Create `src/app/components/dispatch/dashboard/Sidebar.tsx`.
   - Implement the `232px` layout with the 6 navigation items.
   - Use the design tokens for active/inactive state (left border accent, warm white text).
   - Render it adjacent to the content container in `DashboardLayout.tsx` when `!isMobile`.

3. **Step 3: Integrate Command Palette & Trigger**
   - In `DashboardLayout.tsx`, maintain `paletteOpen` state.
   - Wire up `CommandPalette` component (already in `src/app/components/dispatch/CommandPalette.tsx`) to render in the layout.
   - Add keyboard shortcut listener for `Cmd+K` / `Ctrl+K`.
   - Update `TopBar.tsx` to display the "Search ⌘K" shortcut button and wire its `onClick` to trigger the palette.
   - Expand `CommandPalette` usage to match the 6 dashboard tabs. Add the dynamic freeform fallback action:
     `Dispatch: "{typed text}"` which calls the dispatch trigger.

4. **Step 4: Clean up and Simplify TopBar**
   - Remove the desktop centered tabs from `TopBar.tsx`.
   - Add the project switcher dropdown in `TopBar.tsx`, rendering the project list passed down from `DashboardLayout.tsx`.
   - Ensure the layout of the top bar handles spacing cleanly (Left: Traffic lights/Logo, Center-Left: Project Switcher & ⌘K button, Right: Run log, Run button, Avatar).

5. **Step 5: Implement Mobile Drawer & Styling**
   - Configure the responsive drawer overlay in `DashboardLayout.tsx` for `< 900px` screens.
   - Hook the hamburger button click in mobile `TopBar` to toggle `mobileMenuOpen` state.
   - Add CSS keyframe slide-in styles to `src/app/components/dispatch/animations.css`.

6. **Step 6: Integrate Docs Tab**
   - Add the `docs` tab case in `DashboardLayout`'s render function, drawing from `DocsSection` (or adapting it to the dashboard view).
