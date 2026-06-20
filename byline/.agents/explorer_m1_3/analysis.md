# Byline Milestone 1 Analysis: R1 Navigation & Sidebar

This report outlines the layout architecture and styles of the Byline dashboard, analyzing how to replace the legacy navigation tab buttons with a persistent left sidebar and simplify the `TopBar` per the Milestone 1 requirements.

---

## 1. Current Status & Existing Files

### 1.1 Layout Structure & activeTab State
- **File**: `byline/src/app/components/dispatch/dashboard/DashboardLayout.tsx`
  - Manages `activeTab` using a state hook: `const [activeTab, setActiveTab] = useState<DashTab>("overview");`.
  - Supports 5 tabs: `"overview" | "desk" | "signal" | "activity" | "settings"`.
  - Content routing is handled via a `switch` on `activeTab` inside a `renderTab()` function.
  - Sub-panels `LeftPanel` (desktop-only), `RunLogPanel` (fixed bottom overlay), and `ChatPanel` (fixed right overlay) are rendered alongside the active tab.
  - Mobile collapsing: tracks window resize (`isMobile` when `< 900px`). On mobile, the `LeftPanel` is hidden, and clicking the TopBar hamburger menu sets `mobileMenuOpen` to `true`, rendering a blank full-screen click-to-dismiss overlay.

### 1.2 Global Styles & Design Tokens
- **File**: `byline/src/styles/byline-tokens.css`
  - Defines dashboard specific colors using standard alpha-based custom properties:
    - Page background: `--by-bg: #0F0F0D` (landing page dark tone).
    - Sidebar / Elev. panels background: `--by-bg-2: #1A1A18`.
    - Input fields / hovers: `--by-bg-3: #21262D`.
    - Borders & dividers: `--by-border: rgba(245,244,240,0.1)`.
    - Warm white text: `--by-text: #F5F4F0`.
    - Accent: `--by-accent: #E85E2C` (orange/amber tint used in buttons, active lines, and status indicators).
- **File**: `byline/src/styles/fonts.css`
  - Imports fonts: `Space Grotesk` (display, headings, branding), `IBM Plex Sans` (body), `IBM Plex Mono` (code, tags, logs), and `JetBrains Mono`.

### 1.3 TopBar Header Component
- **File**: `byline/src/app/components/dispatch/dashboard/TopBar.tsx`
  - Rendered at the top of the dashboard (`height: 44px`).
  - Contains centered tabs absolute-positioned (`left: 50%`, `transform: translateX(-50%)`) for navigation.
  - Active state represented with an orange line at the bottom (`#E85E2C`).
  - Lacks a project switcher (which is currently residing in the old `LeftPanel.tsx` sidebar).
  - Contains pipeline logs toggle, dispatch publish button, and user avatar.

---

## 2. Layout Transformation Strategy

To implement the new layout specification:
1. **Side Navigation**: Replace `LeftPanel.tsx` with a persistent `LeftSidebarNavigation.tsx` (232px width). This side nav will support 6 tabs (including a new `"docs"` tab).
2. **TopBar Simplification**: Remove centered tabs. Move the project selector/switcher (previously in `LeftPanel`) into `TopBar.tsx`. Add a `⌘K` command palette trigger.
3. **Command Palette Integration**: Wire `CommandPalette.tsx` into `DashboardLayout.tsx`. Connect `meta+K` / `ctrl+K` shortcuts and the TopBar search button to toggle its visibility.
4. **Mobile Menu Collapsing**: Modify `DashboardLayout.tsx` so that on screens `< 900px`, clicking the hamburger menu toggles `LeftSidebarNavigation` in a slide-in drawer layout (232px wide overlay) with a dark blurry backdrop overlay.

---

## 3. Recommended Code Modifications for the Worker

Here is the exact code modification plan.

### 3.1 Create `DocsTab.tsx` (Placeholder)
A simple placeholder component to prevent layout crashes when navigating to the `"docs"` tab.
- **Path**: `byline/src/app/components/dispatch/dashboard/DocsTab.tsx`

```tsx
import React from "react";

interface DocsTabProps {
  isMobile?: boolean;
}

export function DocsTab({ isMobile = false }: DocsTabProps) {
  const pad = isMobile ? 12 : 20;
  return (
    <div style={{ flex: 1, background: "var(--by-bg)", padding: pad, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, color: "var(--by-text)", margin: 0 }}>
        Documentation
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--by-text-2)", margin: 0, lineHeight: 1.6 }}>
        Welcome to the Byline playbook. This area will contain the multi-agent system workflow description, playbook guidelines, and API references.
      </p>
    </div>
  );
}
```

