import React, { useState, useEffect } from "react";
import { IconCheck, IconEdit, IconSend, IconSparkles, IconRefresh } from "@tabler/icons-react";
import { type DispatchRead, type DraftRead } from "../../../api";

interface DeskTabProps {
  isMobile: boolean;
  activeDispatch: DispatchRead | null;
  drafts: DraftRead[];
  onUpdateDraft: (draftId: string, updatedBody: string, newStatus: string) => Promise<void>;
  onSendBack?: () => Promise<void>;
  onRegenerate?: (platform: string) => Promise<void>;
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
  onUpdateDraft,
  onSendBack,
  onRegenerate,
}: DeskTabProps) {
  const [activeTab, setActiveTab] = useState<"linkedin" | "x" | "reddit" | "threads">("linkedin");
  const [editedBody, setEditedBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 24, background: "var(--by-bg)" }}>
        <div style={{ maxWidth: 520, width: "100%", padding: 24, borderRadius: 8, background: "var(--by-bg-2)", border: "0.5px solid var(--by-border)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--by-font-mono), monospace", fontSize: 10, color: "var(--by-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            The Desk
          </div>
          <div style={{ marginTop: 12, fontFamily: "var(--by-font-display), sans-serif", fontSize: 18, color: "var(--by-text)", fontWeight: 600 }}>
            No drafts yet
          </div>
          <p style={{ marginTop: 10, color: "var(--by-text-2)", fontSize: 13, lineHeight: 1.65 }}>
            Run a pipeline from the Overview tab or search palette to evaluate a milestone and view the drafts here.
          </p>
        </div>
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
        gap: 16,
        background: "var(--by-bg)",
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
