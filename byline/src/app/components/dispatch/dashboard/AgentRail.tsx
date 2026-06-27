import { useEffect, useRef, useState } from "react";
import {
  IconMaximize,
  IconMinimize,
  IconRobot,
  IconBolt,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";

export interface AgentStep {
  agentId: "strategist" | "linkedin" | "x" | "reddit" | "qa" | "critic";
  startedAt: number;
  finishedAt?: number;
  status: "pending" | "running" | "done" | "blocked" | "error";
  input: { context: string[]; instructions: string };
  output?: { draft?: string; reasoning?: string; score?: number };
  decisions: { label: string; detail: string }[];
}

interface AgentRailProps {
  railState: "collapsed" | "expanded" | "fullscreen";
  onRailStateChange: (state: "collapsed" | "expanded" | "fullscreen") => void;
  agentSteps: AgentStep[];
  isRunning: boolean;
  onRunMilestone: (txt: string, images?: string[]) => void;
  onNavigate?: (tab: string) => void;
}

type AgentId = AgentStep["agentId"];

export const AGENTS_LIST: { id: AgentId; name: string }[] = [
  { id: "strategist", name: "Strategist" },
  { id: "linkedin", name: "LinkedIn Writer" },
  { id: "x", name: "X Writer" },
  { id: "reddit", name: "Reddit Writer" },
  { id: "qa", name: "QA Agent" },
  { id: "critic", name: "Critic" },
];

export const STATUS_COLORS: Record<AgentStep["status"], string> = {
  pending: "var(--by-text-3)",
  running: "var(--by-amber)",
  done: "var(--by-green)",
  blocked: "var(--by-red)",
  error: "var(--by-red)",
};

function getStatusLabel(status: AgentStep["status"]) {
  switch (status) {
    case "running":
      return "running";
    case "done":
      return "done";
    case "blocked":
      return "blocked";
    case "error":
      return "error";
    default:
      return "pending";
  }
}

export function AgentRail({
  railState,
  onRailStateChange,
  agentSteps,
  isRunning,
  onRunMilestone,
  onNavigate,
}: AgentRailProps) {
  const [input, setInput] = useState("");
  const [chatImages, setChatImages] = useState<string[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<AgentId | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentId>("strategist");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const prevStepsLength = useRef(0);
  useEffect(() => {
    if (agentSteps.length > prevStepsLength.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevStepsLength.current = agentSteps.length;
  }, [agentSteps.length]);

  useEffect(() => {
    if (chatImages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatImages.length]);

  useEffect(() => {
    if (agentSteps.length === 0) {
      setSelectedAgent("strategist");
      return;
    }

    if (!agentSteps.some((step) => step.agentId === selectedAgent)) {
      setSelectedAgent(agentSteps[0]?.agentId ?? "strategist");
    }
  }, [agentSteps, selectedAgent]);

  const handleSend = () => {
    if (!input.trim() && chatImages.length === 0) return;
    onRunMilestone(input, chatImages.length > 0 ? chatImages : undefined);
    setInput("");
    setChatImages([]);
  };

  const getAgentStatus = (id: AgentId): AgentStep["status"] => {
    return agentSteps.find((step) => step.agentId === id)?.status ?? "pending";
  };

  const getDecisionSummary = (id: AgentId) => {
    const step = agentSteps.find((entry) => entry.agentId === id);
    return step?.decisions.at(-1)?.label ?? "Waiting for work";
  };

  const openAgent = (agentId: AgentId) => {
    setSelectedAgent(agentId);
    if (railState === "collapsed") {
      onRailStateChange("expanded");
    }
  };

  const railWidth = railState === "collapsed" ? 56 : railState === "expanded" ? 280 : "100%";

  const railShell = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--by-bg-2)",
        borderLeft: "0.5px solid var(--by-border)",
        width: railWidth,
        flexShrink: 0,
        position: "relative",
        transition: "width 180ms var(--by-ease-out, cubic-bezier(0.16, 1, 0.3, 1))",
        willChange: "width",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes by-rail-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: "0.5px solid var(--by-border)",
          flexShrink: 0,
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: "rgba(232,94,44,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconRobot size={12} color="var(--by-accent)" stroke={2} />
          </div>
          {railState !== "collapsed" && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--by-text)",
                }}
              >
                Agent Rail
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: "var(--by-text-3)",
                  marginTop: 2,
                }}
              >
                live pipeline state
              </div>
            </div>
          )}
        </div>

        {railState !== "collapsed" && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button
              onClick={() =>
                onRailStateChange(
                  railState === "fullscreen" ? "expanded" : "fullscreen",
                )
              }
              title="Toggle fullscreen"
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: "transparent",
                border: "none",
                color: "var(--by-text-3)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {railState === "fullscreen" ? (
                <IconMinimize size={13} stroke={1.5} />
              ) : (
                <IconMaximize size={13} stroke={1.5} />
              )}
            </button>
            <button
              onClick={() => onRailStateChange("collapsed")}
              title="Collapse"
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: "transparent",
                border: "none",
                color: "var(--by-text-3)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconX size={13} stroke={1.5} />
            </button>
          </div>
        )}
      </div>

      {railState === "collapsed" ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "16px 0",
            overflow: "hidden",
          }}
        >
          {AGENTS_LIST.map((agent) => {
            const status = getAgentStatus(agent.id);
            const isRunning = status === "running";
            const isPending = status === "pending";
            const isError = status === "error";

            return (
              <div
                key={agent.id}
                style={{ position: "relative", width: 24, height: 24, display: "grid", placeItems: "center" }}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <button
                  type="button"
                  aria-label={`${agent.name} ${getStatusLabel(status)}`}
                  onClick={() => openAgent(agent.id)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: isPending ? "transparent" : STATUS_COLORS[status],
                    border: isError
                      ? "1px solid #ffffff"
                      : isPending
                        ? "1px solid var(--by-text-3)"
                        : "1px solid transparent",
                    padding: 0,
                    cursor: "pointer",
                    transition: "transform 150ms ease, opacity 150ms ease",
                    animation: isRunning ? "by-rail-pulse 1.2s ease-in-out infinite" : "none",
                    opacity: isPending ? 0.9 : 1,
                  }}
                />
                {hoveredAgent === agent.id && (
                  <div
                    style={{
                      position: "absolute",
                      left: 20,
                      top: "50%",
                      transform: "translateY(-50%)",
                      whiteSpace: "nowrap",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      color: "var(--by-text)",
                      background: "var(--by-bg-3)",
                      padding: "5px 7px",
                      borderRadius: 4,
                      border: "0.5px solid var(--by-border)",
                      zIndex: 20,
                      boxShadow: "0 10px 22px rgba(0,0,0,0.22)",
                    }}
                  >
                    <div>{agent.name}</div>
                    <div style={{ color: "var(--by-text-3)", marginTop: 2 }}>
                      {getDecisionSummary(agent.id)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {agentSteps.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 260,
                  gap: 12,
                  color: "var(--by-text-3)",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                <IconRobot size={32} stroke={1} opacity={0.3} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "var(--by-text-2)",
                  }}
                >
                  No pipeline runs yet.
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  Log a milestone to see agents in action.
                </span>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate("docs")}
                    style={{
                      marginTop: 4,
                      padding: "6px 10px",
                      borderRadius: 5,
                      border: "0.5px solid var(--by-border)",
                      background: "transparent",
                      color: "var(--by-text-2)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      cursor: "pointer",
                    }}
                  >
                    open docs
                  </button>
                )}
              </div>
            ) : (
              AGENTS_LIST.map((agent) => {
                const step = agentSteps.find((entry) => entry.agentId === agent.id);
                const status = step?.status ?? "pending";
                const isSelected = selectedAgent === agent.id;
                const hasDraft = status === "done" && Boolean(step?.output?.draft);

                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgent(agent.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: 10,
                      borderRadius: 8,
                      border: `0.5px solid ${isSelected ? "color-mix(in srgb, var(--by-accent) 35%, var(--by-border))" : "var(--by-border)"}`,
                      background: isSelected ? "rgba(232,94,44,0.05)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      color: "inherit",
                      transition: "background-color 150ms ease, border-color 150ms ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: status === "pending" ? "transparent" : STATUS_COLORS[status],
                          border:
                            status === "pending"
                              ? "1px solid var(--by-text-3)"
                              : status === "error"
                                ? "1px solid #ffffff"
                                : "1px solid transparent",
                          flexShrink: 0,
                          animation:
                            status === "running" ? "by-rail-pulse 1.2s ease-in-out infinite" : "none",
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--by-text)",
                            }}
                          >
                            {agent.name}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: 9,
                              color: STATUS_COLORS[status],
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {getStatusLabel(status)}
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10,
                            color: "var(--by-text-3)",
                            lineHeight: 1.45,
                          }}
                        >
                          {step?.decisions.at(-1)?.label ?? "Waiting for work"}
                        </div>
                      </div>
                    </div>

                    {isSelected && step && (
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <details
                          style={{
                            border: "0.5px solid var(--by-border)",
                            borderRadius: 6,
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
                            {step.input.context.map((line) => (
                              <div key={line}>• {line}</div>
                            ))}
                            <div style={{ color: "var(--by-text-3)" }}>
                              {step.input.instructions}
                            </div>
                          </div>
                        </details>

                        <div>
                          <div
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: 10,
                              color: "var(--by-text-2)",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              marginBottom: 8,
                            }}
                          >
                            What it decided
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {step.decisions.map((decision) => (
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
                                    color:
                                      step.status === "blocked" || step.status === "error"
                                        ? "var(--by-red)"
                                        : step.status === "running"
                                          ? "var(--by-amber)"
                                          : "var(--by-accent)",
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
                                    lineHeight: 1.45,
                                  }}
                                >
                                  <span style={{ color: "var(--by-text)" }}>
                                    [{decision.label}]
                                  </span>{" "}
                                  {decision.detail}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {step.status === "done" && step.output && (
                          <div>
                            <div
                              style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 10,
                                color: "var(--by-text-2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: 8,
                              }}
                            >
                              Output
                            </div>
                            <div
                              style={{
                                padding: "8px 10px",
                                background: "var(--by-bg)",
                                borderRadius: 6,
                                border: "0.5px solid var(--by-border)",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 10,
                                color: "var(--by-text)",
                                lineHeight: 1.55,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {step.output.draft ??
                                step.output.reasoning ??
                                (typeof step.output.score === "number"
                                  ? `Score: ${step.output.score}/10`
                                  : "Done")}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {hasDraft && !isSelected && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "8px 10px",
                          background: "var(--by-bg)",
                          borderRadius: 6,
                          border: "0.5px solid var(--by-border)",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 10,
                          color: "var(--by-text-2)",
                          lineHeight: 1.5,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {step?.output?.draft ?? step?.output?.reasoning ?? ""}
                      </div>
                    )}
                  </button>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              borderTop: "0.5px solid var(--by-border)",
              padding: "8px 12px 10px",
              flexShrink: 0,
            }}
          >
            {chatImages.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                {chatImages.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "0.5px solid var(--by-border)",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() =>
                        setChatImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      style={{
                        position: "absolute",
                        top: 1,
                        right: 1,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  background: "transparent",
                  border: "0.5px solid var(--by-border)",
                  color: "var(--by-text-3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginBottom: 2,
                }}
              >
                <IconPhoto size={13} stroke={1.5} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () =>
                      setChatImages((prev) => [...prev, reader.result as string]);
                    reader.readAsDataURL(file);
                  });
                  if (e.target) e.target.value = "";
                }}
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Log a milestone..."
                rows={1}
                disabled={isRunning}
                style={{
                  flex: 1,
                  minHeight: 30,
                  maxHeight: 60,
                  padding: "5px 8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid var(--by-border)",
                  borderRadius: 5,
                  color: "var(--by-text)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  resize: "none",
                  outline: "none",
                }}
                onFocus={(event) => {
                  event.currentTarget.style.borderColor =
                    "color-mix(in srgb, var(--by-accent) 45%, transparent)";
                }}
                onBlur={(event) => {
                  event.currentTarget.style.borderColor = "var(--by-border)";
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && chatImages.length === 0) || isRunning}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  background:
                    (input.trim() || chatImages.length > 0) && !isRunning
                      ? "var(--by-accent)"
                      : "rgba(255,255,255,0.05)",
                  border: "none",
                  color:
                    (input.trim() || chatImages.length > 0) && !isRunning
                      ? "#EAE5DC"
                      : "var(--by-text-3)",
                  cursor:
                    (input.trim() || chatImages.length > 0) && !isRunning
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconBolt size={13} stroke={2} fill="currentColor" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return railShell;
}
