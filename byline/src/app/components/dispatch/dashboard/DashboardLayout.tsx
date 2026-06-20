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
import { AgentRail, AgentStep } from "./AgentRail";
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
  const STORAGE_KEY = "byline.dashboard.agentSteps";
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [isRunning, setIsRunning] = useState(false);
  const [runningAgent, setRunningAgent] = useState(0);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as AgentStep[];
    } catch {
      return [];
    }
  });
  const [railState, setRailState] = useState<"collapsed" | "expanded" | "fullscreen">("collapsed");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteMode, setCommandPaletteMode] = useState<"default" | "dispatch">("default");
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
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(agentSteps));
    } catch {
      // ignore storage failures
    }
  }, [agentSteps]);

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
        setCommandPaletteMode("default");
        setCommandPaletteOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setRailState((prev) => (prev === "fullscreen" ? "expanded" : "fullscreen"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [commandPaletteOpen]);

  const makeAgentSteps = (query: string): AgentStep[] => [
    {
      agentId: "strategist",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["Project context loaded", "Voice profile loaded", `Milestone: ${query}`],
        instructions: "Choose angle, platforms, and narrative arc.",
      },
      decisions: [
        { label: "Waiting on dispatch", detail: "The strategist will classify the incoming milestone before any writer starts." },
      ],
    },
    {
      agentId: "linkedin",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["LinkedIn prefers sentence case", "Short paragraphs outperform walls of text"],
        instructions: "Write a clear build-in-public narrative draft.",
      },
      decisions: [
        { label: "Standing by", detail: "Waiting for strategist output before drafting for LinkedIn." },
      ],
    },
    {
      agentId: "x",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["Lowercase voice", "Opinionated first tweet", "3-5 tweets maximum"],
        instructions: "Turn the milestone into a short, punchy thread.",
      },
      decisions: [
        { label: "Standing by", detail: "Waiting for strategist output before drafting for X." },
      ],
    },
    {
      agentId: "reddit",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["Educational framing required", "No promo language in the opening"],
        instructions: "Only publish if there is enough depth for a useful lesson.",
      },
      decisions: [
        { label: "Standing by", detail: "Waiting for strategist output before evaluating Reddit fit." },
      ],
    },
    {
      agentId: "critic",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["Check for AI slop", "Verify platform fit", "Flag risky self-promo"],
        instructions: "Score every generated draft honestly.",
      },
      decisions: [
        { label: "Waiting for drafts", detail: "The critic only runs once the selected writers finish." },
      ],
    },
  ];

  const runPipeline = (query?: string) => {
    if (isRunning) return;
    const milestone = query?.trim() || "shipped semantic search on fltrd.tech using pgvector";
    setIsRunning(true);
    setRailState(isMobile ? "fullscreen" : "expanded");
    setRunningAgent(0);
    setAgentSteps(makeAgentSteps(milestone));

    const sequence = [
      () =>
        setAgentSteps((prev) =>
          prev.map((step) =>
            step.agentId === "strategist"
              ? {
                  ...step,
                  status: "running",
                  decisions: [
                    {
                      label: "Evaluating post-worthiness",
                      detail: "Reading project context, milestone signal strength, and voice profile before routing platforms.",
                    },
                  ],
                }
              : step
          )
        ),
      () => {
        setRunningAgent(1);
        setAgentSteps((prev) =>
          prev.map((step) => {
            if (step.agentId === "strategist") {
              return {
                ...step,
                finishedAt: Date.now(),
                status: "done",
                output: { reasoning: "Chosen as a lesson-learned angle with LinkedIn, X, and Threads prioritized." },
                decisions: [
                  { label: "Chose lesson_learned", detail: "The milestone is specific enough to support a concrete build story." },
                  { label: "Selected LinkedIn, X, Threads", detail: "Good fit for broad builder audiences without requiring deep subreddit nuance." },
                  { label: "Skipped Reddit", detail: "Not enough depth yet for a 400+ word educational post without sounding promotional." },
                ],
              };
            }
            if (step.agentId === "linkedin" || step.agentId === "x") {
              return { ...step, status: "running" };
            }
            if (step.agentId === "reddit") {
              return {
                ...step,
                finishedAt: Date.now(),
                status: "blocked",
                decisions: [
                  { label: "Blocked for now", detail: "The signal is strong, but the current milestone still needs more technical depth for Reddit." },
                ],
              };
            }
            return step;
          })
        );
      },
      () => {
        setRunningAgent(3);
        setAgentSteps((prev) =>
          prev.map((step) => {
            if (step.agentId === "linkedin") {
              return {
                ...step,
                finishedAt: Date.now(),
                status: "done",
                output: { draft: "i spent two days on semantic search and the hard part was not retrieval. it was teaching the system what counts as a signal worth posting." },
                decisions: [
                  { label: "Used story-first framing", detail: "LinkedIn draft opens with a learning moment before naming the implementation detail." },
                  { label: "Kept paragraphs short", detail: "Optimized for mobile skim and 'see more' behavior." },
                ],
              };
            }
            if (step.agentId === "x") {
              return {
                ...step,
                finishedAt: Date.now(),
                status: "done",
                output: { draft: "semantic search was the easy part.\n\nteaching the pipeline what was worth saying publicly was harder.\n\nbyline is finally starting to feel like it notices the right work." },
                decisions: [
                  { label: "Made the opinion the hook", detail: "The first line is written as a take instead of a changelog." },
                ],
              };
            }
            if (step.agentId === "critic") {
              return { ...step, status: "running" };
            }
            return step;
          })
        );
      },
      () => {
        setRunningAgent(4);
        setAgentSteps((prev) =>
          prev.map((step) =>
            step.agentId === "critic"
              ? {
                  ...step,
                  finishedAt: Date.now(),
                  status: "done",
                  output: { score: 8.6, reasoning: "Clear hook, strong platform fit, Reddit correctly held back." },
                  decisions: [
                    { label: "Approved LinkedIn + X", detail: "Both drafts feel close to the intended founder voice and avoid generic AI phrasing." },
                    { label: "Confirmed Reddit block", detail: "Blocking Reddit is better than forcing weak educational depth." },
                  ],
                }
              : step
          )
        );
      },
      () => {
        setIsRunning(false);
        setRunningAgent(0);
      },
    ];

    sequence.forEach((step, index) => {
      window.setTimeout(step, index * 1200);
    });
  };

  const handleDispatchClick = () => {
    setCommandPaletteMode("dispatch");
    setCommandPaletteOpen(true);
  };
  const handleQuickPublish = (txt: string) => { runPipeline(txt); };
  const toggleRail = () => setRailState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
  const handleNavigateToDocHeading = (headingId: string) => {
    setActiveTab("docs");
    setDocsScrollTarget(headingId);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onPublish={handleQuickPublish} isMobile={isMobile} />;
      case "desk":     return <DeskTab isMobile={isMobile} agentSteps={agentSteps} />;
      case "signal":   return <SignalTab isMobile={isMobile} />;
      case "activity": return <ActivityTab isMobile={isMobile} agentSteps={agentSteps} />;
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
    { id: "action-chat", label: "Toggle Agent Rail", shortcut: "C", group: "Actions", action: () => toggleRail() },
  ];

  return (
    <section style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--by-bg)", color: "var(--by-text)", overflow: "hidden" }}>
      <TopBar
        data-testid="topbar"
        activeTab={activeTab}
        onDispatchClick={handleDispatchClick}
        onLandingClick={onLandingClick}
        isRunning={isRunning}
        isMobile={isMobile}
        onMenuClick={() => setMobileMenuOpen(v => !v)}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        onSearchClick={() => {
          setCommandPaletteMode("default");
          setCommandPaletteOpen(true);
        }}
      />

      <article style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 60,
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
          <div data-testid="sidebar" style={{ width: 232, flexShrink: 0 }}>
            <LeftSidebarNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}

        {renderTab()}

        {!isMobile && railState !== "fullscreen" && (
          <AgentRail
            railState={railState}
            onRailStateChange={setRailState}
            agentSteps={agentSteps}
            isRunning={isRunning}
            onRunMilestone={(txt, images) => {
              handleQuickPublish(txt + (images && images.length > 0 ? ` (${images.length} image(s) attached)` : ""));
            }}
            onNavigate={(tab) => setActiveTab(tab as DashTab)}
          />
        )}
      </article>

      {railState === "fullscreen" && (
        <div style={{ position: "fixed", inset: 44, zIndex: 45 }}>
          <AgentRail
            railState={railState}
            onRailStateChange={setRailState}
            agentSteps={agentSteps}
            isRunning={isRunning}
            onRunMilestone={(txt, images) => {
              handleQuickPublish(txt + (images && images.length > 0 ? ` (${images.length} image(s) attached)` : ""));
            }}
            onNavigate={(tab) => setActiveTab(tab as DashTab)}
          />
        </div>
      )}

      <StatusBar
        isRunning={isRunning}
        onOpenChat={() =>
          setRailState((prev) =>
            prev === "collapsed" ? "expanded" : "collapsed"
          )
        }
        chatOpen={railState !== "collapsed"}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
        runPipeline={runPipeline}
        mode={commandPaletteMode}
      />
    </section>
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
    <div data-testid="sidebar" style={{
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
