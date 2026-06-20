# Handoff Report — Dashboard Rebuild Investigation

## 1. Observation
- **Navigation State**: `DashboardLayout.tsx` (line 18) uses `const [activeTab, setActiveTab] = useState<DashTab>("overview");` and maps tabs via `renderTab()` (lines 62-70) using a switch-case statement.
- **TopBar Tabs**: `TopBar.tsx` (lines 70-89) renders centered tab buttons based on `TABS` array:
  ```tsx
  {TABS.map(tab => (
    <button key={tab.id} onClick={() => onTabChange(tab.id)} ...>
      {tab.label}
    </button>
  ))}
  ```
- **Numeric Simulation**: `DashboardLayout.tsx` (lines 33-49) runs `runPipeline()` using a simple interval that increments a number state `runningAgent` from `0` to `4`:
  ```tsx
  const interval = setInterval(() => {
    i++;
    if (i >= 5) {
      clearInterval(interval);
      setIsRunning(false);
      setRunningAgent(0);
    } else {
      setRunningAgent(i);
    }
  }, 1800);
  ```
- **Static Agent Descriptions**: `LeftPanel.tsx` (lines 9-15) hardcodes agent metadata:
  ```tsx
  const AGENTS = [
    { num: "01", name: "Strategist",      sub: "Angle + platform selection", icon: IconBrain },
    { num: "02", name: "LinkedIn Writer", sub: "Narrative, long-form",        icon: IconBrandLinkedin },
    ...
  ];
  ```
- **CSS Variable Tokens**: `src/styles/byline-tokens.css` defines the tokens under `:root, [data-theme="dark"]` using custom properties like `--by-bg: #0F0F0D;` and `--by-accent: #E85E2C;`.
- **Mock Responses**: `ChatPanel.tsx` (lines 31-37) fakes responses via the static `RESPONSES` object mapping keys like `strategist` to hardcoded strings.

---

## 2. Logic Chain
1. **R1 Navigation (Sidebar replacing TopBar)**: Since the horizontal centered tabs in `TopBar.tsx` limit expansion and clutter the header, moving them to a dedicated 232px sidebar-nav layout is required. This means centered buttons in `TopBar.tsx` must be removed, and a sidebar rendering all 6 items (including the new Docs view) must be created.
2. **R2 Command Palette Nerve Center**: In `CommandPalette.tsx`, the search is currently isolated to navigations and has simple fuzzy matching. By adding a fallback check for query mismatches, the palette can serve as the primary pipeline dispatch trigger by invoking `runPipeline(query)`.
3. **R3 Agent Rail**: The existing `ChatPanel` operates as a floating overlay on the right. Replacing it with a persistent, collapsible right-side column with three states (`collapsed` | `expanded` | `fullscreen`) improves UI space management. The collapsed state (56px) needs 5 status dots corresponding to the 5 agents.
4. **R4/R7 Observability & Simulation Trace**: The current numeric index increment (`runningAgent`) provides no input context, reasoning steps, or decision-level details to the UI. Upgrading the simulation loop to yield structured `AgentStep` objects ensures the trace view in `ActivityTab` and the reasoning details in the `AgentRail` can render actual agentic execution data.
5. **R5 Settings Grouping**: The settings panel is currently a flat list of form fields and tables. Reorganizing these into 5 logical categories (Connect, Voice & Brand, Pipeline Behavior, API & Developer, Danger Zone) with a sub-nav layout simplifies configuration.
6. **R6 Docs Tab**: The 3-step Quick Start code block in `LeftPanel` is currently out of place for a navigation-first sidebar. Moving it to a dedicated `DocsTab` with an SVG pipeline flowchart completes the onboarding loop.

---

## 3. Caveats
- **No Implementation**: As a read-only investigation, no code modifications were made. The implementation steps are described as a design plan only.
- **Mock Backend Limits**: The simulation mimics an asynchronous SSE stream. Swapping in a real backend later will depend on how the database state matches the generated mock traces.

---

## 4. Conclusion
Restructuring Byline into an "Agent Command Center" requires replacing `LeftPanel` with a left sidebar navigation and a right `AgentRail` panel. The core of this transition is upgrading the pipeline simulation state from simple numbers to structured `AgentStep` objects, allowing components like the new Decision Trace view in `ActivityTab` and the details disclosures inside `AgentRail` to render inspectable steps.

---

## 5. Verification Method
- **Inspected Files**:
  - `src/app/components/dispatch/dashboard/DashboardLayout.tsx`
  - `src/app/components/dispatch/dashboard/LeftPanel.tsx`
  - `src/app/components/dispatch/dashboard/TopBar.tsx`
  - `src/app/components/dispatch/dashboard/SettingsTab.tsx`
  - `src/app/components/dispatch/CommandPalette.tsx`
  - `src/styles/byline-tokens.css`
- **Verification of Restructuring**:
  - Check `analysis.md` in the working directory for detailed restructure steps.
  - Invalidation condition: Modifying CSS token names in `byline-tokens.css` will break variables across all redesigned layouts.
