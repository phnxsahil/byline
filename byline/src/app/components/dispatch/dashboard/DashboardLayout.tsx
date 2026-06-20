import { useState, useEffect } from "react";
import { TopBar, DashTab } from "./TopBar";
import { StatusBar } from "./StatusBar";
import {
  IconLayoutDashboard,
  IconInbox,
  IconRadio,
  IconActivity,
  IconSettings,
  IconBook,
  IconX
} from "@tabler/icons-react";
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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [runQuery, setRunQuery] = useState<string | null>(null);
  const [docsScrollTarget, setDocsScrollTarget] = useState<string | null>(null);
  const [projects] = useState(DEFAULT_PROJECTS);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (
          (e.target as HTMLElement).tagName === "INPUT" ||
          (e.target as HTMLElement).tagName === "TEXTAREA" ||
          (e.target as HTMLElement).isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runPipeline = (query?: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setLogOpen(true);
    setRunningAgent(0);
    if (query) {
      setRunQuery(query);
    } else {
      setRunQuery(null);
    }
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

  const handlePublish = () => { runPipeline(); };
  const handleQuickPublish = (txt: string) => { runPipeline(txt); };
  const toggleLog = () => setLogOpen(v => !v);
  const toggleChat = () => setChatOpen(v => !v);

  const handleNavigateToDocHeading = (headingId: string) => {
    setActiveTab("docs");
    setDocsScrollTarget(headingId);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onPublish={handleQuickPublish} isMobile={isMobile} />;
      case "desk":     return <DeskTab isMobile={isMobile} />;
      case "signal":   return <SignalTab isMobile={isMobile} />;
      case "activity": return <ActivityTab isMobile={isMobile} />;
      case "settings": return <SettingsTab isMobile={isMobile} />;
      case "docs":     return (
        <DocsTab
          isMobile={isMobile}
          scrollTarget={docsScrollTarget}
          onScrollComplete={() => setDocsScrollTarget(null)}
        />
      );
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab, isMobile]);

  const commands = [
    { id: "nav-overview", label: "Navigate to Overview", shortcut: "G O", group: "Navigation", action: () => setActiveTab("overview") },
    { id: "nav-desk", label: "Navigate to Desk", shortcut: "G D", group: "Navigation", action: () => setActiveTab("desk") },
    { id: "nav-signal", label: "Navigate to Signal", shortcut: "G S", group: "Navigation", action: () => setActiveTab("signal") },
    { id: "nav-activity", label: "Navigate to Activity", shortcut: "G A", group: "Navigation", action: () => setActiveTab("activity") },
    { id: "nav-settings", label: "Navigate to Settings", shortcut: "G E", group: "Navigation", action: () => setActiveTab("settings") },
    { id: "nav-docs", label: "Navigate to Docs", shortcut: "G H", group: "Navigation", action: () => setActiveTab("docs") },
    { id: "docs-documentation", label: "Docs: Documentation", shortcut: "G H D", group: "Documentation", action: () => handleNavigateToDocHeading("documentation") },
    { id: "docs-getting-started", label: "Docs: Getting Started", shortcut: "G H G", group: "Documentation", action: () => handleNavigateToDocHeading("getting-started") },
    { id: "action-run", label: "Run Agent Pipeline", shortcut: "R", group: "Actions", action: () => runPipeline() },
    { id: "action-logs", label: "Toggle Run Logs", shortcut: "L", group: "Actions", action: () => toggleLog() },
    { id: "action-chat", label: "Toggle Chat Assistant", shortcut: "C", group: "Actions", action: () => toggleChat() },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--by-bg)", color: "var(--by-text)", overflow: "hidden" }}>
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
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        onSearchClick={() => setCommandPaletteOpen(true)}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9,
              display: "flex",
              backgroundColor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{ height: "100%", width: 232, display: "flex", flexDirection: "column" }}
              onClick={(e) => e.stopPropagation()}
            >
              <LeftSidebarNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobile={true}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            </div>
            <div style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {!isMobile && (
          <LeftSidebarNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

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
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
        runPipeline={runPipeline}
      />
    </div>
  );
}

interface LeftSidebarNavigationProps {
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const TABS: { id: DashTab; label: string; icon: React.ComponentType<any> }[] = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "desk", label: "Desk", icon: IconInbox },
  { id: "signal", label: "Signal", icon: IconRadio },
  { id: "activity", label: "Activity", icon: IconActivity },
  { id: "settings", label: "Settings", icon: IconSettings },
  { id: "docs", label: "Docs", icon: IconBook },
];

function LeftSidebarNavigation({
  activeTab,
  onTabChange,
  isMobile = false,
  onCloseMobile,
}: LeftSidebarNavigationProps) {
  return (
    <div style={{
      width: 232, height: "100%", background: "var(--by-bg-2)",
      borderRight: "0.5px solid var(--by-border)",
      display: "flex", flexDirection: "column", position: "relative",
      boxSizing: "border-box",
    }}>
      {isMobile && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderBottom: "0.5px solid var(--by-border)",
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--by-text)", letterSpacing: "-0.04em" }}>
            byline_
          </span>
          <button onClick={onCloseMobile} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--by-text-2)", display: "flex", alignItems: "center",
            justifyContent: "center", padding: 4,
          }}>
            <IconX size={18} stroke={1.5} />
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", padding: "12px 0", gap: 2, flex: 1 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (isMobile && onCloseMobile) onCloseMobile();
              }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", height: 40, padding: "0 16px",
                border: "none",
                background: isActive ? "color-mix(in srgb, var(--by-accent) 8%, transparent)" : "transparent",
                borderLeft: "2px solid " + (isActive ? "var(--by-accent)" : "transparent"),
                cursor: "pointer", textAlign: "left",
                color: isActive ? "var(--by-text)" : "var(--by-text-2)",
                fontFamily: "'Inter', sans-serif", fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                transition: "all 150ms ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--by-text)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--by-text-2)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={16} stroke={1.5} style={{ color: isActive ? "var(--by-accent)" : "inherit" }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
