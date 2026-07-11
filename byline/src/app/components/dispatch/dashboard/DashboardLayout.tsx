import React, { useState, useEffect, useMemo } from "react";
import { TopBar } from "./TopBar";
import { SignalHub } from "./SignalHub";
import { FeedPanel } from "./FeedPanel";
import { DeskDrawer } from "./DeskDrawer";
import { CommandPalette } from "../CommandPalette";
import { AnalyticsOverlay } from "./AnalyticsOverlay";
import { SettingsOverlay } from "./SettingsOverlay";
import type { AgentStep } from "./AgentRail";
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
  const [isRunning, setIsRunning] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [deskOpen, setDeskOpen] = useState(false);
  
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteMode, setCommandPaletteMode] = useState<"search" | "command">("search");

  // Overlays
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [dispatches, setDispatches] = useState<DispatchRead[]>([]);
  const [activeDispatch, setActiveDispatch] = useState<DispatchRead | null>(null);
  const [drafts, setDrafts] = useState<DraftRead[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setBackendError(null);
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
      const message = err instanceof Error ? err.message : "Unknown backend error";
      console.warn("Backend API not reachable, running in offline/simulation mode.", err);
      setBackendError(`Live backend unavailable: ${message}`);
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
    setDeskOpen(true);
    if (apiConnected) {
      try {
        setBackendError(null);
        const list = await getDrafts(d.id);
        setDrafts(list);
      } catch (err) {
        setBackendError(`Couldn't load drafts: ${err}`);
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

  const makeAgentSteps = (query: string): AgentStep[] => [
    {
      agentId: "strategist",
      startedAt: Date.now(),
      status: "pending",
      input: { context: ["Project context loaded", `Milestone: ${query}`], instructions: "Choose angle." },
      decisions: [{ label: "Waiting on dispatch", detail: "Strategist classification." }],
    },
    {
      agentId: "linkedin",
      startedAt: Date.now(),
      status: "pending",
      input: { context: [], instructions: "Write draft." },
      decisions: [{ label: "Standing by", detail: "Waiting for strategist." }],
    },
    {
      agentId: "x",
      startedAt: Date.now(),
      status: "pending",
      input: { context: [], instructions: "Write draft." },
      decisions: [{ label: "Standing by", detail: "Waiting for strategist." }],
    },
    {
      agentId: "reddit",
      startedAt: Date.now(),
      status: "pending",
      input: { context: [], instructions: "Write draft." },
      decisions: [{ label: "Standing by", detail: "Waiting for strategist." }],
    },
    {
      agentId: "qa",
      startedAt: Date.now(),
      status: "pending",
      input: { context: [], instructions: "Validate limits." },
      decisions: [{ label: "Standing by", detail: "Waiting for drafts." }],
    },
    {
      agentId: "critic",
      startedAt: Date.now(),
      status: "pending",
      input: { context: [], instructions: "Score drafts." },
      decisions: [{ label: "Waiting for drafts", detail: "Critic runs last." }],
    },
  ];

  const runPipelineSimulated = (milestoneText: string) => {
    setIsRunning(true);
    setAgentSteps(makeAgentSteps(milestoneText));
    setDeskOpen(false);

    const sequence = [
      () => setAgentSteps((prev) => prev.map((s) => s.agentId === "strategist" ? { ...s, status: "running", decisions: [{ label: "Running Strategist", detail: "Analyzing milestone content." }] } : s)),
      () => {
        setAgentSteps((prev) => prev.map((s) => s.agentId === "strategist" ? { ...s, status: "done", finishedAt: Date.now(), decisions: [{ label: "Analysis complete", detail: "Routing to LinkedIn and X." }] } : s.agentId === "linkedin" || s.agentId === "x" ? { ...s, status: "running", decisions: [{ label: "Drafting", detail: "Generating native copy." }] } : s));
      },
      () => {
        setAgentSteps((prev) => prev.map((s) => {
          if (["linkedin", "x"].includes(s.agentId)) {
            const platform = s.agentId;
            const draftText = platform === "linkedin" ? `We just shipped: "${milestoneText}"` : `shipped: ${milestoneText.toLowerCase()}.`;
            return { ...s, status: "done", output: { draft: draftText }, decisions: [{ label: "Draft complete", detail: "Native draft generated." }] };
          }
          if (s.agentId === "qa") {
            return { ...s, status: "done", finishedAt: Date.now(), decisions: [{ label: "Linting completed", detail: "Guidelines validated." }] };
          }
          if (s.agentId === "critic") {
            return { ...s, status: "running", decisions: [{ label: "Verifying", detail: "Running anti-slop and voice compliance." }] };
          }
          return s;
        }));
      },
      () => {
        setIsRunning(false);
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
          { id: `dr-mock-li-${Date.now()}`, dispatch_id: newMockId, platform: "linkedin", body: `We just shipped: "${milestoneText}"`, reddit_title: null, reddit_subreddit: null, critic_score: 8.5, critic_note: "Passed", voice_match_score: 8.5, critic_grade: "A", status: "draft", created_at: new Date().toISOString() },
          { id: `dr-mock-x-${Date.now()}`, dispatch_id: newMockId, platform: "x", body: `shipped: ${milestoneText.toLowerCase()}.`, reddit_title: null, reddit_subreddit: null, critic_score: 8.2, critic_note: "Passed", voice_match_score: 8.2, critic_grade: "A", status: "draft", created_at: new Date().toISOString() }
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
    runPipelineSimulated(milestone); // Using mock for now per plan
  };

  return (
    <div className="flex flex-col h-screen bg-paper text-ink overflow-hidden font-sans">
      
      {/* Top Navigation */}
      <TopBar 
        currentProject={currentProject}
        onSearchClick={() => setCommandPaletteOpen(true)}
        onLogNew={() => runPipeline()}
        onLandingClick={onLandingClick}
        backendError={backendError}
        apiConnected={apiConnected}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
      />

      {/* 3-Zone Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Zone 1: Signal Hub (Left) */}
        <div className="w-64 flex-shrink-0">
          <SignalHub 
            currentProject={currentProject}
            projects={projects}
            dispatches={projectDispatches}
            onSelectProject={setActiveProjectIdx}
            onSelectDispatch={handleSelectDispatch}
            activeDispatchId={activeDispatch?.id}
            onLogNew={() => runPipeline()}
          />
        </div>

        {/* Zone 2: Command Feed (Center) */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface">
          <FeedPanel 
            agentSteps={agentSteps}
            isRunning={isRunning}
            onRunMilestone={runPipeline}
            onReviewDraft={() => setDeskOpen(true)}
          />
        </div>

        {/* Zone 3: Desk Drawer (Right) */}
        {deskOpen && (
          <div className="w-96 flex-shrink-0 animate-in slide-in-from-right duration-300">
            <DeskDrawer 
              drafts={drafts}
              activeDispatch={activeDispatch}
              onUpdateDraft={handleUpdateDraft}
              onClose={() => setDeskOpen(false)}
            />
          </div>
        )}

      </div>

      <CommandPalette 
        open={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
        mode={commandPaletteMode}
        commands={[]}
      />

      {analyticsOpen && <AnalyticsOverlay onClose={() => setAnalyticsOpen(false)} />}
      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} apiConnected={apiConnected} />}
    </div>
  );
}
