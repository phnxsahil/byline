import React from "react";
import {
  IconArrowRight,
  IconBolt,
  IconBrain,
  IconCode,
  IconGitBranch,
  IconSparkles,
  IconUsers,
  IconMicrophone,
} from "@tabler/icons-react";
import { type DispatchRead, type Project } from "../../../api";
import { AudioRecorder } from "./AudioRecorder";
import { SetupChecklist } from "./SetupChecklist";

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

function deriveWatcherNotes(dispatches: DispatchRead[], projects: Project[]): string[] {
  const notes: string[] = [];

  if (dispatches.length === 0) {
    notes.push("no dispatches yet — run your first pipeline to see signals here");
    notes.push("voice profile loaded with opener patterns and banned phrase list");
    notes.push("github watcher ready — connect a repo in settings to enable auto-detection");
    return notes;
  }

  const pendingReview = dispatches.filter(d => d.stamps.some(s => s.status === "ready") && d.stamps.every(s => s.status !== "approved")).length;
  if (pendingReview > 0) {
    notes.push(`${pendingReview} dispatch${pendingReview > 1 ? "es" : ""} ready for review in The Desk`);
  }

  const platforms = dispatches.flatMap(d => d.suggested_platforms || []);
  const platformCounts: Record<string, number> = {};
  platforms.forEach(p => { platformCounts[p] = (platformCounts[p] || 0) + 1; });
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];
  if (topPlatform) {
    notes.push(`${topPlatform[0]} is your most-used platform (${topPlatform[1]} dispatch${topPlatform[1] > 1 ? "es" : ""})`);
  }

  const blockedCount = dispatches.filter(d => d.is_post_worthy === false).length;
  if (blockedCount > 0) {
    notes.push(`${blockedCount} milestone${blockedCount > 1 ? "s" : ""} held by Strategist — check Activity for reasoning`);
  } else if (dispatches.length > 2) {
    notes.push("all recent milestones cleared the post-worthiness threshold");
  }

  const redditUsed = dispatches.some(d => d.suggested_platforms?.includes("reddit"));
  if (!redditUsed && dispatches.length >= 3) {
    notes.push("reddit is still blocked — dispatches haven't had enough technical depth yet");
  }

  const totalProjects = projects.length;
  if (totalProjects > 1) {
    notes.push(`${totalProjects} projects being tracked — ${totalProjects > 3 ? "consider cross-project synthesis" : "all active"}`);
  }

  return notes.slice(0, 3);
}