### 3.2 Create `LeftSidebarNavigation.tsx`
This replaces the old `LeftPanel` for navigation.
- **Path**: `byline/src/app/components/dispatch/dashboard/LeftSidebarNavigation.tsx`

```tsx
import React, { useState } from "react";
import {
  IconLayoutDashboard,
  IconEdit,
  IconChartBar,
  IconActivity,
  IconSettings,
  IconFileText,
  IconX
} from "@tabler/icons-react";

export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";

const NAV_ITEMS: { id: DashTab; label: string; icon: React.ComponentType<{ size?: number; stroke?: number }> }[] = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "desk", label: "Desk", icon: IconEdit },
  { id: "signal", label: "Signal", icon: IconChartBar },
  { id: "activity", label: "Activity", icon: IconActivity },
  { id: "settings", label: "Settings", icon: IconSettings },
  { id: "docs", label: "Docs", icon: IconFileText },
];

interface LeftSidebarNavigationProps {
  activeTab: DashTab;
  onTabChange: (t: DashTab) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function LeftSidebarNavigation({
  activeTab,
  onTabChange,
  isMobile = false,
  onClose,
}: LeftSidebarNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<DashTab | null>(null);

  const containerStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        width: 232,
        backgroundColor: "var(--by-bg-2)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        boxShadow: "5px 0 25px rgba(0,0,0,0.5)",
        borderRight: "1px solid var(--by-border)",
        padding: "16px 0",
      }
    : {
        width: 232,
        backgroundColor: "var(--by-bg-2)",
        borderRight: "0.5px solid var(--by-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
        padding: "16px 0",
      };

  return (
    <div style={containerStyle}>
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 12px" }}>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--by-text-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <IconX size={18} />
          </button>
        </div>
      )}

      {/* Navigation list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isHovered = hoveredTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (isMobile && onClose) onClose();
              }}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "8px 16px",
                border: "none",
                borderLeft: `2px solid ${isActive ? "var(--by-accent)" : "transparent"}`,
                background: isActive
                  ? "rgba(232, 94, 44, 0.08)"
                  : isHovered
                  ? "var(--by-bg-3)"
                  : "transparent",
                color: isActive || isHovered ? "var(--by-text)" : "var(--by-text-2)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 120ms ease",
                outline: "none",
              }}
            >
              <Icon size={16} stroke={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### 3.3 Modify `TopBar.tsx`
Remove center tabs, add the project switcher dropdown, and add the `⌘K` trigger.
- **Path**: `byline/src/app/components/dispatch/dashboard/TopBar.tsx`

```tsx
import React, { useState, useRef, useEffect } from "react";
import { IconBolt, IconTerminal2, IconMenu2, IconChevronDown } from "@tabler/icons-react";
import Avatar from "boring-avatars";

export type DashTab = "overview" | "desk" | "signal" | "activity" | "settings" | "docs";

interface Project {
  name: string;
  stack: string;
  arc: string;
}

interface TopBarProps {
  activeTab: DashTab;
  onPublish: () => void;
  onLandingClick: () => void;
  logOpen: boolean;
  onToggleLog: () => void;
  isRunning: boolean;
  isMobile: boolean;
  onMenuClick: () => void;
  // Project Switcher
  projects: Project[];
  activeProject: number;
  setActiveProject: (idx: number) => void;
  // Command Palette
  onOpenPalette: () => void;
}

