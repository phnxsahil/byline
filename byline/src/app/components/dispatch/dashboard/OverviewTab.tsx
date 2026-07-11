import React from "react";
import {
  IconArrowRight,
  IconBolt,
  IconBrain,
  IconCode,
  IconGitBranch,
  IconUsers,
  IconArrowUpRight,
  IconCheck,
  IconCornerDownRight,
} from "@tabler/icons-react";
import { type DispatchRead, type Project } from "../../../api";

interface OverviewTabProps {
  onPublish: (text: string) => void;
  onVoicePublish: (transcription: string, dispatchId: string) => void;
  isMobile: boolean;
  projects: Project[];
  activeProject: Project | null;
  dispatches: DispatchRead[];
  onSelectDispatch: (dispatch: DispatchRead) => void;
  onNavigate: (tab: string) => void;
}

const ONBOARDING_STEPS = [
  {
    id: "chat",
    label: "Log a milestone",
    desc: "Type what you shipped in the Agent Chat →",
    cta: "Use the chat on the right",
    ctaTarget: null,
    spotlight: true,
  },
  {
    id: "review",
    label: "Review the drafts",
    desc: "Agents write platform-native posts for you",
    cta: "Go to Desk",
    ctaTarget: "desk",
  },
  {
    id: "approve",
    label: "Approve & ship",
    desc: "One click sends it to LinkedIn, X, Reddit",
    cta: "Go to Activity",
    ctaTarget: "activity",
  },
];

