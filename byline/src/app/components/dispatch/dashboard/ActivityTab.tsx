import React, { useMemo, useState } from "react";
import {
  IconArrowLeft,
  IconBolt,
  IconCheck,
  IconEdit,
} from "@tabler/icons-react";
import { AGENTS_LIST, AgentStep, STATUS_COLORS } from "./AgentRail";

interface ActivityTabProps {
  isMobile: boolean;
  agentSteps: AgentStep[];
}

type ActivityFilter =
  | "all"
  | "runs"
  | "edits"
  | "approvals"
  | "linkedin"
  | "x"
  | "reddit"
  | "threads"
  | "blocked";

type ActivityEventKind = "run" | "edit" | "approval";

interface ActivityEvent {
  id: string;
  kind: ActivityEventKind;
  text: string;
  platform: string;
  time: string;
}

const FILTERS: { id: ActivityFilter; label: string; tone?: "blocked" }[] = [
  { id: "all", label: "All" },
  { id: "runs", label: "Runs" },
  { id: "edits", label: "Edits" },
  { id: "approvals", label: "Approvals" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "reddit", label: "Reddit" },
  { id: "threads", label: "Threads" },
  { id: "blocked", label: "Blocked", tone: "blocked" },
];

function getMilestone(agentSteps: AgentStep[]) {
  const milestoneLine = agentSteps
    .flatMap((step) => step.input.context)
    .find((line) => line.toLowerCase().startsWith("milestone:"));

  return milestoneLine ? milestoneLine.split(":").slice(1).join(":").trim() : "Untitled milestone";
}

function getCurrentRunSummary(agentSteps: AgentStep[]) {
  const strategist = agentSteps.find((step) => step.agentId === "strategist");
  return strategist?.decisions.at(-1)?.detail ?? "Waiting for pipeline output";
}

export function ActivityTab({ isMobile, agentSteps }: ActivityTabProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  const milestone = useMemo(() => getMilestone(agentSteps), [agentSteps]);
  const currentRunBlocked = agentSteps.some(
    (step) => step.status === "blocked" || step.status === "error",
  );

  const events = useMemo<ActivityEvent[]>(
    () => [
      {
        id: "latest-run",
        kind: "run",
        text: `logged a pipeline run for milestone "${milestone}"`,
        platform: "Strategist → Critic",
        time: "just now",
      },
      {
        id: "linkedin-edit",
        kind: "edit",
        text: "You edited the LinkedIn draft",
        platform: "LinkedIn",
        time: "1h ago",
      },
      {
        id: "x-approval",
        kind: "approval",
        text: "X thread approved for posting",
        platform: "X",
        time: "45m ago",
      },
      {
        id: "threads-run",
        kind: "run",
        text: 'logged a pipeline run for milestone "Added user feedback loop"',
        platform: "Threads",
        time: "1d ago",
      },
    ],
    [milestone],
  );

  const filteredEvents = events.filter((event) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "runs") return event.kind === "run";
    if (activeFilter === "edits") return event.kind === "edit";
    if (activeFilter === "approvals") return event.kind === "approval";
    if (activeFilter === "blocked") return event.kind === "run" && currentRunBlocked;
    return event.platform.toLowerCase().includes(activeFilter);
  });

  const selectedRun = selectedRunId ? agentSteps : null;

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
          Activity Log
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;
            const blockedTone = filter.tone === "blocked";
            return (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setSelectedRunId(null);
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
      </div>

      {selectedRun ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <button
            onClick={() => setSelectedRunId(null)}
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
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--by-text)",
              }}
            >
              {milestone}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "var(--by-text-2)",
              }}
            >
              {getCurrentRunSummary(agentSteps)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AGENTS_LIST.map((agent) => {
              const step = selectedRun.find((entry) => entry.agentId === agent.id);
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
                        <div key={`${agent.id}-${line}`}>• {line}</div>
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
                          key={`${agent.id}-${decision.label}`}
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
          {filteredEvents.length === 0 ? (
            <div
              style={{
                padding: 18,
                color: "var(--by-text-2)",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
              }}
            >
              No runs match the current filter.
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const clickable = event.kind === "run" && agentSteps.length > 0;
              const Icon = event.kind === "run" ? IconBolt : event.kind === "edit" ? IconEdit : IconCheck;

              return (
                <button
                  key={event.id}
                  onClick={() => clickable && setSelectedRunId(event.id)}
                  disabled={!clickable}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: index < filteredEvents.length - 1 ? "0.5px solid var(--by-border)" : "none",
                    background: "transparent",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    textAlign: "left",
                    cursor: clickable ? "pointer" : "default",
                    color: "inherit",
                  }}
                >
                  <Icon size={14} stroke={1.5} color="var(--by-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "var(--by-text)", marginBottom: 2 }}>
                      {event.text}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--by-text-3)" }}>
                      {event.platform} · {event.time}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {!selectedRun && activeFilter === "blocked" && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "var(--by-red)",
          }}
        >
          Blocked runs are surfaced here for quick debugging.
        </div>
      )}
    </div>
  );
}
