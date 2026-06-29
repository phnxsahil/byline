import { useState, useEffect, useMemo } from "react";
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
import {
  listProjects,
  listDispatches,
  createDispatch,
  getDrafts,
  patchDraft,
  streamGeneration,
  type Project as ApiProject,
  type DispatchRead,
  type DraftRead,
} from "../../../api";

interface DashboardLayoutProps {
  onLandingClick: () => void;
}

const MOCK_PROJECTS: ApiProject[] = [
  { id: "proj-1", name: "fltrd.tech", slug: "fltrd-tech", description: "AI-powered content filtering", status: "active", repo_url: "https://github.com/sahil/fltrd" },
  { id: "proj-2", name: "byline", slug: "byline", description: "Your byline. Everywhere you ship.", status: "active", repo_url: "https://github.com/sahil/byline" },
];

const MOCK_DISPATCHES: DispatchRead[] = [
  {
    id: "disp-1",
    project_id: "proj-2",
    project_name: "Byline",
    body: "shipped pgvector content ranking and cut query response times in half",
    source: "manual",
    angle: "technical_deep_dive",
    hold_reason: null,
    suggested_platforms: ["linkedin", "x"],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    stamps: [
      { platform: "linkedin", status: "ready", draft_id: "dr-1", critic_score: 8, critic_note: "Passed" },
      { platform: "x", status: "ready", draft_id: "dr-2", critic_score: 9, critic_note: "Passed" }
    ],
    is_post_worthy: true,
    arc_id: null,
    arc_name: null,
    avoid_topics: [],
    strategist_reasoning: {}
  }
];

const MOCK_DRAFTS: Record<string, DraftRead[]> = {
  "disp-1": [
    {
      id: "dr-1",
      dispatch_id: "disp-1",
      platform: "linkedin",
      body: "I spent 2 days on semantic search. The hard part was recursive character chunking with a 150-token overlap, cutting retrieval errors by 30%.\n\nOptimizing data ingestion beats prompt engineering any time.",
      reddit_title: null,
      reddit_subreddit: null,
      critic_score: 8,
      critic_note: "Passed",
      voice_match_score: 8,
      critic_grade: "A",
      status: "draft",
      created_at: new Date().toISOString()
    },
    {
      id: "dr-2",
      dispatch_id: "disp-1",
      platform: "x",
      body: "semantic search was the easy part.\n\nrecursive character chunking + 150-token overlap cut retrieval errors by 30%.\n\noptimize your data ingestion before changing prompts.",
      reddit_title: null,
      reddit_subreddit: null,
      critic_score: 9,
      critic_note: "Passed",
      voice_match_score: 9,
      critic_grade: "A",
      status: "draft",
      created_at: new Date().toISOString()
    }
  ]
};