export function OverviewTab({
  onPublish,
  isMobile,
  projects,
  activeProject,
  dispatches,
  onSelectDispatch,
  onNavigate,
}: OverviewTabProps) {
  const hasDispatches = dispatches.length > 0;
  const isNew = !hasDispatches;

  const stats = React.useMemo(() => {
    const totalDispatches = dispatches.length;
    const totalProjects = projects.length;
    const runs = dispatches.filter(d => d.stamps.some(s => s.status !== "pending")).length;
    return [
      { label: "Milestones", value: totalDispatches, icon: IconBolt },
      { label: "Projects", value: totalProjects, icon: IconCode },
      { label: "Completed", value: runs, icon: IconBrain },
      { label: "Platforms", value: 4, icon: IconUsers },
      { label: "Commits", value: 14 + totalDispatches * 3, icon: IconGitBranch },
    ];
  }, [dispatches, projects]);

  const handleRowClick = (d: DispatchRead) => {
    onSelectDispatch(d);
    onNavigate("desk");
  };

  // Determine which onboarding steps are "done"
  const completedSteps = React.useMemo(() => {
    const done = new Set<string>();
    if (hasDispatches) done.add("chat");
    if (dispatches.some(d => d.stamps.some(s => s.status === "approved"))) done.add("review");
    if (dispatches.some(d => d.stamps.some(s => s.status === "posted"))) done.add("approve");
    return done;
  }, [dispatches]);

  const allOnboardingDone = completedSteps.size === ONBOARDING_STEPS.length;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: "radial-gradient(circle at top right, rgba(255,102,0,0.055), transparent 30%), var(--by-bg)",
      }}
    >

      {/* ── HEADER ROW ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile ? 22 : 26,
            fontWeight: 700,
            color: "var(--by-text)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}>
            byline_
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "var(--by-text-3)",
            marginTop: 4,
          }}>
            {activeProject ? `watching ${activeProject.name}` : "no project selected"}
          </div>
        </div>

        {/* Stats pill row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid var(--by-border)",
              borderRadius: 6,
            }}>
              <s.icon size={12} stroke={1.8} color="var(--by-accent)" />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 600 }}>
                {s.value}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ONBOARDING / GET STARTED ───────────────────────────── */}
      {!allOnboardingDone && (
        <div style={{
          background: "var(--by-bg-2)",
          border: "0.5px solid var(--by-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 18px",
            borderBottom: "0.5px solid var(--by-border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--by-amber)" }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "var(--by-text-2)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Get started — {completedSteps.size}/{ONBOARDING_STEPS.length} done
            </span>
          </div>

          {/* Steps */}
          <div style={{ padding: "8px 0" }}>
            {ONBOARDING_STEPS.map((step, idx) => {
              const isDone = completedSteps.has(step.id);
              const isNext = !isDone && ONBOARDING_STEPS.findIndex(s => !completedSteps.has(s.id)) === idx;

              return (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 18px",
                    background: isNext ? "rgba(232, 94, 44, 0.04)" : "transparent",
                    borderLeft: `2px solid ${isNext ? "var(--by-accent)" : "transparent"}`,
                    transition: "background 100ms ease",
                  }}
                >
                  {/* Step indicator */}
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: isDone ? "rgba(63, 185, 80, 0.15)" : isNext ? "rgba(232, 94, 44, 0.15)" : "transparent",
                    border: `1px solid ${isDone ? "var(--by-green)" : isNext ? "var(--by-accent)" : "var(--by-border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 100ms ease",
                  }}>
                    {isDone ? (
                      <IconCheck size={12} color="var(--by-green)" stroke={2.5} />
                    ) : (
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: isNext ? "var(--by-accent)" : "var(--by-text-3)" }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: isDone ? "var(--by-text-3)" : "var(--by-text)",
                      textDecoration: isDone ? "line-through" : "none",
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: "var(--by-text-3)",
                      marginTop: 2,
                    }}>
                      {step.desc}
                    </div>
                  </div>

                  {/* CTA */}
                  {isNext && (
                    step.spotlight ? (
                      /* Pulsing arrow pointing right → to Agent Chat */
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        background: "var(--by-accent)",
                        borderRadius: 6,
                        cursor: "default",
                        animation: "by-rail-pulse 2s ease-in-out infinite",
                      }}>
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11,
                          color: "#fff",
                          fontWeight: 600,
                        }}>
                          Agent Chat →
                        </span>
                        <IconCornerDownRight size={13} color="#fff" stroke={2} />
                      </div>
                    ) : (
                      <button
                        onClick={() => step.ctaTarget && onNavigate(step.ctaTarget)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 12px",
                          background: "rgba(255,255,255,0.06)",
                          border: "0.5px solid var(--by-border)",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11,
                          color: "var(--by-text-2)",
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                      >
                        {step.cta}
                        <IconArrowUpRight size={12} stroke={2} />
                      </button>
                    )
                  )}

                  {isDone && (
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-green)" }}>done</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: "var(--by-border)" }}>
            <div style={{
              height: "100%",
              width: `${(completedSteps.size / ONBOARDING_STEPS.length) * 100}%`,
              background: "var(--by-accent)",
              transition: "width 400ms ease",
            }} />
          </div>
        </div>
      )}

      {/* ── RECENT MILESTONES ──────────────────────────────────── */}
      <div style={{
        background: "var(--by-bg-2)",
        border: "0.5px solid var(--by-border)",
        borderRadius: 10,
        overflow: "hidden",
        flex: hasDispatches ? 1 : undefined,
      }}>
        <div style={{
          padding: "12px 18px",
          borderBottom: "0.5px solid var(--by-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "var(--by-text-2)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Recent milestones
          </span>
          {hasDispatches && (
            <button
              onClick={() => onNavigate("activity")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--by-text-3)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--by-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--by-text-3)")}
            >
              view all
              <IconArrowRight size={12} stroke={1.8} />
            </button>
          )}
        </div>

        {!hasDispatches ? (
          <div style={{
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(232, 94, 44, 0.1)",
              border: "0.5px solid rgba(232, 94, 44, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <IconBolt size={18} color="var(--by-accent)" stroke={1.8} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--by-text-2)", fontWeight: 500 }}>
              No milestones yet
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--by-text-3)", lineHeight: 1.6, maxWidth: 280 }}>
              Type what you shipped in the Agent Chat on the right. The agents will take it from there.
            </div>
            <button
              onClick={() => onPublish("shipped pgvector content ranking and cut query response times in half")}
              style={{
                marginTop: 8,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid var(--by-border)",
                borderRadius: 6,
                color: "var(--by-text-2)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                transition: "background 100ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              → try a sample run
            </button>
          </div>
        ) : (
          dispatches.slice(0, 8).map((r, i) => {
            const timeStr = new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const isCompleted = r.stamps.some(s => s.status !== "pending");
            const statusLabel = r.is_post_worthy === false ? "skip" : isCompleted ? "ready" : "pending";
            const statusColor = statusLabel === "ready" ? "var(--by-green)" : statusLabel === "skip" ? "var(--by-red)" : "var(--by-amber)";

            return (
              <div
                key={r.id}
                onClick={() => handleRowClick(r)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 18px",
                  borderBottom: i < Math.min(dispatches.length, 8) - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                  cursor: "pointer",
                  transition: "background 100ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Status dot */}
                <div style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: statusColor,
                  flexShrink: 0,
                  opacity: 0.8,
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "var(--by-text-3)",
                    marginBottom: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>
                    {r.project_name}
                  </div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "var(--by-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {r.body}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)" }}>{timeStr}</span>
                  <div style={{
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: statusColor,
                    background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
                    border: `0.5px solid color-mix(in srgb, ${statusColor} 20%, transparent)`,
                  }}>
                    {statusLabel}
                  </div>
                  <IconArrowRight size={12} stroke={1.5} color="var(--by-text-3)" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
