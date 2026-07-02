import React, { useState, useEffect, useRef } from "react";
import { IconCheck, IconEdit, IconSparkles, IconRefresh, IconClock, IconArrowRight } from "@tabler/icons-react";
import { type DispatchRead, type DraftRead } from "../../../api";
import { Stamp } from "../Stamp";

interface DeskTabProps {
  isMobile: boolean;
  activeDispatch: DispatchRead | null;
  drafts: DraftRead[];
  allDispatches?: DispatchRead[];
  onUpdateDraft: (draftId: string, updatedBody: string, newStatus: string) => Promise<void>;
  onSendBack?: () => Promise<void>;
  onRegenerate?: (platform: string) => Promise<void>;
  onSelectDispatch?: (dispatch: DispatchRead) => void;
}

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "reddit", label: "Reddit" },
  { id: "threads", label: "Threads" },
] as const;

export function DeskTab({
  isMobile,
  activeDispatch,
  drafts,
  allDispatches = [],
  onUpdateDraft,
  onSendBack,
  onRegenerate,
  onSelectDispatch,
}: DeskTabProps) {
  const [activeTab, setActiveTab] = useState<"linkedin" | "x" | "reddit" | "threads">("linkedin");
  const [editedBody, setEditedBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approvedAnim, setApprovedAnim] = useState(false);
  const [approvedPlatform, setApprovedPlatform] = useState("");
  const [stampText, setStampText] = useState("");
  const stampRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeDraft = drafts.find((d) => d.platform === activeTab);

  useEffect(() => {
    if (activeDraft) {
      setEditedBody(activeDraft.body);
    } else {
      setEditedBody("");
    }
    setIsEditing(false);
  }, [activeDraft, activeTab]);

  if (!activeDispatch) {
    return (
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "var(--by-bg)" }}>
        {/* Dispatch picker when no active dispatch */}
        <div style={{
          width: isMobile ? "100%" : 280, flexShrink: 0,
          borderRight: isMobile ? "none" : "0.5px solid var(--by-border)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          <div style={{ padding: "16px 16px 10px", borderBottom: "0.5px solid var(--by-border)" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Pick a dispatch</div>
            <div style={{ fontSize: 12, color: "var(--by-text-2)" }}>Select a milestone to review its drafts</div>
          </div>
          {allDispatches.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--by-text-3)", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
              No dispatches yet.
            </div>
          ) : (
            allDispatches.map((d, i) => {
              const hasReadyDrafts = d.stamps.some(s => s.status === "ready");
              const timeStr = new Date(d.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDispatch?.(d)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: i < allDispatches.length - 1 ? "0.5px solid var(--by-border)" : "none",
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)" }}>{timeStr}</span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                      padding: "2px 6px", borderRadius: 3,
                      background: hasReadyDrafts ? "rgba(63,185,80,0.1)" : "rgba(255,102,0,0.1)",
                      color: hasReadyDrafts ? "var(--by-green)" : "var(--by-accent)",
                    }}>
                      {hasReadyDrafts ? "ready" : "pending"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--by-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {d.body}
                  </div>
                </button>
              );
            })
          )}
        </div>
        {!isMobile && (
          <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ textAlign: "center", color: "var(--by-text-3)" }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.1 }}>✦</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>The Desk</div>
              <div style={{ fontSize: 14, color: "var(--by-text-2)", marginBottom: 6 }}>Select a dispatch to review</div>
              <p style={{ fontSize: 12, lineHeight: 1.65, maxWidth: 320, margin: "0 auto" }}>
                Pick a milestone from the left, or run a new pipeline from the <strong>Overview</strong> tab.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }


  const handleSave = async () => {
    if (!activeDraft) return;
    setSaving(true);
    try {
      await onUpdateDraft(activeDraft.id, editedBody, activeDraft.status);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save draft edit");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!activeDraft) return;
    setSaving(true);
    try {
      await onUpdateDraft(activeDraft.id, activeDraft.body, "approved");
      // Play byline stamp animation
      setApprovedPlatform(activeTab);
      setApprovedAnim(true);
      setStampText("");
      const byline = "By Sahil — ";
      byline.split("").forEach((char, i) => {
        window.setTimeout(() => setStampText(prev => prev + char), 600 + i * 80);
      });
      window.setTimeout(() => {
        setApprovedAnim(false);
        setStampText("");
      }, 2400);
    } catch (err) {
      alert("Failed to approve draft");
    } finally {
      setSaving(false);
    }
  };

  const isBlocked = activeDraft?.critic_score !== null && activeDraft?.critic_score !== undefined && activeDraft.critic_score < 7;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "var(--by-bg)",
        position: "relative",
      }}
    >
      {/* ── Byline stamp approval animation ────────────────────── */}
      {approvedAnim && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          background: "rgba(13,17,23,0.92)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 20, backdropFilter: "blur(4px)",
        }}>
          <Stamp size={72} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 22,
            color: "var(--by-accent)",
            letterSpacing: "0.02em",
            minHeight: 32,
          }}>
            {stampText}
            <span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "var(--by-text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            {approvedPlatform} draft approved
          </div>
        </div>
      )}
      {/* Dispatch context header */}
      <div
        style={{
          padding: "12px 16px",
          background: "var(--by-bg-2)",
          border: "0.5px solid var(--by-border)",
          borderRadius: 6,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
            Reviewing milestone
          </div>
          <div style={{ fontSize: 13, color: "var(--by-text)", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
            {activeDispatch.body}
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
          {activeDispatch.stamps.map(stamp => (
            <span
              key={stamp.platform}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                padding: "3px 7px",
                borderRadius: 999,
                border: "0.5px solid var(--by-border)",
                color: stamp.status === "ready" ? "var(--by-green)" : "var(--by-text-3)",
                background: stamp.status === "ready" ? "rgba(63,185,80,0.08)" : "transparent",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {stamp.platform}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "var(--by-bg-2)",
            border: "0.5px solid var(--by-border)",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "0.5px solid var(--by-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {PLATFORMS.map((p) => {
                const hasDraft = drafts.some((d) => d.platform === p.id);
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id)}
                    style={{
                      padding: "6px 12px",
                      background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                      border: "none",
                      borderBottom: `2px solid ${isActive ? "var(--by-accent)" : "transparent"}`,
                      color: isActive ? "var(--by-text)" : hasDraft ? "var(--by-text-2)" : "var(--by-text-3)",
                      fontFamily: "var(--by-font-mono), monospace",
                      fontSize: 11,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {activeDraft && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "var(--by-font-mono), monospace",
                  background: isBlocked ? "rgba(248,113,113,0.12)" : "rgba(63,185,80,0.12)",
                  color: isBlocked ? "var(--by-red)" : "var(--by-green)",
                }}
              >
                Score: {activeDraft.critic_score}/10 {isBlocked ? "(Blocked)" : "(Passed)"}
              </div>
            )}
          </div>

          {/* Draft area */}
          <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {!activeDraft ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--by-text-3)" }}>
                No draft generated for {activeTab} by the strategist.
                {onRegenerate && (
                  <button
                    onClick={() => onRegenerate(activeTab)}
                    style={{
                      display: "block",
                      margin: "12px auto 0",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--by-border)",
                      color: "var(--by-text)",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "var(--by-font-mono), monospace",
                    }}
                  >
                    Force generate draft
                  </button>
                )}
              </div>
            ) : (
              <>
                {isBlocked && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 4,
                      background: "rgba(248,113,113,0.08)",
                      border: "0.5px solid var(--by-red)",
                      color: "var(--by-red)",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Blocked by Critic:</strong> {activeDraft.critic_note || "Self-promotion risk or slop detected."}
                  </div>
                )}

                {isEditing ? (
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={8}
                    style={{
                      width: "100%",
                      background: "var(--by-bg)",
                      border: "1px solid var(--by-border)",
                      borderRadius: 4,
                      color: "var(--by-text)",
                      padding: 12,
                      fontFamily: "var(--by-font-body), sans-serif",
                      fontSize: 14,
                      lineHeight: 1.65,
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: 12,
                      background: "rgba(255,255,255,0.01)",
                      border: "0.5px solid var(--by-border)",
                      borderRadius: 4,
                      color: "var(--by-text-2)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      fontFamily: "var(--by-font-body), sans-serif",
                    }}
                  >
                    {activeDraft.body}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "1px solid var(--by-border)",
                          borderRadius: 4,
                          color: "var(--by-text-2)",
                          cursor: "pointer",
                          fontSize: 11,
                          fontFamily: "var(--by-font-mono), monospace",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                          padding: "6px 12px",
                          background: "var(--by-accent)",
                          border: "none",
                          borderRadius: 4,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          fontFamily: "var(--by-font-mono), monospace",
                        }}
                      >
                        Save changes
                      </button>
                    </>
                  ) : (
                    <>
                      {onRegenerate && (
                        <button
                          onClick={() => onRegenerate(activeTab)}
                          style={{
                            padding: "6px 12px",
                            background: "transparent",
                            border: "1px solid var(--by-border)",
                            borderRadius: 4,
                            color: "var(--by-text-2)",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "var(--by-font-mono), monospace",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <IconRefresh size={12} />
                          Regenerate
                        </button>
                      )}
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "1px solid var(--by-border)",
                          borderRadius: 4,
                          color: "var(--by-text-2)",
                          cursor: "pointer",
                          fontSize: 11,
                          fontFamily: "var(--by-font-mono), monospace",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <IconEdit size={12} />
                        Edit Draft
                      </button>
                      {activeDraft.status !== "approved" && !isBlocked && (
                        <button
                          onClick={handleApprove}
                          style={{
                            padding: "6px 12px",
                            background: "var(--by-accent)",
                            border: "none",
                            borderRadius: 4,
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "var(--by-font-mono), monospace",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <IconCheck size={12} />
                          Approve & Publish
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Critic Feedback */}
        <div
          style={{
            background: "var(--by-bg-2)",
            border: "0.5px solid var(--by-border)",
            borderRadius: 8,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "var(--by-font-mono), monospace",
              fontSize: 10,
              color: "var(--by-text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            critic feedback
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeDraft && activeDraft.critic_note ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.02)",
                  border: "0.5px solid var(--by-border)",
                  color: "var(--by-text-2)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {activeDraft.critic_note}
              </div>
            ) : (
              <div style={{ color: "var(--by-text-3)", fontSize: 13 }}>
                No editor notes generated for {activeTab} yet.
              </div>
            )}
          </div>

          <div style={{ borderTop: "0.5px solid var(--by-border)", paddingTop: 14, marginTop: "auto" }}>
            <div style={{ fontSize: 11, color: "var(--by-text-3)", fontFamily: "var(--by-font-mono), monospace", marginBottom: 10 }}>
              pipeline actions
            </div>
            <button
              onClick={onSendBack}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--by-border)",
                borderRadius: 4,
                color: "var(--by-text-2)",
                fontFamily: "var(--by-font-mono), monospace",
                fontSize: 11,
                cursor: "pointer",
                textAlign: "center",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <IconSparkles size={12} />
              send back to strategist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