export function DashboardLayout({ onLandingClick }: DashboardLayoutProps) {
  const STORAGE_KEY = "byline.dashboard.agentSteps";
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [isRunning, setIsRunning] = useState(false);
  const [runningAgent, setRunningAgent] = useState(0);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [railState, setRailState] = useState<"collapsed" | "expanded" | "fullscreen">("collapsed");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteMode, setCommandPaletteMode] = useState<"default" | "dispatch">("default");
  const [docsScrollTarget, setDocsScrollTarget] = useState<string | null>(null);

  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [dispatches, setDispatches] = useState<DispatchRead[]>([]);
  const [activeDispatch, setActiveDispatch] = useState<DispatchRead | null>(null);
  const [drafts, setDrafts] = useState<DraftRead[]>([]);

  const loadData = async () => {
    try {
      const projList = await listProjects();
      setProjects(projList);
      setApiConnected(true);
      
      const dispList = await listDispatches();
      setDispatches(dispList);
      
      if (dispList.length > 0) {
        const firstDisp = dispList[0];
        setActiveDispatch(firstDisp);
        const draftList = await getDrafts(firstDisp.id);
        setDrafts(draftList);
      }
    } catch (err) {
      console.warn("Backend API not reachable, running in offline/simulation mode.", err);
      setApiConnected(false);
      setProjects(MOCK_PROJECTS);
      setDispatches(MOCK_DISPATCHES);
      setActiveDispatch(MOCK_DISPATCHES[0]);
      setDrafts(MOCK_DRAFTS["disp-1"]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentProject = projects[activeProjectIdx] || null;

  const projectDispatches = useMemo(() => {
    if (!currentProject) return [];
    return dispatches.filter(d => d.project_id === currentProject.id);
  }, [dispatches, currentProject]);

  const handleSelectDispatch = async (d: DispatchRead) => {
    setActiveDispatch(d);
    if (apiConnected) {
      try {
        const list = await getDrafts(d.id);
        setDrafts(list);
      } catch {
        setDrafts([]);
      }
    } else {
      setDrafts(MOCK_DRAFTS[d.id] || []);
    }
  };

  const handleUpdateDraft = async (draftId: string, updatedBody: string, newStatus: string) => {
    if (apiConnected) {
      await patchDraft(draftId, { body: updatedBody, status: newStatus });
      if (activeDispatch) {
        const list = await getDrafts(activeDispatch.id);
        setDrafts(list);
      }
      const dispList = await listDispatches();
      setDispatches(dispList);
    } else {
      setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, body: updatedBody, status: newStatus } : d));
    }
  };

  const handleSendBack = async () => {
    if (activeDispatch) {
      runPipeline(activeDispatch.body);
    }
  };

  const handleRegenerate = async (platform: string) => {
    if (activeDispatch) {
      runPipeline(activeDispatch.body);
    }
  };

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
        setCommandPaletteMode("default");
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        { label: "Standing by", detail: "Waiting for strategist output before drafting for Reddit." },
      ],
    },
    {
      agentId: "qa",
      startedAt: Date.now(),
      status: "pending",
      input: {
        context: ["Draft validation", "Length compliance", "Token overlap rules"],
        instructions: "Validate character limits and formatting layout before Critic review.",
      },
      decisions: [
        { label: "Standing by", detail: "Waiting for platform drafts to validate." },
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

  const runRealPipeline = async (milestoneText: string) => {
    if (!currentProject) return;
    setIsRunning(true);
    setRailState(isMobile ? "fullscreen" : "expanded");
    
    const initSteps = makeAgentSteps(milestoneText);
    setAgentSteps(initSteps);
    
    try {
      const dispatch = await createDispatch({
        project_id: currentProject.id,
        body: milestoneText,
        source: "manual",
      });
      
      setActiveDispatch(dispatch);
      
      setAgentSteps(prev => prev.map(s => s.agentId === "strategist" ? {
        ...s,
        status: "running" as const,
        decisions: [{ label: "Running Strategist", detail: "Analyzing milestone content and grounding with past bylines." }]
      } : s));

      streamGeneration(
        dispatch.id,
        (event) => {
          const platform = event.platform as string;
          const status = event.status as string;
          
          setAgentSteps(prev => {
            let nextSteps = prev.map(s => {
              if (s.agentId === "strategist" && s.status !== "done") {
                return {
                  ...s,
                  status: "done" as const,
                  finishedAt: Date.now(),
                  decisions: [{ label: "Analysis complete", detail: "Milestone is post-worthy. Routing to target platforms." }]
                };
              }
              return s;
            });
            
            let stepStatus: AgentStep["status"] = "pending";
            let stepDecisions: AgentStep["decisions"] = [];
            if (status === "writing") {
              stepStatus = "running";
              stepDecisions = [{ label: "Drafting", detail: "Generating native copy matching voice profile rules." }];
            } else if (status === "ready") {
              stepStatus = "done";
              stepDecisions = [{ label: "Draft complete", detail: "Native draft has been successfully generated." }];
            } else if (status === "flagged") {
              stepStatus = "blocked";
              stepDecisions = [{ label: "Rejected by Critic", detail: (event.critic_note as string) || "SLOP or self-promo filter triggered." }];
            }
            
            nextSteps = nextSteps.map(s => {
              if (s.agentId === platform) {
                return {
                  ...s,
                  status: stepStatus,
                  decisions: stepDecisions
                };
              }
              return s;
            });

            // Update QA Agent status dynamically
            const writersRunning = nextSteps.some(s => ["linkedin", "x", "reddit"].includes(s.agentId) && s.status === "running");
            const writersDone = nextSteps.filter(s => ["linkedin", "x", "reddit"].includes(s.agentId)).every(s => s.status === "done" || s.status === "blocked" || s.status === "pending");
            const writersDoneCount = nextSteps.filter(s => ["linkedin", "x", "reddit"].includes(s.agentId) && (s.status === "done" || s.status === "blocked")).length;

            nextSteps = nextSteps.map(s => {
              if (s.agentId === "qa") {
                if (writersRunning) {
                  return {
                    ...s,
                    status: "running" as const,
                    decisions: [{ label: "Analyzing stream", detail: "Validating character counts, styles, and guidelines." }]
                  };
                } else if (writersDoneCount > 0 && writersDone) {
                  return {
                    ...s,
                    status: "done" as const,
                    finishedAt: Date.now(),
                    decisions: [
                      { label: "Linting completed", detail: "Guidelines validated: character limits, hooks, formatting layout." },
                      { label: "Anti-slop check passed", detail: "Scanned for forbidden AI marketing phrases." }
                    ]
                  };
                }
              }
              return s;
            });
            
            return nextSteps;
          });
        },
        (error) => {
          console.error("SSE stream error", error);
          setIsRunning(false);
          setAgentSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" as const } : s));
        },
        async () => {
          setIsRunning(false);
          setAgentSteps(prev => prev.map(s => {
            if (s.agentId === "critic") {
              return {
                ...s,
                status: "done" as const,
                finishedAt: Date.now(),
                decisions: [{ label: "Verification complete", detail: "Reviewed voice and platform compliance constraints." }]
              };
            }
            if (s.agentId === "strategist" && s.status !== "done") {
              return { ...s, status: "done" as const };
            }
            return s;
          }));
          
          const list = await listDispatches();
          setDispatches(list);
          const updated = list.find(d => d.id === dispatch.id);
          if (updated) {
            setActiveDispatch(updated);
            const draftList = await getDrafts(updated.id);
            setDrafts(draftList);
          }
        }
      );
    } catch (err) {
      console.error("Failed to start generation", err);
      setIsRunning(false);
    }
  };

  const runPipelineSimulated = (milestoneText: string) => {
    setIsRunning(true);
    setRailState(isMobile ? "fullscreen" : "expanded");
    setRunningAgent(0);
    setAgentSteps(makeAgentSteps(milestoneText));

    const sequence = [
      () => setAgentSteps((prev) => prev.map((s) => s.agentId === "strategist" ? { ...s, status: "running", decisions: [{ label: "Running Strategist", detail: "Analyzing milestone content." }] } : s)),
      () => {
        setRunningAgent(1);
        setAgentSteps((prev) => prev.map((s) => s.agentId === "strategist" ? { ...s, status: "done", finishedAt: Date.now(), decisions: [{ label: "Analysis complete", detail: "Milestone post-worthy. Routing to LinkedIn and X." }] } : s.agentId === "linkedin" || s.agentId === "x" ? { ...s, status: "running", decisions: [{ label: "Drafting", detail: "Generating native copy." }] } : s.agentId === "qa" ? { ...s, status: "running", decisions: [{ label: "Analyzing stream", detail: "Validating constraints in parallel." }] } : s));
      },
      () => {
        setRunningAgent(3);
        setAgentSteps((prev) => prev.map((s) => ["linkedin", "x"].includes(s.agentId) ? { ...s, status: "done", decisions: [{ label: "Draft complete", detail: "Native draft generated." }] } : s.agentId === "qa" ? { ...s, status: "done", finishedAt: Date.now(), decisions: [{ label: "Linting completed", detail: "Guidelines validated: character limits, hooks." }] } : s.agentId === "critic" ? { ...s, status: "running", decisions: [{ label: "Verifying", detail: "Running anti-slop and voice compliance." }] } : s));
      },
      () => {
        setIsRunning(false);
        setRunningAgent(0);
        setAgentSteps((prev) => prev.map((s) => s.agentId === "critic" ? { ...s, status: "done", finishedAt: Date.now(), decisions: [{ label: "Verification complete", detail: "Reviewed voice and compliance constraints." }] } : s));
        
        const newMockId = `disp-mock-${Date.now()}`;
        const newMockDisp: DispatchRead = {
          id: newMockId,
          project_id: currentProject ? currentProject.id : "proj-2",
          project_name: currentProject ? currentProject.name : "Byline",
          body: milestoneText,
          source: "manual",
          angle: "milestone",
          hold_reason: null,
          suggested_platforms: ["linkedin", "x"],
          created_at: new Date().toISOString(),
          stamps: [
            { platform: "linkedin", status: "ready", draft_id: `dr-mock-li-${Date.now()}`, critic_score: 8.5, critic_note: "Passed" },
            { platform: "x", status: "ready", draft_id: `dr-mock-x-${Date.now()}`, critic_score: 8.2, critic_note: "Passed" }
          ],
          is_post_worthy: true,
          arc_id: null,
          arc_name: null,
          avoid_topics: [],
          strategist_reasoning: {}
        };
        
        MOCK_DRAFTS[newMockId] = [
          {
            id: `dr-mock-li-${Date.now()}`,
            dispatch_id: newMockId,
            platform: "linkedin",
            body: `We just shipped: "${milestoneText}"`,
            reddit_title: null,
            reddit_subreddit: null,
            critic_score: 8.5,
            critic_note: "Passed",
            voice_match_score: 8.5,
            critic_grade: "A",
            status: "draft",
            created_at: new Date().toISOString()
          },
          {
            id: `dr-mock-x-${Date.now()}`,
            dispatch_id: newMockId,
            platform: "x",
            body: `shipped: ${milestoneText.toLowerCase()}.`,
            reddit_title: null,
            reddit_subreddit: null,
            critic_score: 8.2,
            critic_note: "Passed",
            voice_match_score: 8.2,
            critic_grade: "A",
            status: "draft",
            created_at: new Date().toISOString()
          }
        ];
        
        setDispatches(prev => [newMockDisp, ...prev]);
        setActiveDispatch(newMockDisp);
        setDrafts(MOCK_DRAFTS[newMockId]);
      },
    ];

    sequence.forEach((step, index) => {
      window.setTimeout(step, index * 1200);
    });
  };

  const runPipeline = (query?: string) => {
    if (isRunning) return;
    const milestone = query?.trim() || "shipped semantic search on fltrd.tech using pgvector";
    if (apiConnected) {
      runRealPipeline(milestone);
    } else {
      runPipelineSimulated(milestone);
    }
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

  const commands = [
    {
      id: "nav-overview",
      label: "Navigate to Overview",
      shortcut: "G O",
      group: "Navigation",
      action: () => setActiveTab("overview"),
    },
    {
      id: "nav-desk",
      label: "Navigate to Desk",
      shortcut: "G D",
      group: "Navigation",
      action: () => setActiveTab("desk"),
    },
    {
      id: "nav-signal",
      label: "Navigate to Signal",
      shortcut: "G S",
      group: "Navigation",
      action: () => setActiveTab("signal"),
    },
    {
      id: "nav-activity",
      label: "Navigate to Activity",
      shortcut: "G A",
      group: "Navigation",
      action: () => setActiveTab("activity"),
    },
    {
      id: "nav-settings",
      label: "Navigate to Settings",
      shortcut: "G E",
      group: "Navigation",
      action: () => setActiveTab("settings"),
    },
    {
      id: "nav-docs",
      label: "Navigate to Docs",
      shortcut: "G H",
      group: "Navigation",
      action: () => setActiveTab("docs"),
    },
    {
      id: "docs-getting-started",
      label: "Docs: Getting Started",
      shortcut: "G H G",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("getting-started"),
    },
    {
      id: "docs-dispatching",
      label: "Docs: Dispatching from the Dashboard",
      shortcut: "G H D",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("dispatching-from-the-dashboard"),
    },
    {
      id: "docs-agents",
      label: "Docs: Agent Pipeline",
      shortcut: "G H A",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("agents"),
    },
    {
      id: "docs-voice-profile",
      label: "Docs: Voice Profile",
      shortcut: "G H V",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("voice-profile"),
    },
    {
      id: "docs-platforms",
      label: "Docs: Platforms",
      shortcut: "G H P",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("platforms"),
    },
    {
      id: "docs-api",
      label: "Docs: API Reference",
      shortcut: "G H R",
      group: "Documentation",
      action: () => handleNavigateToDocHeading("api"),
    },
    {
      id: "action-run",
      label: "Run Agent Pipeline",
      shortcut: "⌥R",
      group: "Actions",
      action: () => runPipeline(),
    },
    {
      id: "action-chat",
      label: "Toggle Chat Assistant",
      shortcut: "⌥C",
      group: "Actions",
      action: () => toggleRail(),
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "overview": 
        return (
          <OverviewTab 
            onPublish={handleQuickPublish} 
            isMobile={isMobile}
            projects={projects}
            activeProject={currentProject}
            dispatches={projectDispatches}
            onSelectDispatch={handleSelectDispatch}
            onNavigate={setActiveTab}
          />
        );
      case "desk":     
        return (
          <DeskTab 
            isMobile={isMobile} 
            activeDispatch={activeDispatch}
            drafts={drafts}
            onUpdateDraft={handleUpdateDraft}
            onSendBack={handleSendBack}
            onRegenerate={handleRegenerate}
          />
        );
      case "signal":   
        return (
          <SignalTab 
            isMobile={isMobile}
            dispatches={projectDispatches}
            onSelectDispatch={handleSelectDispatch}
            onNavigate={setActiveTab}
          />
        );
      case "activity": 
        return (
          <ActivityTab 
            isMobile={isMobile} 
            dispatches={projectDispatches}
            onNavigate={setActiveTab}
          />
        );
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

  const mappedProjectsForTopBar = projects.map(p => ({
    name: p.name,
    stack: p.repo_url || p.slug || "",
    arc: p.description || "",
  }));

  return (
    <section style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--by-bg)", color: "var(--by-text)", overflow: "hidden", overscrollBehavior: "contain" }}>
      {apiConnected === false && (
        <div style={{
          background: "rgba(245,158,11,0.08)",
          borderBottom: "0.5px solid rgba(245,158,11,0.2)",
          color: "rgba(245,158,11,0.9)",
          padding: "5px 16px",
          fontSize: 11,
          fontFamily: "'IBM Plex Mono', monospace",
          textAlign: "center",
          letterSpacing: "0.02em",
        }}>
          demo mode — simulated data. connect the backend to use live pipeline.
        </div>
      )}
      <TopBar
        data-testid="topbar"
        activeTab={activeTab}
        onDispatchClick={handleDispatchClick}
        onLandingClick={onLandingClick}
        isRunning={isRunning}
        isMobile={isMobile}
        onMenuClick={() => setMobileMenuOpen(v => !v)}
        projects={mappedProjectsForTopBar}
        activeProject={activeProjectIdx}
        setActiveProject={setActiveProjectIdx}
        onSearchClick={() => {
          setCommandPaletteMode("default");
          setCommandPaletteOpen(true);
        }}
      />

      <article style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", overscrollBehavior: "contain" }}>

        {isMobile && mobileMenuOpen && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              display: "flex",
              backgroundColor: "rgba(0,0,0,0.6)",
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
                background: isActive ? "rgba(232,94,44,0.07)" : "transparent",
                borderLeft: "2px solid " + (isActive ? "var(--by-accent)" : "transparent"),
                cursor: "pointer", textAlign: "left",
                color: isActive ? "var(--by-text)" : "var(--by-text-2)",
                fontFamily: "'Inter', sans-serif", fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                transition: "color 120ms ease, background 120ms ease, border-color 120ms ease",
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