export function TopBar({
  activeTab,
  onPublish,
  onLandingClick,
  logOpen,
  onToggleLog,
  isRunning,
  isMobile,
  onMenuClick,
  projects,
  activeProject,
  setActiveProject,
  onOpenPalette,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentProject = projects[activeProject];

  return (
    <div style={{
      height: 44, background: "var(--by-bg-2)", borderBottom: "0.5px solid var(--by-border)",
      display: "flex", alignItems: "center", padding: "0 14px", flexShrink: 0,
      position: "sticky", top: 0, zIndex: 50, gap: 12,
    }}>
      {/* Desktop: macOS traffic lights */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 6, marginRight: 6, flexShrink: 0 }}>
          {[["#FF5F57", "#FF3B30"], ["#FFBD2E", "#FF9F0A"], ["#28C840", "#30D158"]].map(([bg, hover], i) => (
            <div key={i}
              style={{ width: 11, height: 11, borderRadius: "50%", background: bg, cursor: "pointer", transition: "background 150ms", flexShrink: 0 }}
              onClick={i === 2 ? undefined : i === 0 ? onLandingClick : undefined}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hover; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = bg; }}
              title={i === 0 ? "Back to site" : i === 1 ? "Minimize" : "Full screen"}
            />
          ))}
        </div>
      )}

      {/* Mobile: hamburger */}
      {isMobile && (
        <button onClick={onMenuClick} style={{ width: 32, height: 32, borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: "var(--by-text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconMenu2 size={18} stroke={1.5} />
        </button>
      )}

      {/* Logo */}
      <button onClick={onLandingClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--by-text)", letterSpacing: "-0.04em", display: "flex", alignItems: "center" }}>
        byline_
      </button>

      {/* Project Switcher Dropdown (desktop only) */}
      {!isMobile && (
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid var(--by-border)",
              background: "rgba(255,255,255,0.02)",
              color: "var(--by-text)",
              fontSize: 12,
              fontFamily: "'IBM Plex Mono', monospace",
              cursor: "pointer",
              transition: "all 120ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--by-text-3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--by-border)"}
          >
            {currentProject && (
              <Avatar name={currentProject.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={16} />
            )}
            <span>{currentProject?.name}</span>
            <IconChevronDown size={12} stroke={1.5} color="var(--by-text-3)" />
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: 4,
              width: 200,
              backgroundColor: "var(--by-bg-2)",
              border: "1px solid var(--by-border)",
              borderRadius: 6,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 100,
              padding: 4,
            }}>
              {projects.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActiveProject(idx);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 4,
                    border: "none",
                    background: activeProject === idx ? "rgba(232,94,44,0.08)" : "transparent",
                    color: "var(--by-text)",
                    fontSize: 12,
                    fontFamily: "'IBM Plex Mono', monospace",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 120ms",
                  }}
                  onMouseEnter={e => { if (activeProject !== idx) e.currentTarget.style.background = "var(--by-bg-3)"; }}
                  onMouseLeave={e => { if (activeProject !== idx) e.currentTarget.style.background = "transparent"; }}
                >
                  <Avatar name={p.name} variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8"]} size={16} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ⌘K Shortcut Button (desktop only) */}
      {!isMobile && (
        <button
          onClick={onOpenPalette}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 180,
            height: 28,
            borderRadius: 4,
            border: "0.5px solid var(--by-border)",
            background: "rgba(255, 255, 255, 0.02)",
            padding: "0 8px",
            color: "var(--by-text-3)",
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            marginLeft: 8,
            transition: "all 120ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--by-text-3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--by-border)"}
        >
          <span>Search or command...</span>
          <kbd style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            padding: "1px 4px",
            border: "0.5px solid var(--by-border)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 2,
            color: "var(--by-text-3)"
          }}>⌘K</kbd>
        </button>
      )}

      {/* Mobile active tab label */}
      {isMobile && (
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--by-text)", flex: 1, textAlign: "center", marginRight: 8 }}>
          {activeTab === "desk" ? "The Desk" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </span>
      )}

      {/* Right actions */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        {/* Run log toggle */}
        {!isMobile && (
          <button onClick={onToggleLog} title="Pipeline run log"
            style={{ width: 30, height: 30, borderRadius: 5, background: logOpen ? "rgba(232,94,44,0.12)" : "transparent", border: `0.5px solid ${logOpen ? "rgba(232,94,44,0.3)" : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: logOpen ? "#E85E2C" : "var(--by-text-3)", transition: "all 150ms", position: "relative" }}
            onMouseEnter={e => { if (!logOpen) { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.color = "var(--by-text)"; } }}
            onMouseLeave={e => { if (!logOpen) { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = "var(--by-text-3)"; } }}
          >
            <IconTerminal2 size={14} stroke={1.5} />
            {isRunning && <span style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: "50%", background: "#E85E2C" }} />}
          </button>
        )}

        <button onClick={onPublish}
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, height: 28, padding: "0 12px", background: "#E85E2C", color: "#F5F2EC", border: "none", borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 150ms", flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#C7501E"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E85E2C"; }}
        >
          <IconBolt size={11} stroke={2} />
          {isMobile ? "Run" : "log dispatch"}
        </button>

        <div style={{ marginLeft: 4, cursor: "pointer", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <Avatar name="Sahil" variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8", "#C44A2E", "#1F1F22"]} size={26} />
        </div>
      </div>
    </div>
  );
}
```

### 3.4 Modify `DashboardLayout.tsx`
Clean up state and routing, integrate `LeftSidebarNavigation`, `DocsTab`, and the `CommandPalette` component, and implement the mobile side menu collapse/drawer overlay behavior.
- **Path**: `byline/src/app/components/dispatch/dashboard/DashboardLayout.tsx`

```tsx
import { useState, useEffect } from "react";
import { TopBar, DashTab } from "./TopBar";
import { LeftSidebarNavigation } from "./LeftSidebarNavigation";
import { StatusBar } from "./StatusBar";
import { RunLogPanel } from "./RunLogPanel";
import { ChatPanel } from "./ChatPanel";
import { OverviewTab } from "./OverviewTab";
import { DeskTab } from "./DeskTab";
import { SignalTab } from "./SignalTab";
import { ActivityTab } from "./ActivityTab";
import { SettingsTab } from "./SettingsTab";
import { DocsTab } from "./DocsTab";
import { CommandPalette } from "../CommandPalette";

interface DashboardLayoutProps {
  onLandingClick: () => void;
}

const DEFAULT_PROJECTS = [
  { name: "fltrd.tech", stack: "FastAPI · pgvector · React", arc: "zero to 1k users" },
  { name: "byline",     stack: "LangGraph · FastAPI · Postgres", arc: "build in public" },
];

export function DashboardLayout({ onLandingClick }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [logOpen, setLogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runningAgent, setRunningAgent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Lifted state
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeProject, setActiveProject] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogOpen(true);
    setRunningAgent(0);
    let i = 0;
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
  };

  const handlePublish = () => {
    runPipeline();
  };

  const handleQuickPublish = (txt: string) => {
    runPipeline();
  };

  const toggleLog = () => setLogOpen(v => !v);
  const toggleChat = () => setChatOpen(v => !v);

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onPublish={handleQuickPublish} isMobile={isMobile} />;
      case "desk":     return <DeskTab isMobile={isMobile} />;
      case "signal":   return <SignalTab isMobile={isMobile} />;
      case "activity": return <ActivityTab isMobile={isMobile} />;
      case "settings": return <SettingsTab isMobile={isMobile} />;
      case "docs":     return <DocsTab isMobile={isMobile} />;
    }
  };

  useEffect(() => {
    if (isMobile) setMobileMenuOpen(false);
  }, [activeTab, isMobile]);

  // Command palette actions
  const paletteCommands = [
    { id: "go-overview", label: "Go to Overview", shortcut: "G O", group: "Navigate", action: () => setActiveTab("overview") },
    { id: "go-desk",     label: "Go to Desk",     shortcut: "G D", group: "Navigate", action: () => setActiveTab("desk") },
    { id: "go-signal",   label: "Go to Signal",   shortcut: "G S", group: "Navigate", action: () => setActiveTab("signal") },
    { id: "go-activity", label: "Go to Activity", shortcut: "G A", group: "Navigate", action: () => setActiveTab("activity") },
    { id: "go-settings", label: "Go to Settings", shortcut: "G P", group: "Navigate", action: () => setActiveTab("settings") },
    { id: "go-docs",     label: "Go to Docs",     shortcut: "G H", group: "Navigate", action: () => setActiveTab("docs") },
    { id: "run-pipeline",label: "Run pipeline",   shortcut: "⏎",   group: "Actions",  action: () => runPipeline() },
    { id: "toggle-logs", label: "Toggle run logs",                 group: "Actions",  action: () => toggleLog() },
    { id: "toggle-chat", label: "Toggle agent chat",               group: "Actions",  action: () => toggleChat() },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--by-bg)", color: "var(--by-text)", overflow: "hidden" }}>
      <TopBar
        activeTab={activeTab}
        onPublish={handlePublish}
        onLandingClick={onLandingClick}
        logOpen={logOpen}
        onToggleLog={toggleLog}
        isRunning={isRunning}
        isMobile={isMobile}
        onMenuClick={() => setMobileMenuOpen(v => !v)}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        onOpenPalette={() => setIsPaletteOpen(true)}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Mobile menu drawer & backdrop */}
        {isMobile && mobileMenuOpen && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                zIndex: 99,
              }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <LeftSidebarNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </>
        )}

        {/* Desktop Sidebar Navigation */}
        {!isMobile && (
          <LeftSidebarNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Central View Content */}
        {renderTab()}

        <RunLogPanel
          isOpen={logOpen}
          isRunning={isRunning}
          runningAgent={runningAgent}
          onClose={() => setLogOpen(false)}
        />

        <ChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          onRunMilestone={(txt, images) => {
            handleQuickPublish(txt + (images && images.length > 0 ? ` (${images.length} image(s) attached)` : ""));
          }}
          isRunning={isRunning}
          onNavigate={(tab) => setActiveTab(tab as DashTab)}
        />
      </div>

      <StatusBar
        isRunning={isRunning}
        onOpenLog={() => setLogOpen(v => !v)}
        logOpen={logOpen}
        onOpenChat={toggleChat}
        chatOpen={chatOpen}
      />

      <CommandPalette
        open={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        commands={paletteCommands}
      />
    </div>
  );
}
```
