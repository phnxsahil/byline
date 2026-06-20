# Analysis Report — R1 Navigation & Sidebar Investigation

## 1. Current Layout Structure and State Management

### 1.1 Dashboard Layout Architecture
The dashboard is managed by `DashboardLayout.tsx` (located at `src/app/components/dispatch/dashboard/DashboardLayout.tsx`). It defines the core page structure using inline flex styles:
- **Root Element**: A column flexbox spanning `100vh` with `background: "var(--by-bg)"` and `color: "var(--by-text)"`.
- **TopBar**: Rendered at the top of the container.
- **Main Pane Container**: A flex row (`flex: 1`, `display: "flex"`) that hosts:
  - **LeftPanel**: The current left-side sidebar (248px) displaying workspace details (Projects list, Agent Pipeline progress, Agent Config sliders, Agent Skills toggles, and Quick Start commands).
  - **Tab Content**: Renders the active tab component dynamically using `renderTab()`.
  - **Overlays**: `RunLogPanel` (anchored bottom-left) and `ChatPanel` (anchored right) are overlay panels controlled by state toggles.
- **StatusBar**: A thin bar (28px) docked at the bottom of the window.

### 1.2 State and Routing
- **Active Tab State**: `activeTab` is defined as `useState<DashTab>("overview")` in `DashboardLayout.tsx`.
- **Tab Types**: `DashTab` is imported from `TopBar` and currently supports: `"overview" | "desk" | "signal" | "activity" | "settings"`.
- **Tab Rendering**: Managed by a `switch(activeTab)` block in `renderTab()` mapping tabs to components:
  - `overview` -> `<OverviewTab>`
  - `desk` -> `<DeskTab>`
  - `signal` -> `<SignalTab>`
  - `activity` -> `<ActivityTab>`
  - `settings` -> `<SettingsTab>`
- **TopBar Interaction**: Center tabs in the `TopBar` component trigger navigation by invoking `onTabChange(tabId)` which updates the parent layout state.

---

## 2. Design Tokens Analysis

### 2.1 CSS Variables in `byline-tokens.css`
The tokens in `src/styles/byline-tokens.css` align the dashboard style with the main landing page dark mode theme (`#0F0F0D` background):
- **Backgrounds**:
  - `--by-bg`: `#0F0F0D` (main page background)
  - `--by-bg-2`: `#1A1A18` (used for card surfaces, sidebar, and panels)
  - `--by-bg-3`: `#21262D` (elevated background for inputs, hover states, code blocks)
- **Borders**:
  - `--by-border`: `rgba(245, 244, 240, 0.1)` (semi-transparent white border)
- **Text**:
  - `--by-text`: `#F5F4F0` (primary text, warm white)
  - `--by-text-2`: `rgba(245, 244, 240, 0.6)` (secondary/muted text)
  - `--by-text-3`: `rgba(245, 244, 240, 0.35)` (tertiary text/placeholder)
- **Accent and Semantic Colors**:
  - `--by-accent`: `#E85E2C` (amber-orange primary brand accent)
  - `--by-green`: `#3FB950` (success/done state)
  - `--by-amber`: `#F59E0B` (warnings/flagged state)
  - `--by-red`: `#F87171` (errors/critical alert state)

### 2.2 Fonts in `fonts.css`
- Google Fonts imports are defined in `src/styles/fonts.css` for:
  - `Space Grotesk` (headings/branding/logo)
  - `IBM Plex Sans` (default sans body/UI text)
  - `IBM Plex Mono` / `JetBrains Mono` (monospace code & stamps)
- In the CSS layers:
  - Headings (`h1`, `h2`, `h3`) utilize `'Space Grotesk'`
  - Monospace labels use `fontFamily: "'IBM Plex Mono', monospace"`
  - Body and standard UI buttons use `'Inter'` or `'IBM Plex Sans'`

---

## 3. Left Sidebar Navigation Design & Implementation

To satisfy the requirements of Milestone 1, the left panel (currently `LeftPanel.tsx` rendering agent info) should be rewritten or replaced with a persistent, navigation-dedicated sidebar:
- **Dimensions**: Constant width of `232px` (`width: 232, minWidth: 232`).
- **Styling**: `background: "var(--by-bg-2)"`, border-right: `1px solid var(--by-border)`.
- **Navigation Items**:
  - Renders 6 navigation buttons: **Overview**, **Desk**, **Signal**, **Activity**, **Settings**, and **Docs**.
  - Uses `@tabler/icons-react` icons for each item:
    - Overview: `IconLayoutDashboard`
    - Desk: `IconTerminal2` (or `IconEdit`)
    - Signal: `IconBolt` (or `IconRss`)
    - Activity: `IconActivity` (or `IconClock`)
    - Settings: `IconSettings` (or `IconAdjustments`)
    - Docs: `IconBook` (or `IconNotebook`)