export function OverviewTab({
  onPublish,
  onVoicePublish,
  isMobile,
  projects,
  activeProject,
  dispatches,
  onSelectDispatch,
  onNavigate,
}: OverviewTabProps) {
  const [input, setInput] = React.useState(
    "shipped a cleaner landing page for byline and the real challenge was making the product feel obvious in five seconds"
  );
  const [isRecordingMode, setIsRecordingMode] = React.useState(false);
  const hasActiveProject = Boolean(activeProject?.id);

  const stats = React.useMemo(() => {
    const totalDispatches = dispatches.length;
    const totalProjects = projects.length;
    const runs = dispatches.filter(d => d.stamps.some(s => s.status !== "pending")).length;
    return [
      { label: "Milestones Logged", value: totalDispatches, note: "all channels", icon: IconBolt },
      { label: "Active Projects", value: totalProjects, note: "monitored", icon: IconCode },
      { label: "Completed Runs", value: runs, note: "stamped drafts", icon: IconBrain },
      { label: "Commits Watched", value: 14 + totalDispatches * 3, note: "mostly product work", icon: IconGitBranch },
      { label: "Platforms Live", value: 4, note: "voice-tuned", icon: IconUsers },
    ];
  }, [dispatches, projects]);

  const handleRowClick = (d: DispatchRead) => {
    onSelectDispatch(d);
    onNavigate("desk");
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        background:
          "radial-gradient(circle at top right, rgba(255,102,0,0.06), transparent 28%), var(--by-bg)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: isMobile ? "18px" : "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              borderRadius: 999,
              background: "rgba(255,102,0,0.08)",
              color: "var(--by-accent)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              alignSelf: "flex-start",
            }}
          >
            <IconSparkles size={12} stroke={1.8} />
            Log a milestone
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--by-font-display), sans-serif",
                fontSize: isMobile ? 26 : 30,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "var(--by-text)",
              }}
            >
              Ship a milestone.
              <br />
              <span style={{ color: "var(--by-accent)" }}>Byline</span> writes it everywhere.
            </div>
            <p
              style={{
                margin: "10px 0 0",
                color: "var(--by-text-2)",
                fontFamily: "var(--by-font-body), sans-serif",
                fontSize: 13,
                lineHeight: 1.65,
                maxWidth: 480,
              }}
            >
              Describe what you built or learned. The 5-agent pipeline picks the angle, writes
              platform-native drafts, and scores them — you just review and approve.
            </p>
          </div>

            <div
              style={{
                borderRadius: 4,
                border: "0.5px solid rgba(245,240,232,0.07)",
                background: "rgba(10,10,10,0.4)",
                padding: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--by-text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                What happened? (be specific)
              </div>
            {isRecordingMode && activeProject?.id ? (
              <AudioRecorder
                projectId={activeProject.id}
                onTranscriptionSuccess={(transcription, dispatchId) => {
                  if (activeProject?.id) {
                    onVoicePublish(transcription, dispatchId);
                    setIsRecordingMode(false);
                  }
                }}
                onCancel={() => setIsRecordingMode(false)}
              />
            ) : (
              <>
                <textarea
                  aria-label="Describe the milestone to run through the pipeline demo"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.025)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "var(--by-text)",
                    fontFamily: "var(--by-font-body), sans-serif",
                    fontSize: 14,
                    resize: "vertical",
                    outline: "none",
                    lineHeight: 1.65,
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                    more texture → better angle selection
                  </span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        if (hasActiveProject) {
                          setIsRecordingMode(true);
                        }
                      }}
                      disabled={!hasActiveProject}
                      title={!hasActiveProject ? "Select a project first" : "Record a voice note"}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        padding: "9px 14px",
                        background: hasActiveProject ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.02)",
                        color: hasActiveProject ? "var(--by-text-2)" : "var(--by-text-3)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        cursor: hasActiveProject ? "pointer" : "not-allowed",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "background 120ms ease",
                        opacity: hasActiveProject ? 1 : 0.7,
                      }}
                    >
                      <IconMicrophone size={12} stroke={2} />
                      record voice note
                    </button>
                    <button
                      onClick={() => {
                        if (input.trim()) {
                          onPublish(input.trim());
                        }
                      }}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "9px 14px",
                        background: "#A63D00",
                        color: "#F5F2EC",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "opacity 120ms ease",
                      }}
                    >
                      <IconBolt size={12} stroke={2} aria-hidden="true" />
                      run pipeline
                    </button>
                  </div>
                </div>
                {!hasActiveProject && (
                  <span style={{ color: "var(--by-text-3)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }}>
                    select a project to enable voice capture
                  </span>
                )}
              </>
            )}
            </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: isMobile ? "18px" : "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
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
            What the system noticed
          </div>
          {deriveWatcherNotes(dispatches, projects).map((note) => (
            <div
              key={note}
              style={{
                padding: "12px 14px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                color: "var(--by-text-2)",
                fontFamily: "var(--by-font-body), sans-serif",
                fontSize: 13,
                lineHeight: 1.65,
              }}
            >
              {note}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <s.icon size={16} stroke={1.6} color="var(--by-accent)" />
            <div style={{ fontFamily: "var(--by-font-mono), monospace", fontSize: 24, fontWeight: 600, color: "var(--by-text)", lineHeight: 1 }}>
              {s.value === 0 ? "0\u200b" : s.value}
            </div>
            <div style={{ fontFamily: "var(--by-font-body), sans-serif", fontSize: 12, color: "var(--by-text-2)" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--by-font-mono), monospace", fontSize: 10, color: "var(--by-text-3)" }}>{s.note}</div>
          </div>
        ))}
      </div>

      {dispatches.length === 0 && <SetupChecklist />}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontFamily: "var(--by-font-mono), monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            recent milestones
          </div>
          <button
            onClick={() => onNavigate("activity")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--by-text-2)",
              fontFamily: "var(--by-font-mono), monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            view all
            <IconArrowRight size={12} stroke={1.8} />
          </button>
        </div>

        {dispatches.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--by-text-3)" }}>
            <div style={{ fontFamily: "var(--by-font-display), sans-serif", fontSize: 16, color: "var(--by-text-2)", marginBottom: 8 }}>
              No pipelines run yet
            </div>
            <p style={{ fontSize: 12, marginBottom: 16, lineHeight: 1.6, maxWidth: 360, margin: "0 auto 16px" }}>
              Once you dispatch a milestone above, completed runs will appear here with their platform, status, and critic score.
            </p>
            <button
              onClick={() => onPublish("shipped pgvector content ranking and cut query response times in half")}
              style={{
                fontFamily: "var(--by-font-mono), monospace",
                fontSize: 11,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--by-border)",
                borderRadius: 4,
                color: "var(--by-text)",
                cursor: "pointer",
              }}
            >
              Run a sample pipeline
            </button>
          </div>
        ) : (
          dispatches.slice(0, 5).map((r, i) => {
            const timeStr = new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Calculate a status string based on stamps
            const isCompleted = r.stamps.some(s => s.status !== "pending");
            const statusLabel = r.is_post_worthy === false ? "skip" : (isCompleted ? "ready" : "pending");
            return (
              <div
                key={r.id}
                onClick={() => handleRowClick(r)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderBottom: i < Math.min(dispatches.length, 5) - 1 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                  gap: 16,
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--by-font-mono), monospace", fontSize: 11, color: "var(--by-text)", fontWeight: 500 }}>
                    {r.project_name.toLowerCase()}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.body}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "var(--by-text-3)", fontFamily: "var(--by-font-mono), monospace" }}>{timeStr}</span>
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: "var(--by-font-mono), monospace",
                      background: statusLabel === "ready" ? "rgba(63,185,80,0.12)" : statusLabel === "skip" ? "rgba(248,113,113,0.1)" : "rgba(255,102,0,0.1)",
                      color: statusLabel === "ready" ? "var(--by-green)" : statusLabel === "skip" ? "var(--by-red)" : "var(--by-accent)",
                    }}
                  >
                    {statusLabel}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
