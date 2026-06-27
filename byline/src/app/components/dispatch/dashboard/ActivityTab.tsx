import React, { useMemo, useState, useEffect } from "react";
import {
  IconArrowLeft,
  IconBolt,
  IconCheck,
  IconEdit,
  IconGitCommit,
  IconMessageCircle,
  IconCode
} from "@tabler/icons-react";
import { AGENTS_LIST, AgentStep, STATUS_COLORS } from "./AgentRail";
import { type DispatchRead, type DraftRead, getDrafts } from "../../../api";

interface ActivityTabProps {
  isMobile: boolean;
  dispatches: DispatchRead[];
  onNavigate: (tab: string) => void;
}

type ActivityFilter =
  | "all"
  | "linkedin"
  | "x"
  | "reddit"
  | "blocked";

const FILTERS: { id: ActivityFilter; label: string; tone?: "blocked" }[] = [
  { id: "all", label: "All" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "reddit", label: "Reddit" },
  { id: "blocked", label: "Blocked", tone: "blocked" },
];

function getSourceIcon(source: string) {
  switch (source?.toLowerCase()) {
    case "github":
      return IconGitCommit;
    case "voice_note":
    case "voice":
      return IconMessageCircle;
    case "cli":
      return IconCode;
    default:
      return IconBolt;
  }
}

