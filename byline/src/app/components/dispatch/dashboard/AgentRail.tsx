import { useEffect, useRef, useState } from "react";
import {
  IconMaximize,
  IconMinimize,
  IconRobot,
  IconBolt,
  IconPhoto,
  IconX,
  IconCheck,
  IconTerminal2,
  IconUser,
  IconMessage,
  IconCode
} from "@tabler/icons-react";
import Avatar from "boring-avatars";

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
  isFullWidth?: boolean;
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

export function AgentRail({
  railState,
  onRailStateChange,
  agentSteps,
  isRunning,
  onRunMilestone,
  onNavigate,
  isFullWidth = false,
}: AgentRailProps) {
  const [input, setInput] = useState("");
  const [chatImages, setChatImages] = useState<string[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<AgentId | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const prevStepsLength = useRef(0);
  useEffect(() => {
    if (agentSteps.length > prevStepsLength.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevStepsLength.current = agentSteps.length;
  }, [agentSteps.length]);

  // Auto-scroll chat feed on new decisions or status changes
  useEffect(() => {
    if (railState !== "collapsed") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [agentSteps, railState]);

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

  const railWidth = isFullWidth ? "100%" : (railState === "collapsed" ? 56 : railState === "expanded" ? 340 : "100%");

  // Extract User Prompt from the first agent step (Strategist)
  const userPromptContext = agentSteps[0]?.input.context.find((c) => c.startsWith("Milestone: "));
  const userPrompt = userPromptContext ? userPromptContext.replace("Milestone: ", "") : null;

  const activeAgents = agentSteps.filter((step) => step.status !== "pending");

  const railShell = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--by-bg)", // Darker, cleaner background like an IDE terminal
        borderLeft: "0.5px solid var(--by-border)",
        width: railWidth,
        flexShrink: 0,
        position: "relative",
        transition: "width 100ms var(--by-ease-out, cubic-bezier(0.16, 1, 0.3, 1))",
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
          .chat-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .chat-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb {
            background: var(--by-border);
            border-radius: 4px;
          }
        `}
      </style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: "0.5px solid var(--by-border)",
          background: "var(--by-bg-2)",
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
            <IconTerminal2 size={12} color="var(--by-accent)" stroke={2} />
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
                Agent Chat
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: isRunning ? "var(--by-amber)" : "var(--by-text-3)",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                {isRunning && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--by-amber)", animation: "by-rail-pulse 1s infinite" }} />}
                {isRunning ? "pipeline active" : "idle"}
              </div>
            </div>
          )}
        </div>

        {!isFullWidth && railState !== "collapsed" && (
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

      {/* COLLAPSED STATE */}
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
            background: "var(--by-bg-2)",
          }}
        >
          {AGENTS_LIST.map((agent) => {
            const status = getAgentStatus(agent.id);
            const isAgentRunning = status === "running";
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
                  aria-label={`${agent.name} ${status}`}
                  onClick={() => onRailStateChange("expanded")}
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
                    transition: "transform 100ms ease, opacity 100ms ease",
                    animation: isAgentRunning ? "by-rail-pulse 1.2s ease-in-out infinite" : "none",
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
        /* EXPANDED CHAT FEED STATE */
        <>
          <div
            className="chat-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
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
                <IconMessage size={32} stroke={1} opacity={0.3} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "var(--by-text-2)",
                  }}
                >
                  Ready for new tasks.
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  Log a milestone below to spawn agents.
                </span>
              </div>
            ) : (
              <>
                {/* 1. USER PROMPT BUBBLE */}
                {userPrompt && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-text-3)" }}>You</span>
                      <Avatar name="Sahil" variant="marble" colors={["#E8593C", "#2C2C2A", "#F0EDE8", "#C44A2E", "#1F1F22"]} size={16} />
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        padding: "10px 14px",
                        borderRadius: "12px 0px 12px 12px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "var(--by-text)",
                        maxWidth: "85%",
                        border: "0.5px solid var(--by-border)",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      {userPrompt}
                    </div>
                  </div>
                )}

                {/* 2. SUBAGENT CHAT STREAM */}
                {activeAgents.map((step) => {
                  const agentInfo = AGENTS_LIST.find((a) => a.id === step.agentId)!;
                  const isAgentRunning = step.status === "running";
                  const isDone = step.status === "done";
                  const isError = step.status === "error" || step.status === "blocked";
                  
                  return (
                    <div key={step.agentId} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 20, height: 20, borderRadius: 4, 
                          background: isError ? "rgba(248, 113, 113, 0.15)" : isAgentRunning ? "rgba(245, 158, 11, 0.15)" : "rgba(63, 185, 80, 0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `0.5px solid ${isError ? "rgba(248, 113, 113, 0.3)" : isAgentRunning ? "rgba(245, 158, 11, 0.3)" : "rgba(63, 185, 80, 0.3)"}`,
                        }}>
                           {isError ? <IconX size={12} color="var(--by-red)" /> : isDone ? <IconCheck size={12} color="var(--by-green)" /> : <IconRobot size={12} color={isAgentRunning ? "var(--by-amber)" : "var(--by-text-2)"} />}
                        </div>
                        <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-text)", fontWeight: 600 }}>{agentInfo.name}</span>
                        {isAgentRunning && <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-amber)", animation: "by-rail-pulse 1.2s infinite" }}>running...</span>}
                        {isDone && <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-text-3)" }}>completed</span>}
                        {isError && <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-red)" }}>{step.status}</span>}
                      </div>

                      {/* Agent Reasoning Stream (Expanded if running or error, collapsed if done) */}
                      {(isAgentRunning || isError) && (
                         <div
                           style={{
                             background: "var(--by-bg-2)",
                             padding: "10px 12px",
                             borderRadius: "0px 8px 8px 8px",
                             fontFamily: "'IBM Plex Mono', monospace",
                             fontSize: 11,
                             color: "var(--by-text-2)",
                             maxWidth: "90%",
                             border: "0.5px solid var(--by-border)",
                             display: "flex",
                             flexDirection: "column",
                             gap: 6
                           }}
                         >
                           {step.decisions.map((decision, idx) => (
                             <div key={idx} style={{ display: "flex", gap: 6 }}>
                               <span style={{ color: isError ? "var(--by-red)" : "var(--by-amber)" }}>›</span>
                               <span>
                                 <span style={{ color: "var(--by-text)", fontWeight: 600 }}>{decision.label}</span>: {decision.detail}
                               </span>
                             </div>
                           ))}
                           {isAgentRunning && (
                             <div style={{ display: "flex", gap: 6, opacity: 0.5, animation: "by-rail-pulse 1s infinite" }}>
                                 <span style={{ color: "var(--by-amber)" }}>›</span>
                                 <span>thinking...</span>
                             </div>
                           )}
                         </div>
                      )}

                      {/* Artifact Card Generation (If done and has draft output) */}
                      {isDone && step.output?.draft && (
                        <div
                          style={{
                            marginTop: 4,
                            background: "var(--by-bg-2)",
                            borderRadius: "0px 8px 8px 8px",
                            border: "0.5px solid var(--by-border)",
                            width: "95%",
                            overflow: "hidden",
                          }}
                        >
                          <div style={{ 
                            padding: "6px 12px", 
                            background: "rgba(255,255,255,0.02)", 
                            borderBottom: "0.5px solid var(--by-border)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}>
                            <IconCode size={12} color="var(--by-text-3)" />
                            <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--by-text-3)" }}>Generated Draft</span>
                          </div>
                          <div style={{ 
                            padding: "12px",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "var(--by-text)",
                            whiteSpace: "pre-wrap",
                            maxHeight: railState === "fullscreen" ? "none" : 200,
                            overflowY: "auto"
                          }} className="chat-scrollbar">
                            {step.output.draft}
                          </div>
                          {onNavigate && (
                            <div style={{
                              padding: "8px 12px",
                              borderTop: "0.5px solid var(--by-border)",
                              display: "flex",
                              justifyContent: "flex-end",
                              background: "var(--by-bg)"
                            }}>
                              <button
                                onClick={() => onNavigate("desk")}
                                style={{
                                  background: "rgba(255,102,0,0.1)",
                                  color: "var(--by-accent)",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: 4,
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  fontSize: 10,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  transition: "background 100ms ease"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,102,0,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,102,0,0.1)"}
                              >
                                Review Draft →
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 3. CHAT INPUT BLOCK (IDE TERMINAL STYLE) */}
          <div
            style={{
              padding: "14px 16px",
              background: "var(--by-bg-2)",
              borderTop: "0.5px solid var(--by-border)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "var(--by-bg)",
                border: "0.5px solid var(--by-border)",
                borderRadius: 10,
                padding: "8px 10px",
                transition: "border-color 100ms ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--by-text-3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--by-border)";
              }}
            >
              {chatImages.length > 0 && (
                <div style={{ display: "flex", gap: 8, paddingBottom: 8, borderBottom: "0.5px solid var(--by-border)", marginBottom: 8 }}>
                  {chatImages.map((src, idx) => (
                    <div key={idx} style={{ position: "relative", width: 40, height: 40, borderRadius: 6, overflow: "hidden", border: "0.5px solid var(--by-border)" }}>
                      <img src={src} alt="Upload" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        onClick={() => setChatImages((prev) => prev.filter((_, i) => i !== idx))}
                        style={{
                          position: "absolute", top: 2, right: 2, width: 14, height: 14,
                          borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff",
                          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                        }}
                      >
                        <IconX size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isRunning}
                placeholder={isRunning ? "Agents are running..." : "Ask Byline or log a milestone..."}
                style={{
                  width: "100%",
                  minHeight: 40,
                  maxHeight: 120,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--by-text)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  resize: "none",
                  padding: 0,
                  lineHeight: 1.4,
                  opacity: isRunning ? 0.5 : 1,
                }}
                className="chat-scrollbar"
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={isRunning}
                    style={{
                      background: "transparent", border: "none", color: "var(--by-text-3)",
                      cursor: isRunning ? "default" : "pointer", padding: 4, borderRadius: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "color 100ms ease, background 100ms ease"
                    }}
                    onMouseEnter={(e) => !isRunning && (e.currentTarget.style.color = "var(--by-text-2)")}
                    onMouseLeave={(e) => !isRunning && (e.currentTarget.style.color = "var(--by-text-3)")}
                  >
                    <IconPhoto size={16} stroke={1.5} />
                  </button>
                  <input
                    type="file"
                    ref={fileRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => {
                        const url = URL.createObjectURL(file);
                        setChatImages((prev) => [...prev, url]);
                      });
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  />
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={isRunning || (!input.trim() && chatImages.length === 0)}
                  style={{
                    background: (!input.trim() && chatImages.length === 0) || isRunning ? "var(--by-bg-3)" : "var(--by-text)",
                    color: (!input.trim() && chatImages.length === 0) || isRunning ? "var(--by-text-3)" : "var(--by-bg)",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: (!input.trim() && chatImages.length === 0) || isRunning ? "default" : "pointer",
                    transition: "all 100ms ease",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return railShell;
}