- **Active State Highlights**:
  - Left border active indicator: `borderLeft: active ? "2px solid var(--by-accent)" : "2px solid transparent"`
  - Subtle background fill: `background: active ? "rgba(232, 94, 44, 0.08)" : "transparent"`
  - Text color: active is `var(--by-text)` (warm white); inactive is `var(--by-text-2)` (muted); hover is `var(--by-text)`.
  - Font styling: `fontFamily: "'Inter', sans-serif"`, size `13px`, weight `500` if active.

---

## 4. TopBar Simplification Design & Implementation

The `TopBar.tsx` should be modified to focus on identity, context, and global search:
- **Remove Centered Tabs**: Delete the absolute-centered nav links block. Navigation moves to the left sidebar.
- **Add Project Switcher Dropdown**:
  - Fetches the project list dynamically using `listProjects()` from `api.ts`.
  - Positioned next to the `byline_` logo.
  - Clicking the switcher button shows a dropdown panel (`background: "var(--by-bg-2)"`, `border: "1px solid var(--by-border)"`) containing all projects (with their boring-avatars).
  - Selecting a project updates the layout-level active project state.
- **Add ⌘K Shortcut Button**:
  - Positioned on the right side of `TopBar` next to the avatar.
  - A clean capsule button showing `Search... ⌘K` to open the Command Palette.
  - Toggling state triggers a callback `onSearchClick`.
- **Keep Avatar**: Avatar stays on the right side.

---

## 5. Mobile Menu Collapsing

- **Width Threshold**: Resizes dynamically under `900px` (`isMobile = window.innerWidth < 900`).
- **Sidebar Collapsing**:
  - On desktop, Left Sidebar is rendered in the flex container.
  - On mobile, Left Sidebar is hidden from the main view layout.
  - Clicking the hamburger icon in TopBar opens a mobile menu drawer.
- **Mobile Menu Drawer**:
  - Renders a fixed overlay with a semi-transparent dark backdrop:
    `position: "fixed", inset: 0, zIndex: 99, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)"`.
  - Nested inside the backdrop is the `LeftPanel` navigation sidebar component styled as a drawer:
    `width: 232, height: "100%", backgroundColor: "var(--by-bg-2)"`.
  - Clicking a link navigates to the tab and automatically closes the mobile menu drawer.

---

## 6. Recommended Implementation Strategy for the Worker

### Step 1: Update API imports and State in `DashboardLayout.tsx`
1. Change `DashTab` union in `TopBar.tsx` (and re-export/import it) to include `"docs"`.
2. Add layout-level states in `DashboardLayout.tsx`:
   - `projects` list state (`Project[]`) and `activeProject` state (`Project | null`).
   - `paletteOpen` command palette toggle state (`boolean`).
3. Fetch projects on mount using `listProjects()`.
4. Register the global window `keydown` listener to toggle `paletteOpen` on `(metaKey || ctrlKey) && key === "k"`.
5. Import `DocsSection` in `DashboardLayout.tsx` and map `case "docs"` in `renderTab()` to return `<DocsSection />`.

### Step 2: Implement Left Sidebar Navigation in `LeftPanel.tsx`
1. Re-purpose `LeftPanel.tsx` (or replace its content entirely) to be the Left Sidebar Navigation.
2. Accept `activeTab` and `onTabChange` as props.
3. Render the 6 tabs with Tabler Icons and the active/hover borders and background colors.
4. Set container style: `width: 232, flexShrink: 0, height: "100%", background: "var(--by-bg-2)", borderRight: "1.5px solid var(--by-border)"`.

### Step 3: Simplify `TopBar.tsx` and Add Project Switcher & Search Button
1. Update `TopBarProps` to accept `projects`, `activeProject`, `onProjectChange`, and `onSearchClick`.
2. Remove the centered tabs rendering block.
3. Implement the dropdown state for the project switcher next to the logo.
4. Render a capsule search button with `⌘K` shortcut next to the avatar.

### Step 4: Integrate CommandPalette in `DashboardLayout.tsx`
1. Render `<CommandPalette>` at the root level of `DashboardLayout.tsx` passing `paletteOpen`, `setPaletteOpen(false)`, and navigation commands.
2. Define navigation commands that update `activeTab` state.

### Step 5: Support Mobile Drawer layout
1. Update `DashboardLayout.tsx` to render the Left Navigation Sidebar inside a drawer layout overlay if `isMobile && mobileMenuOpen`.