// Function to reconstruct steps on-the-fly from dispatch + drafts
function reconstructSteps(dispatch: DispatchRead, drafts: DraftRead[]): AgentStep[] {
  const steps: AgentStep[] = [];
  const createdTime = new Date(dispatch.created_at).getTime();

  // 1. Strategist
  let strategistStatus: AgentStep["status"] = "pending";
  let strategistDecisions: AgentStep["decisions"] = [];
  let strategistOutput: AgentStep["output"] = undefined;

  if (dispatch.is_post_worthy === true) {
    strategistStatus = "done";
    strategistDecisions = [
      { label: "Post-Worthy Verified", detail: `Milestone categorized as "${dispatch.angle || "general"}".` },
      { label: "Platform Routing", detail: `Routed to: ${(dispatch.suggested_platforms || []).join(", ")}.` }
    ];
    if (dispatch.avoid_topics && dispatch.avoid_topics.length > 0) {
      strategistDecisions.push({ label: "Avoid Topics", detail: `Flagged to avoid: ${dispatch.avoid_topics.join(", ")}.` });
    }
    strategistOutput = { reasoning: dispatch.strategist_reasoning ? JSON.stringify(dispatch.strategist_reasoning) : "Approved by strategist" };
  } else if (dispatch.is_post_worthy === false) {
    strategistStatus = "blocked";
    strategistDecisions = [
      { label: "Milestone Held", detail: dispatch.hold_reason || "Milestone does not meet post-worthiness threshold." }
    ];
    strategistOutput = { reasoning: dispatch.hold_reason || "Held by strategist" };
  } else {
    strategistStatus = "pending";
    strategistDecisions = [
      { label: "Awaiting execution", detail: "Strategist is waiting for a dispatch trigger." }
    ];
  }

  steps.push({
    agentId: "strategist",
    startedAt: createdTime,
    status: strategistStatus,
    input: {
      context: ["Project context loaded", "Voice profile loaded", `Milestone: ${dispatch.body}`],
      instructions: "Determine if milestone is post-worthy and choose the best platforms and angle."
    },
    decisions: strategistDecisions,
    output: strategistOutput
  });

  // 2. Platform Writers: linkedin, x, reddit
  const platforms: ("linkedin" | "x" | "reddit")[] = ["linkedin", "x", "reddit"];
  for (const plat of platforms) {
    const draft = drafts.find(d => d.platform === plat);
    const isSuggested = dispatch.suggested_platforms?.includes(plat);

    let status: AgentStep["status"] = "pending";
    let decisions: AgentStep["decisions"] = [];
    let output: AgentStep["output"] = undefined;
    let context: string[] = [];
    let instructions = "";

    if (plat === "linkedin") {
      context = ["LinkedIn prefers sentence case", "Short paragraphs outperform walls of text"];
      instructions = "Write a clear build-in-public narrative draft.";
    } else if (plat === "x") {
      context = ["Lowercase voice", "Opinionated first tweet", "3-5 tweets maximum"];
      instructions = "Turn the milestone into a short, punchy thread.";
    } else if (plat === "reddit") {
      context = ["Educational framing required", "No promo language in the opening"];
      instructions = "Only publish if there is enough depth for a useful lesson.";
    }

    if (draft) {
      status = "done";
      decisions = [
        { label: "Draft completed", detail: `Natively formatted ${plat} post generated.` }
      ];
      output = { draft: draft.body };
    } else if (dispatch.is_post_worthy === false) {
      status = "pending";
      decisions = [
        { label: "Skipped", detail: "Strategist held the milestone." }
      ];
    } else if (dispatch.is_post_worthy === true && !isSuggested) {
      status = "blocked";
      decisions = [
        { label: "Not selected", detail: `Strategist routed around ${plat}.` }
      ];
    } else {
      status = "pending";
      decisions = [
        { label: "Standing by", detail: `Awaiting strategist instructions.` }
      ];
    }

    steps.push({
      agentId: plat,
      startedAt: createdTime,
      status,
      input: { context, instructions },
      decisions,
      output
    });
  }

  const activeDrafts = drafts.filter(d => dispatch.suggested_platforms?.includes(d.platform));
  const hasBlockedDraft = activeDrafts.some(d => d.status === "rejected" || (d.critic_score !== null && d.critic_score < 7));
  const allDraftsDone = dispatch.suggested_platforms && dispatch.suggested_platforms.length > 0 && 
                         dispatch.suggested_platforms.every(p => drafts.some(d => d.platform === p));

  // 3. QA Agent
  let qaStatus: AgentStep["status"] = "pending";
  let qaDecisions: AgentStep["decisions"] = [];
  let qaOutput: AgentStep["output"] = undefined;

  if (hasBlockedDraft) {
    qaStatus = "blocked";
    qaDecisions = [
      { label: "Validation failed", detail: "QA Agent identified formatting or constraint violations." }
    ];
  } else if (allDraftsDone) {
    qaStatus = "done";
    qaDecisions = [
      { label: "Linting completed", detail: "Guidelines validated: character limits, hooks, formatting layout." },
      { label: "Anti-slop check passed", detail: "Scanned for forbidden AI marketing phrases." }
    ];
  } else if (dispatch.is_post_worthy === false) {
    qaStatus = "pending";
    qaDecisions = [
      { label: "Skipped", detail: "Strategist held the milestone." }
    ];
  } else if (dispatch.is_post_worthy === true) {
    qaStatus = "running";
    qaDecisions = [
      { label: "Analyzing stream", detail: "Validating character counts, styles, and guidelines." }
    ];
  }

  steps.push({
    agentId: "qa",
    startedAt: createdTime,
    status: qaStatus,
    input: {
      context: ["Draft validation", "Length compliance", "Token overlap rules"],
      instructions: "Validate character limits and formatting layout before Critic review."
    },
    decisions: qaDecisions,
    output: qaOutput
  });

  // 4. Critic
  let criticStatus: AgentStep["status"] = "pending";
  let criticDecisions: AgentStep["decisions"] = [];
  let criticOutput: AgentStep["output"] = undefined;

  if (hasBlockedDraft) {
    criticStatus = "blocked";
    criticDecisions = activeDrafts.map(d => ({
      label: `${d.platform.toUpperCase()} Critic Verdict`,
      detail: `Score: ${d.critic_score ?? "N/A"}/10. Note: ${d.critic_note || "Flagged for safety or voice mismatch."}`
    }));
    criticOutput = { reasoning: "Critic flagged or blocked one or more generated drafts." };
  } else if (allDraftsDone) {
    criticStatus = "done";
    criticDecisions = activeDrafts.map(d => ({
      label: `${d.platform.toUpperCase()} Critic Verdict`,
      detail: `Score: ${d.critic_score ?? "N/A"}/10. Note: ${d.critic_note || "Passed validation."}`
    }));
    const avgScore = activeDrafts.reduce((acc, d) => acc + (d.critic_score ?? 0), 0) / (activeDrafts.length || 1);
    criticOutput = { score: parseFloat(avgScore.toFixed(1)), reasoning: "All active platform drafts approved." };
  } else if (dispatch.is_post_worthy === false) {
    criticStatus = "pending";
    criticDecisions = [
      { label: "Skipped", detail: "Strategist held the milestone." }
    ];
  } else {
    criticStatus = "pending";
    criticDecisions = [
      { label: "Waiting for drafts", detail: "Critic runs after drafts are complete." }
    ];
  }

  steps.push({
    agentId: "critic",
    startedAt: createdTime,
    status: criticStatus,
    input: {
      context: ["Check for AI slop", "Verify platform fit", "Flag risky self-promo"],
      instructions: "Score every generated draft honestly."
    },
    decisions: criticDecisions,
    output: criticOutput
  });

  return steps;
}

