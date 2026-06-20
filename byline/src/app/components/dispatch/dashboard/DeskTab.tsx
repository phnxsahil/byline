import React, { useMemo, useState } from "react";
import { IconCheck, IconEdit, IconSend, IconSparkles } from "@tabler/icons-react";
import { AgentStep, STATUS_COLORS } from "./AgentRail";

interface DeskTabProps {
  isMobile: boolean;
  agentSteps: AgentStep[];
}

const PLATFORM_AGENTS = [
  { agentId: "linkedin", label: "LinkedIn" },
  { agentId: "x", label: "X" },
  { agentId: "reddit", label: "Reddit" },
  { agentId: "threads", label: "Threads" },
] as const;

function getStep(agentSteps: AgentStep[], agentId: AgentStep["agentId"]) {
  return agentSteps.find((step) => step.agentId === agentId);
}

function getCriticNotes(criticStep?: AgentStep) {
  if (!criticStep) return [];
  return criticStep.decisions.length > 0 ? criticStep.decisions : [];
}

export function DeskTab({ isMobile, agentSteps }: DeskTabProps) {
  const [activePlatform, setActivePlatform] = useState<(typeof PLATFORM_AGENTS)[number]["agentId"]>("linkedin");
  const activePlatformSteps = useMemo(
    () => PLATFORM_AGENTS.map((platform) => ({ ...platform, step: getStep(agentSteps, platform.agentId) })),
    [agentSteps],
  );
  const activeStep = useMemo(
    () => getStep(agentSteps, activePlatform),
    [agentSteps, activePlatform],
  );
  const criticStep = useMemo(() => getStep(agentSteps, "critic"), [agentSteps]);
  const strategistStep = useMemo(() => getStep(agentSteps, "strategist"), [agentSteps]);

  if (agentSteps.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "16px" : "24px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            padding: 24,
            borderRadius: 18,
            background: "var(--by-bg-2)",
            border: "0.5px solid var(--by-border)",
            textAlign: "center",
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
            The Desk
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 18,
              color: "var(--by-text)",
              fontWeight: 600,
            }}
          >
            No drafts yet. Run a pipeline from Overview or the Agent Rail to see drafts here.
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              color: "var(--by-text-2)",
              lineHeight: 1.65,
            }}
          >
            Once a run completes, this panel will show the same drafts, scores, and critic notes as the rail and activity trace.
          </div>
        </div>
      </div>
    );
  }

  const criticScore = criticStep?.output?.score ?? null;
  const criticSummary = criticStep?.output?.reasoning ?? "Critic output not available yet.";
  const criticNotes = getCriticNotes(criticStep);
  const selectedLabel = PLATFORM_AGENTS.find((platform) => platform.agentId === activePlatform)?.label ?? "LinkedIn";
  const selectedStep = activeStep;

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
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.12fr) minmax(280px, 0.88fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--by-text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                the desk
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--by-text-2)", marginTop: 4 }}>
                review, tighten, approve, then post
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 999,
                background: "rgba(232,94,44,0.1)",
                color: "var(--by-accent)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
              }}
            >
              <IconSparkles size={13} stroke={1.8} />
              critic score {criticScore !== null ? `${criticScore}/10` : "—"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              overflowX: "auto",
            }}
          >
            {activePlatformSteps.map((item) => (
              <button
                key={item.agentId}
                onClick={() => setActivePlatform(item.agentId)}
                style={{
                  flex: 1,
                  minWidth: 110,
                  padding: "14px 14px 13px",
                  background: item.agentId === activePlatform ? "rgba(255,255,255,0.03)" : "transparent",
                  border: "none",
                  borderBottom: `1.5px solid ${item.agentId === activePlatform ? "var(--by-accent)" : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: item.agentId === activePlatform ? "var(--by-text)" : "var(--by-text-3)",
                  fontWeight: item.agentId === activePlatform ? 600 : 500,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 16, display: "grid", gap: 14 }}>
            <div
              style={{
                borderRadius: 16,
                padding: 14,
                background: "var(--by-bg-2)",
                border: `0.5px solid ${selectedStep?.status === "pending" ? "var(--by-border)" : STATUS_COLORS[selectedStep?.status ?? "pending"]}`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: selectedStep?.status === "pending" ? "transparent" : STATUS_COLORS[selectedStep?.status ?? "pending"],
                      border:
                        selectedStep?.status === "pending"
                          ? "1px solid var(--by-text-3)"
                          : selectedStep?.status === "error"
                            ? "1px solid #ffffff"
                            : "1px solid transparent",
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
                    {selectedLabel}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: STATUS_COLORS[selectedStep?.status ?? "pending"],
                  }}
                >
                  {selectedStep?.status ?? "pending"}
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
                  {(selectedStep?.input.context ?? []).map((line) => (
                    <div key={`${activePlatform}-${line}`}>• {line}</div>
                  ))}
                  <div style={{ color: "var(--by-text-3)" }}>{selectedStep?.input.instructions}</div>
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
                  {(selectedStep?.decisions ?? []).map((decision) => (
                    <div
                      key={`${activePlatform}-${decision.label}`}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          color: STATUS_COLORS[selectedStep?.status ?? "pending"],
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

              {!selectedStep && (
                <div
                  style={{
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "0.5px dashed var(--by-border)",
                    background: "rgba(255,255,255,0.02)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 13,
                    color: "var(--by-text-2)",
                    lineHeight: 1.6,
                  }}
                >
                  No draft was generated for {selectedLabel} in this run.
                </div>
              )}

              {selectedStep?.status === "done" && selectedStep?.output?.draft && (
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
                    {selectedStep.output.draft}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "16px",
            }}
          >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--by-text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                critic notes
              </div>
            <div style={{ display: "grid", gap: 10 }}>
              {criticNotes.length > 0 ? (
                criticNotes.map((note) => (
                  <div
                    key={note.label}
                    style={{
                      padding: "12px 12px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.03)",
                      border: "0.5px solid rgba(255,255,255,0.06)",
                      color: "var(--by-text-2)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.65,
                    }}
                  >
                    <span style={{ color: "var(--by-text)" }}>{note.label}:</span> {note.detail}
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--by-text-3)", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                  No critic notes yet.
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "var(--by-text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              approval flow
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "strategist", value: strategistStep?.output?.reasoning ?? "Waiting on strategist output" },
                { label: "critic", value: criticSummary },
                { label: "final state", value: criticStep?.status === "blocked" ? "Blocked runs stay visible in storage and on the rail." : "Last run remains hydrated from localStorage." },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "11px 12px",
                    borderRadius: 14,
                    background: "rgba(10,10,12,0.24)",
                    border: "0.5px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{row.label}</span>
                  <span style={{ color: "var(--by-text)", fontFamily: "'Inter', sans-serif", fontSize: 13, textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "0.5px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--by-text)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconSend size={14} stroke={1.7} />
            send back to strategist
          </button>
        </div>
      </div>
    </div>
  );
}