export function ActivityTab({ isMobile, dispatches, onNavigate }: ActivityTabProps) {
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchRead | null>(null);
  const [drafts, setDrafts] = useState<DraftRead[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  useEffect(() => {
    if (!selectedDispatch) {
      setDrafts([]);
      return;
    }
    setLoadingDrafts(true);
    getDrafts(selectedDispatch.id)
      .then(res => {
        setDrafts(res);
      })
      .catch(err => {
        console.error("Failed to load drafts for dispatch:", err);
      })
      .finally(() => {
        setLoadingDrafts(false);
      });
  }, [selectedDispatch]);

  const reconstructedAgentSteps = useMemo(() => {
    if (!selectedDispatch) return [];
    return reconstructSteps(selectedDispatch, drafts);
  }, [selectedDispatch, drafts]);

  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => {
      if (activeFilter === "all") return true;
      if (activeFilter === "blocked") {
        const isStrategistBlocked = d.is_post_worthy === false;
        const hasBlockedStamp = d.stamps.some(s => s.status === "rejected" || (s.critic_score !== null && s.critic_score < 7));
        return isStrategistBlocked || hasBlockedStamp;
      }
      return d.suggested_platforms?.includes(activeFilter);
    });
  }, [dispatches, activeFilter]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "var(--by-text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {selectedDispatch ? "Agent Trace" : "Pipeline History"}
        </div>

        {!selectedDispatch && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.id;
              const blockedTone = filter.tone === "blocked";
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                  }}
                  style={{
                    borderRadius: 999,
                    padding: "6px 10px",
                    border: `0.5px solid ${active ? (blockedTone ? "var(--by-red)" : "var(--by-border)") : "var(--by-border)"}`,
                    background: active
                      ? blockedTone
                        ? "rgba(248,113,113,0.08)"
                        : "rgba(255,255,255,0.03)"
                      : "transparent",
                    color: active
                      ? blockedTone
                        ? "var(--by-red)"
                        : "var(--by-text)"
                      : "var(--by-text-2)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDispatch ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <button
            onClick={() => setSelectedDispatch(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              color: "var(--by-text-2)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <IconArrowLeft size={12} stroke={2} />
            Back to Activity
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--by-text)",
              }}
            >
              {selectedDispatch.body}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "var(--by-text-2)",
              }}
            >
              {selectedDispatch.is_post_worthy === false
                ? `Held: ${selectedDispatch.hold_reason || "Milestone held by Strategist."}`
                : `Angle: ${selectedDispatch.angle || "Awaiting Classification"}`}
            </div>
          </div>

          {loadingDrafts ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
              Loading decision trace...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {AGENTS_LIST.map((agent) => {
                const step = reconstructedAgentSteps.find((entry) => entry.agentId === agent.id);
                const status = step?.status ?? "pending";
                const hasOutput = status === "done" && Boolean(step?.output);
                const statusColor = STATUS_COLORS[status];

                return (
                  <div
                    key={agent.id}
                    style={{
                      background: "var(--by-bg-2)",
                      border: `0.5px solid ${status === "pending" ? "var(--by-border)" : statusColor}`,
                      borderRadius: 10,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: status === "pending" ? "transparent" : statusColor,
                          border:
                            status === "pending"
                              ? "1px solid var(--by-text-3)"
                              : status === "error"
                                ? "1px solid #ffffff"
                                : "1px solid transparent",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--by-text)",
                        }}
                      >
                        {agent.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: statusColor,
                        }}
                      >
                        {status}
                      </div>
                    </div>

                    <details
                      style={{
                        border: "0.5px solid var(--by-border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        background: "var(--by-bg-3)",
                      }}
                    >
                      <summary
                        style={{
                          cursor: "pointer",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          color: "var(--by-text-2)",
                          listStyle: "none",
                        }}
                      >
                        What it received
                      </summary>
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          color: "var(--by-text-2)",
                          lineHeight: 1.5,
                        }}
                      >
                        {step?.input.context.map((line) => (
                          <div key={line}>• {line}</div>
                        ))}
                        <div style={{ color: "var(--by-text-3)" }}>{step?.input.instructions}</div>
                      </div>
                    </details>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          color: "var(--by-text-2)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        What it decided
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {step?.decisions.map((decision) => (
                          <div
                            key={decision.label}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                color: statusColor,
                                fontSize: 10,
                                marginTop: 1,
                                flexShrink: 0,
                              }}
                            >
                              →
                            </span>
                            <span
                              style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 10,
                                color: "var(--by-text-2)",
                                lineHeight: 1.5,
                              }}
                            >
                              <span style={{ color: "var(--by-text)" }}>[{decision.label}]</span>{" "}
                              {decision.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasOutput && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10,
                            color: "var(--by-text-2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Output
                        </div>
                        <div
                          style={{
                            padding: "8px 10px",
                            background: "var(--by-bg)",
                            borderRadius: 8,
                            border: "0.5px solid var(--by-border)",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10,
                            color: "var(--by-text)",
                            lineHeight: 1.55,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {step?.output?.draft ?? step?.output?.reasoning ?? "Done"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "var(--by-bg-2)",
            border: "0.5px solid var(--by-border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {filteredDispatches.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--by-text-3)",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
              }}
            >
              {activeFilter === "all" ? (
                <>
                  <div style={{ fontSize: 14, color: "var(--by-text-2)", marginBottom: 8 }}>No pipeline runs yet</div>
                  <div style={{ fontSize: 12, lineHeight: 1.65, maxWidth: 360, margin: "0 auto", color: "var(--by-text-3)" }}>
                    Every milestone you dispatch will appear here with its platform targets, critic scores, and the full agent decision trace.
                  </div>
                </>
              ) : "No runs match this filter."}
            </div>
          ) : (
            filteredDispatches.map((dispatch, index) => {
              const SourceIcon = getSourceIcon(dispatch.source);
              const timeStr = new Date(dispatch.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              // Status colors and labels
              let statusLabel = "pending";
              let statusColor = "var(--by-text-3)";
              let statusBg = "rgba(255,255,255,0.04)";

              if (dispatch.is_post_worthy === false) {
                statusLabel = "held";
                statusColor = "var(--by-red)";
                statusBg = "rgba(248,113,113,0.08)";
              } else if (dispatch.is_post_worthy === true) {
                const hasBlockedStamp = dispatch.stamps.some(s => s.status === "rejected" || (s.critic_score !== null && s.critic_score < 7));
                if (hasBlockedStamp) {
                  statusLabel = "blocked";
                  statusColor = "var(--by-red)";
                  statusBg = "rgba(248,113,113,0.08)";
                } else {
                  const hasDrafts = dispatch.stamps.some(s => s.draft_id !== null);
                  statusLabel = hasDrafts ? "ready" : "running";
                  statusColor = hasDrafts ? "var(--by-green)" : "var(--by-accent)";
                  statusBg = hasDrafts ? "rgba(63,185,80,0.08)" : "rgba(232,94,44,0.08)";
                }
              }

              return (
                <button
                  key={dispatch.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: index < filteredDispatches.length - 1 ? "0.5px solid var(--by-border)" : "none",
                    background: "transparent",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                    cursor: "pointer",
                    color: "inherit",
                    transition: "background-color 150ms ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <SourceIcon size={16} stroke={1.5} color="var(--by-accent)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>
                        {dispatch.project_name.toLowerCase()}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--by-text-3)" }}>·</span>
                      <span style={{ fontSize: 10, color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace" }}>{timeStr}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {dispatch.body}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9,
                        color: statusColor,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: statusBg,
                        border: `0.5px solid ${statusColor}`,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {!selectedDispatch && activeFilter === "blocked" && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "var(--by-red)",
            marginTop: 4
          }}
        >
          Blocked runs are surfaced here for quick debugging.
        </div>
      )}
    </div>
  );
}
